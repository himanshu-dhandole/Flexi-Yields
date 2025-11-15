from pymongo import MongoClient
from datetime import datetime, timedelta
import random
import numpy as np

def generate_strategy_performance(strategy_address, index, days=90):
    """Generate realistic performance data"""
    performance_data = []
    
    # Initial parameters
    initial_value = 1000000  # $1M
    daily_return_mean = 0.0002  # 0.02% daily
    daily_volatility = 0.015  # 1.5% volatility
    
    # Add strategy-specific characteristics
    if index == 0:  # Conservative strategy
        daily_return_mean = 0.0001
        daily_volatility = 0.008
    elif index == 1:  # Balanced strategy
        daily_return_mean = 0.0003
        daily_volatility = 0.012
    elif index == 2:  # Aggressive strategy
        daily_return_mean = 0.0005
        daily_volatility = 0.020
    
    current_value = initial_value
    
    for i in range(days):
        timestamp = datetime.now() - timedelta(days=days-i)
        
        # Generate return with random walk
        daily_return = np.random.normal(daily_return_mean, daily_volatility)
        current_value *= (1 + daily_return)
        
        # Add some market events (crashes/rallies)
        if random.random() < 0.05:  # 5% chance of significant event
            event_return = np.random.normal(0, daily_volatility * 3)
            current_value *= (1 + event_return)
        
        performance_data.append({
            'strategy_address': strategy_address,
            'timestamp': timestamp,
            'total_value': current_value,
            'apy': (daily_return * 365) * 100,
            'tvl': current_value,
            'num_positions': random.randint(5, 15),
            'gas_used': random.randint(100000, 500000)
        })
    
    return performance_data

def seed_database(mongo_uri='mongodb://localhost:27017', db_name='defi_strategies'):
    """Seed database with sample data"""
    try:
        client = MongoClient(mongo_uri, serverSelectionTimeoutMS=5000)
        # Test connection
        client.server_info()
        db = client[db_name]
    except Exception as e:
        print(f"❌ Cannot connect to MongoDB: {e}")
        print("\nPlease ensure MongoDB is running:")
        print("  Windows: net start MongoDB")
        print("  Mac: brew services start mongodb-community")
        print("  Linux: sudo systemctl start mongod")
        return False
    
    # Clear existing data
    print("🗑️  Clearing existing data...")
    db.strategies.delete_many({})
    db.performance.delete_many({})
    db.recommendations.delete_many({})
    db.executions.delete_many({})
    db.agent_nonces.delete_many({})
    
    # Sample strategy addresses
    strategies = [
        {
            'index': 0,
            'address': '0x1111111111111111111111111111111111111111',
            'name': 'Conservative DeFi',
            'type': 'lending',
            'allocation': 3000,
            'active': True
        },
        {
            'index': 1,
            'address': '0x2222222222222222222222222222222222222222',
            'name': 'Balanced Yield',
            'type': 'liquidity_pool',
            'allocation': 4000,
            'active': True
        },
        {
            'index': 2,
            'address': '0x3333333333333333333333333333333333333333',
            'name': 'Aggressive Growth',
            'type': 'leverage',
            'allocation': 3000,
            'active': True
        }
    ]
    
    print("📝 Inserting strategies...")
    db.strategies.insert_many(strategies)
    
    # Generate performance data
    print("📊 Generating performance data...")
    for strategy in strategies:
        performance_data = generate_strategy_performance(
            strategy['address'], 
            strategy['index'],
            days=90
        )
        db.performance.insert_many(performance_data)
        print(f"  ✅ Generated {len(performance_data)} records for Strategy {strategy['index']}")
    
    # Create indexes
    print("🔍 Creating indexes...")
    db.performance.create_index([('strategy_address', 1), ('timestamp', -1)])
    db.strategies.create_index('index')
    db.recommendations.create_index([('timestamp', -1), ('status', 1)])
    
    print("\n✅ Database seeded successfully!")
    print(f"   Strategies: {db.strategies.count_documents({})}")
    print(f"   Performance records: {db.performance.count_documents({})}")
    
    # Print sample data
    print("\n📈 Sample performance data:")
    sample = db.performance.find_one({'strategy_address': strategies[0]['address']})
    if sample:
        print(f"   Strategy: {sample['strategy_address'][:10]}...")
        print(f"   TVL: ${sample['total_value']:,.2f}")
        print(f"   APY: {sample['apy']:.2f}%")
    
    client.close()

if __name__ == "__main__":
    seed_database()