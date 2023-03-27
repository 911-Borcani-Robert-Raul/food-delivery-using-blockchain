

from scripts.add_test_data.add_restaurants import register_restaurants

# Should only be called from local blockchain environments!
def main():
    register_restaurants()
