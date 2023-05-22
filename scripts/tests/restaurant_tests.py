from decimal import HAVE_THREADS

from brownie import FoodDelivery
from scripts.deploy import deploy_app
from scripts.helpful_scripts import get_account


def test_register_restaurant():
    deploy_app(front_end_update=False)
    contract = FoodDelivery[-1]
    account = get_account()

    # Register a restaurant
    contract.registerRestaurant("Meat up", "Best burgers", "Cluj-Napoca", {'from': account})

    # Retrieve the registered restaurant
    restaurant = contract.restaurants(account)

    # Perform assertions
    assert restaurant[0] == account
    assert restaurant[1] == "Meat up"
    assert restaurant[2] == "Best burgers"
    assert restaurant[3] == "Cluj-Napoca"

def test_add_item():
    deploy_app(front_end_update=False)
    contract = FoodDelivery[-1]
    account = get_account()

    # Register a restaurant
    contract.registerRestaurant("Meat up", "Best burgers", "Cluj-Napoca", {'from': account})

    # Add an item to the restaurant's menu
    item_id = contract.addItem("Cheeseburger", "Delicious cheeseburger", 10, {'from': account})

    # Retrieve the restaurant's items
    items = contract.getNumberOfItemsInMenu(account)

    # Perform assertions
    assert items == 1

def test_update_item():
    deploy_app(front_end_update=False)
    contract = FoodDelivery[-1]
    account = get_account()

    # Register a restaurant
    contract.registerRestaurant("Meat up", "Best burgers", "Cluj-Napoca", {'from': account})

    # Add an item to the restaurant's menu
    item_id = contract.addItem("Cheeseburger", "Delicious cheeseburger", 10, {'from': account}).return_value

    # Update the item
    contract.updateItem(item_id, "Double Cheeseburger", "Double the cheese, double the flavor", 12, {'from': account})

    # Retrieve the updated item (using the contract's function to get the item by index)
    updated_item = contract.getMenuEntryAtIndex(account, item_id)

    # Perform assertions
    assert updated_item['name'] == "Double Cheeseburger"
    assert updated_item['description'] == "Double the cheese, double the flavor"
    assert updated_item['price'] == 12

def test_enable_item():
    deploy_app(front_end_update=False)
    contract = FoodDelivery[-1]
    account = get_account()

    # Register a restaurant
    contract.registerRestaurant("Meat up", "Best burgers", "Cluj-Napoca", {'from': account})

    # Add an item to the restaurant's menu
    item_id = contract.addItem("Cheeseburger", "Delicious cheeseburger", 10, {'from': account}).return_value

    # Disable the item
    contract.disableItem(item_id, {'from': account})

    # Retrieve the item
    item = contract.getMenuEntryAtIndex(account, item_id)

    # Perform assertions
    assert not item['available']

def test_disable_item():
    deploy_app(front_end_update=False)
    contract = FoodDelivery[-1]
    account = get_account()

    # Register a restaurant
    contract.registerRestaurant("Meat up", "Best burgers", "Cluj-Napoca", {'from': account})

    # Add an item to the restaurant's menu
    item_id = contract.addItem("Cheeseburger", "Delicious cheeseburger", 10, {'from': account}).return_value

    # Enable the item
    contract.enableItem(item_id, {'from': account})

    # Retrieve the item
    item = contract.getMenuEntryAtIndex(account, item_id)

    # Perform assertions
    assert item['available']

def test_get_all_restaurants():
    deploy_app(front_end_update=False)
    contract = FoodDelivery[-1]
    account1 = get_account()
    account2 = get_account(2)

    # Register two restaurants
    contract.registerRestaurant("Meat up", "Best burgers", "Cluj-Napoca", {'from': account1})
    contract.registerRestaurant("Pizza Place", "Authentic Italian pizza", "Bucharest", {'from': account2})

    # Retrieve all restaurants
    restaurants, _ = contract.getAllRestaurants()

    # Perform assertions
    assert len(restaurants) == 2
    assert restaurants[0][1] == "Meat up"
    assert restaurants[1][1] == "Pizza Place"

def test_get_items_for_restaurant():
    deploy_app(front_end_update=False)
    contract = FoodDelivery[-1]
    restaurant_account = get_account()

    # Register a restaurant
    contract.registerRestaurant("Meat up", "Best burgers", "Cluj-Napoca", {'from': restaurant_account})

    # Add items to the restaurant's menu
    contract.addItem("Cheeseburger", "Delicious cheeseburger", 10, {'from': restaurant_account})
    contract.addItem("Fries", "Crispy fries", 5, {'from': restaurant_account})

    # Get items for the restaurant
    items = contract.getItemsForRestaurant(restaurant_account)

    # Perform assertions
    assert len(items) == 2
    assert items[0][1] == "Cheeseburger"
    assert items[1][1] == "Fries"

def test_get_number_of_items_in_menu():
    deploy_app(front_end_update=False)
    contract = FoodDelivery[-1]
    restaurant_account = get_account()

    # Register a restaurant
    contract.registerRestaurant("Meat up", "Best burgers", "Cluj-Napoca", {'from': restaurant_account})

    # Add items to the restaurant's menu
    contract.addItem("Cheeseburger", "Delicious cheeseburger", 10, {'from': restaurant_account})
    contract.addItem("Fries", "Crispy fries", 5, {'from': restaurant_account})

    # Get the number of items in the restaurant's menu
    num_items = contract.getNumberOfItemsInMenu(restaurant_account)

    # Perform assertions
    assert num_items == 2