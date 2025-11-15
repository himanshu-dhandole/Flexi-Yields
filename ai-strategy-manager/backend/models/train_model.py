"""
AI Strategy Allocation Model - FIXED VERSION
Trains on historical strategy performance data from MongoDB
"""

import pandas as pd
import numpy as np
from pymongo import MongoClient
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
import joblib
from datetime import datetime, timedelta
import warnings
warnings.filterwarnings('ignore')

class StrategyAIModel:
    def __init__(self, mongo_uri, db_name):
        self.client = MongoClient(mongo_uri)
        self.db = self.client[db_name]
        self.model = None
        self.scaler = StandardScaler()
        
    def fetch_historical_data(self, days=90):
        """Fetch strategy performance data from MongoDB"""
        strategies_col = self.db['strategies']
        performance_col = self.db['performance']
        
        # Get all strategies
        strategies = list(strategies_col.find({'active': True}))
        print(f"Found {len(strategies)} active strategies")
        
        historical_data = []
        for strategy in strategies:
            # Fetch performance metrics
            perf_data = list(performance_col.find({
                'strategy_address': strategy['address'],
                'timestamp': {'$gte': datetime.now() - timedelta(days=days)}
            }).sort('timestamp', 1))
            
            print(f"Strategy {strategy['index']}: {len(perf_data)} performance records")
            
            if len(perf_data) > 0:
                historical_data.append({
                    'strategy': strategy['address'],
                    'index': strategy['index'],
                    'performance': perf_data
                })
        
        return historical_data
    
    def calculate_features(self, performance_data):
        """Calculate technical and statistical features"""
        df = pd.DataFrame(performance_data)
        
        if len(df) < 2:
            return None
        
        features = {}
        
        # Returns
        df['return'] = df['total_value'].pct_change()
        df = df.dropna()
        
        if len(df) < 2:
            return None
        
        features['mean_return'] = df['return'].mean()
        features['std_return'] = df['return'].std()
        features['cum_return'] = (1 + df['return']).prod() - 1
        
        # Sharpe Ratio (assuming 2% risk-free rate)
        risk_free = 0.02 / 365
        features['sharpe_ratio'] = (features['mean_return'] - risk_free) / features['std_return'] if features['std_return'] > 0 else 0
        
        # Volatility metrics
        features['volatility_7d'] = df['return'].tail(7).std() if len(df) >= 7 else df['return'].std()
        features['volatility_30d'] = df['return'].tail(30).std() if len(df) >= 30 else df['return'].std()
        
        # Drawdown
        cumulative = (1 + df['return']).cumprod()
        running_max = cumulative.expanding().max()
        drawdown = (cumulative - running_max) / running_max
        features['max_drawdown'] = drawdown.min()
        
        # Momentum indicators
        features['momentum_7d'] = df['return'].tail(7).sum() if len(df) >= 7 else df['return'].sum()
        features['momentum_14d'] = df['return'].tail(14).sum() if len(df) >= 14 else df['return'].sum()
        features['momentum_30d'] = df['return'].tail(30).sum() if len(df) >= 30 else df['return'].sum()
        
        # TVL trend
        features['tvl_growth'] = (df['total_value'].iloc[-1] - df['total_value'].iloc[0]) / df['total_value'].iloc[0] if len(df) > 0 else 0
        
        # Win rate
        features['win_rate'] = (df['return'] > 0).sum() / len(df) if len(df) > 0 else 0.5
        
        # Recent performance weight
        features['recent_return_3d'] = df['return'].tail(3).mean() if len(df) >= 3 else df['return'].mean()
        features['recent_return_7d'] = df['return'].tail(7).mean() if len(df) >= 7 else df['return'].mean()
        
        return features
    
    def prepare_training_data(self, historical_data):
        """Prepare feature matrix and target allocations"""
        X = []
        y = []
        
        for strategy in historical_data:
            if len(strategy['performance']) < 10:  # Need minimum data
                print(f"Skipping strategy {strategy['index']}: insufficient data ({len(strategy['performance'])} records)")
                continue
                
            features = self.calculate_features(strategy['performance'])
            
            if features is None:
                print(f"Skipping strategy {strategy['index']}: could not calculate features")
                continue
            
            # Feature vector
            feature_vector = [
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
            
            X.append(feature_vector)
            
            # Target: higher allocation for better performers
            score = (
                features['sharpe_ratio'] * 0.3 +
                features['mean_return'] * 100 * 0.2 +
                (1 + features['max_drawdown']) * 0.2 +
                features['momentum_7d'] * 10 * 0.15 +
                features['win_rate'] * 0.15
            )
            y.append(max(0, min(100, score * 20)))  # Scale to 0-100
            
        print(f"Prepared {len(X)} training samples")
        return np.array(X), np.array(y)
    
    def train(self, days=90):
        """Train the allocation model"""
        print("Fetching historical data...")
        historical_data = self.fetch_historical_data(days)
        
        if len(historical_data) == 0:
            print("\n❌ No historical data found in MongoDB!")
            print("Please run: python seed_mongodb.py")
            print("This will generate sample data for training.")
            return None
        
        print(f"\nPreparing training data for {len(historical_data)} strategies...")
        X, y = self.prepare_training_data(historical_data)
        
        if len(X) < 3:
            print(f"\n❌ Insufficient training data! Found {len(X)} samples, need at least 3.")
            print("Please ensure you have performance data for multiple strategies.")
            print("Run: python seed_mongodb.py")
            return None
        
        # Scale features
        X_scaled = self.scaler.fit_transform(X)
        
        # Train model
        print("\nTraining Random Forest model...")
        self.model = RandomForestRegressor(
            n_estimators=100,
            max_depth=10,
            min_samples_split=2,
            min_samples_leaf=1,
            random_state=42
        )
        
        self.model.fit(X_scaled, y)
        
        # Calculate feature importance
        feature_names = [
            'mean_return', 'std_return', 'sharpe_ratio',
            'volatility_7d', 'volatility_30d', 'max_drawdown',
            'momentum_7d', 'momentum_14d', 'momentum_30d',
            'tvl_growth', 'win_rate', 'recent_return_3d', 'recent_return_7d'
        ]
        
        importance = pd.DataFrame({
            'feature': feature_names,
            'importance': self.model.feature_importances_
        }).sort_values('importance', ascending=False)
        
        print("\n📊 Feature Importance:")
        print(importance.to_string(index=False))
        
        return self.model
    
    def save_model(self, path='model.pkl'):
        """Save trained model and scaler"""
        joblib.dump({
            'model': self.model,
            'scaler': self.scaler
        }, path)
        print(f"\n💾 Model saved to {path}")
    
    def load_model(self, path='model.pkl'):
        """Load trained model and scaler"""
        data = joblib.load(path)
        self.model = data['model']
        self.scaler = data['scaler']
        print(f"Model loaded from {path}")


if __name__ == "__main__":
    # Configuration
    MONGO_URI = "mongodb://localhost:27017"
    DB_NAME = "defi_strategies"
    
    print("🤖 AI Strategy Model Trainer")
    print("=" * 50)
    
    # Initialize and train
    ai_model = StrategyAIModel(MONGO_URI, DB_NAME)
    model = ai_model.train(days=90)
    
    if model is not None:
        ai_model.save_model('strategy_model.pkl')
        print("\n✅ Model training complete!")
        print("\nNext steps:")
        print("  1. Run: python predict_and_sign.py")
        print("  2. Run: node submit_to_blockchain.js")
        print("  3. Run: node keeper.js")
    else:
        print("\n❌ Training failed. Please check the errors above.")