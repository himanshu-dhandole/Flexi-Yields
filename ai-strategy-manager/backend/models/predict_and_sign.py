import pandas as pd
import numpy as np
from pymongo import MongoClient
from datetime import datetime, timedelta
import joblib
import json
from eth_account import Account
from eth_account.messages import encode_typed_data
from web3 import Web3
import os
from dotenv import load_dotenv

load_dotenv()

class AllocationPredictor:
    def __init__(self, mongo_uri, db_name, model_path):
        self.client = MongoClient(mongo_uri)
        self.db = self.client[db_name]
        self.w3 = Web3(Web3.HTTPProvider(os.getenv('RPC_URL')))
        
        # Load model
        model_data = joblib.load(model_path)
        self.model = model_data['model']
        self.scaler = model_data['scaler']
        
        # Load private key
        self.private_key = os.getenv('PRIVATE_KEY')
        self.account = Account.from_key(self.private_key)
        self.contract_address = os.getenv('STRATEGY_MANAGER_ADDRESS')
        
    def fetch_current_data(self, days=30):
        """Fetch latest performance data for all strategies"""
        strategies_col = self.db['strategies']
        performance_col = self.db['performance']
        
        strategies = list(strategies_col.find({'active': True}).sort('index', 1))
        
        current_data = []
        for strategy in strategies:
            perf_data = list(performance_col.find({
                'strategy_address': strategy['address'],
                'timestamp': {'$gte': datetime.now() - timedelta(days=days)}
            }).sort('timestamp', 1))
            
            if len(perf_data) >= 10:
                current_data.append({
                    'strategy': strategy['address'],
                    'index': strategy['index'],
                    'current_allocation': strategy.get('allocation', 0),
                    'performance': perf_data
                })
        
        return current_data
    
    def calculate_features(self, performance_data):
        """Calculate features for prediction"""
        df = pd.DataFrame(performance_data)
        df['return'] = df['total_value'].pct_change()
        
        features = {
            'mean_return': df['return'].mean(),
            'std_return': df['return'].std(),
            'sharpe_ratio': (df['return'].mean() - 0.02/365) / df['return'].std() if df['return'].std() > 0 else 0,
            'volatility_7d': df['return'].tail(7).std(),
            'volatility_30d': df['return'].tail(30).std(),
            'max_drawdown': ((1 + df['return']).cumprod() / (1 + df['return']).cumprod().expanding().max() - 1).min(),
            'momentum_7d': df['return'].tail(7).sum(),
            'momentum_14d': df['return'].tail(14).sum(),
            'momentum_30d': df['return'].tail(30).sum(),
            'tvl_growth': (df['total_value'].iloc[-1] - df['total_value'].iloc[0]) / df['total_value'].iloc[0],
            'win_rate': (df['return'] > 0).sum() / len(df),
            'recent_return_3d': df['return'].tail(3).mean(),
            'recent_return_7d': df['return'].tail(7).mean()
        }
        
        return [
            features['mean_return'],
            features['std_return'],
            features['sharpe_ratio'],
            features['volatility_7d'],
            features['volatility_30d'],
            features['max_drawdown'],
            features['momentum_7d'],
            features['momentum_14d'],
            features['momentum_30d'],
            features['tvl_growth'],
            features['win_rate'],
            features['recent_return_3d'],
            features['recent_return_7d']
        ]
    
    def predict_allocations(self):
        """Predict optimal allocations for all strategies"""
        print("Fetching current strategy data...")
        current_data = self.fetch_current_data()
        
        if len(current_data) == 0:
            raise ValueError("No strategies with sufficient data")
        
        print(f"Analyzing {len(current_data)} strategies...")
        
        predictions = []
        for strategy_data in current_data:
            features = self.calculate_features(strategy_data['performance'])
            features_scaled = self.scaler.transform([features])
            
            score = self.model.predict(features_scaled)[0]
            
            predictions.append({
                'index': strategy_data['index'],
                'strategy': strategy_data['strategy'],
                'current_allocation': strategy_data['current_allocation'],
                'predicted_score': score,
                'features': features
            })
        
        # Normalize to sum to 10000
        total_score = sum(p['predicted_score'] for p in predictions)
        
        for pred in predictions:
            raw_allocation = (pred['predicted_score'] / total_score) * 10000
            pred['recommended_allocation'] = int(max(500, min(4000, raw_allocation)))
        
        # Adjust to exactly 10000
        total_alloc = sum(p['recommended_allocation'] for p in predictions)
        adjustment = 10000 - total_alloc
        
        if adjustment != 0:
            predictions[0]['recommended_allocation'] += adjustment
        
        # Calculate confidence
        scores = [p['predicted_score'] for p in predictions]
        confidence = 1.0 - (np.std(scores) / np.mean(scores)) if np.mean(scores) > 0 else 0.7
        confidence = max(0.6, min(0.95, confidence))
        
        return predictions, confidence
    
    def get_agent_nonce(self):
        """Get current nonce for the agent"""
        nonces_col = self.db['agent_nonces']
        nonce_doc = nonces_col.find_one({'agent': self.account.address})
        
        if nonce_doc:
            return nonce_doc['nonce']
        else:
            nonces_col.insert_one({'agent': self.account.address, 'nonce': 0})
            return 0
    
    def increment_nonce(self):
        """Increment nonce after signing"""
        nonces_col = self.db['agent_nonces']
        nonces_col.update_one(
            {'agent': self.account.address},
            {'$inc': {'nonce': 1}},
            upsert=True
        )
    
    def sign_recommendation(self, predictions, confidence):
        """Sign allocation recommendation with EIP-712"""
        nonce = self.get_agent_nonce()
        timestamp = int(datetime.now().timestamp())
        deadline = timestamp + 3600
        
        indices = [p['index'] for p in predictions]
        allocations = [p['recommended_allocation'] for p in predictions]
        
        # EIP-712 structured data
        structured_data = {
            'types': {
                'EIP712Domain': [
                    {'name': 'name', 'type': 'string'},
                    {'name': 'version', 'type': 'string'},
                    {'name': 'chainId', 'type': 'uint256'},
                    {'name': 'verifyingContract', 'type': 'address'}
                ],
                'AIRecommendation': [
                    {'name': 'manager', 'type': 'address'},
                    {'name': 'nonce', 'type': 'uint256'},
                    {'name': 'deadline', 'type': 'uint256'},
                    {'name': 'indices', 'type': 'uint256[]'},
                    {'name': 'allocations', 'type': 'uint256[]'},
                    {'name': 'timestamp', 'type': 'uint256'},
                    {'name': 'modelVersion', 'type': 'string'},
                    {'name': 'confidence', 'type': 'uint256'}
                ]
            },
            'primaryType': 'AIRecommendation',
            'domain': {
                'name': 'StrategyManager',
                'version': '1',
                'chainId': self.w3.eth.chain_id,
                'verifyingContract': self.contract_address
            },
            'message': {
                'manager': self.contract_address,
                'nonce': nonce,
                'deadline': deadline,
                'indices': indices,
                'allocations': allocations,
                'timestamp': timestamp,
                'modelVersion': 'v1.0.0',
                'confidence': int(confidence * 1e18)
            }
        }
        
        # Sign with eth-account 0.10+ API
        encoded_data = encode_typed_data(full_message=structured_data)
        signed_message = self.account.sign_message(encoded_data)
        
        self.increment_nonce()
        
        return {
            'recommendation': structured_data['message'],
            'signature': signed_message.signature.hex(),
            'signer': self.account.address
        }
    
    def save_recommendation(self, signed_data, predictions):
        """Save recommendation to MongoDB for keeper"""
        recommendations_col = self.db['recommendations']
        
        doc = {
            'timestamp': datetime.now(),
            'signer': signed_data['signer'],
            'recommendation': signed_data['recommendation'],
            'signature': signed_data['signature'],
            'predictions': predictions,
            'status': 'pending',
            'submitted': False
        }
        
        result = recommendations_col.insert_one(doc)
        return str(result.inserted_id)


def main():
    predictor = AllocationPredictor(
        mongo_uri=os.getenv('MONGO_URI', 'mongodb://localhost:27017'),
        db_name=os.getenv('MONGO_DB', 'defi_strategies'),
        model_path=os.getenv('MODEL_PATH', 'strategy_model.pkl')
    )
    
    print("🤖 AI Strategy Allocation Agent")
    print("=" * 50)
    
    # Predict allocations
    predictions, confidence = predictor.predict_allocations()
    
    print("\n📊 Predicted Allocations:")
    print("-" * 50)
    for pred in predictions:
        print(f"Strategy {pred['index']}: {pred['recommended_allocation']/100:.2f}%")
        print(f"  Current: {pred['current_allocation']/100:.2f}%")
        print(f"  Score: {pred['predicted_score']:.2f}")
    
    print(f"\n🎯 Confidence: {confidence*100:.1f}%")
    
    # Check minimum confidence
    min_confidence = float(os.getenv('MIN_CONFIDENCE', '0.70'))
    if confidence < min_confidence:
        print(f"\n⚠️  Confidence too low (< {min_confidence*100}%). Skipping submission.")
        return
    
    # Sign recommendation
    print("\n✍️  Signing recommendation...")
    signed_data = predictor.sign_recommendation(predictions, confidence)
    
    # Save to MongoDB
    rec_id = predictor.save_recommendation(signed_data, predictions)
    
    print(f"\n✅ Recommendation saved: {rec_id}")
    print(f"Signer: {signed_data['signer']}")
    print(f"Signature: {signed_data['signature'][:20]}...")
    print("\n📡 Ready for keeper to submit to blockchain")


if __name__ == "__main__":
    main()