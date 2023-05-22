from decimal import HAVE_THREADS

from brownie import FoodDelivery
from scripts.deploy import deploy_app
from scripts.helpful_scripts import get_account


def test_get_all_orders_for_client():
    deploy_app(front_end_update=False)
    contract = FoodDelivery[-1]
    client_account = get_account()

    # Register a client
    contract.registerClient("John Doe", {'from': client_account})

    # Get all orders for the client (should be empty)
    orders = contract.getAllOrdersForClient(client_account)

    # Perform assertions
    assert len(orders) == 0

def test_get_all_orders_for_restaurant():
    deploy_app(front_end_update=False)
    contract = FoodDelivery[-1]
    restaurant_account = get_account()

    # Register a restaurant
    contract.registerRestaurant("Meat up", "Best burgers", "Cluj-Napoca", {'from': restaurant_account})

    # Get all orders for the restaurant (should be empty)
    orders = contract.getAllOrdersForRestaurant(restaurant_account)

    # Perform assertions
    assert len(orders) == 0

def test_get_orders_for_couriers():
    deploy_app(front_end_update=False)
    contract = FoodDelivery[-1]
    courier_account = get_account()

    # Get orders for couriers (should be empty)
    orders = contract.getOrdersForCouriers(courier_account)

    # Perform assertions
    assert len(orders) == 0


def test_place_order():
    deploy_app(front_end_update=False)
    contract = FoodDelivery[-1]
    restaurant_account = get_account()
    client_account = get_account(2)

    # Register a restaurant
    contract.registerRestaurant("Meat up", "Best burgers", "Cluj-Napoca", {'from': restaurant_account})

    # Register a client
    contract.registerClient("John Doe", {'from': client_account})

    # Add items to the restaurant's menu
    contract.addItem("Cheeseburger", "Delicious cheeseburger", 10, {'from': restaurant_account})
    contract.addItem("Fries", "Crispy fries", 5, {'from': restaurant_account})

    # Place an order
    item_ids = [0, 1]
    quantities = [2, 1]
    delivery_fee = 2
    delivery_address = 'Vivacity'
    value, delivery = contract.getWeiPriceForOrder(restaurant_account, item_ids, quantities, delivery_fee)
    contract.placeOrder(restaurant_account, item_ids, quantities, delivery_fee, delivery_address, {'from': client_account, 'value': value + delivery})

    # Retrieve the order
    order_id = contract.getNumberOfOrderForClient(client_account) - 1
    order = contract.orders(order_id)

    # Perform assertions
    assert order['restaurantAddr'] == restaurant_account
    assert order['clientAddr'] == client_account
    assert order['deliveryFee'] == delivery
    assert order['totalPrice'] == value
    assert order['deliveryAddress'] == delivery_address
    assert order['status'] == 0  # Order should have PENDING status

def test_accept_order():
    deploy_app(front_end_update=False)
    contract = FoodDelivery[-1]
    restaurant_account = get_account()
    client_account = get_account(2)

    # Register a restaurant
    contract.registerRestaurant("Meat up", "Best burgers", "Cluj-Napoca", {'from': restaurant_account})

    # Register a client
    contract.registerClient("John Doe", {'from': client_account})

    # Add items to the restaurant's menu
    contract.addItem("Cheeseburger", "Delicious cheeseburger", 10, {'from': restaurant_account})
    contract.addItem("Fries", "Crispy fries", 5, {'from': restaurant_account})

    # Place an order
    item_ids = [0, 1]
    quantities = [2, 1]
    delivery_fee = 2
    delivery_address = "123 Main St"
    value, delivery = contract.getWeiPriceForOrder(restaurant_account, item_ids, quantities, delivery_fee)
    contract.placeOrder(restaurant_account, item_ids, quantities, delivery_fee, delivery_address, {'from': client_account, 'value': value + delivery})

    # Accept the order
    order_id = contract.getNumberOfOrderForRestaurant(restaurant_account) - 1
    max_preparation_time = 1800
    contract.acceptOrder(order_id, max_preparation_time, {'from': restaurant_account})

    # Retrieve the order
    order_id = contract.getNumberOfOrderForClient(client_account) - 1
    order = contract.orders(order_id)

    # Perform assertions
    assert order['status'] == 1
    assert order['maxPreparationTime'] == max_preparation_time

def test_decline_order():
    deploy_app(front_end_update=False)
    contract = FoodDelivery[-1]
    restaurant_account = get_account()
    client_account = get_account(2)

    # Register a restaurant
    contract.registerRestaurant("Meat up", "Best burgers", "Cluj-Napoca", {'from': restaurant_account})

    # Register a client
    contract.registerClient("John Doe", {'from': client_account})

    # Add items to the restaurant's menu
    contract.addItem("Cheeseburger", "Delicious cheeseburger", 10, {'from': restaurant_account})
    contract.addItem("Fries", "Crispy fries", 5, {'from': restaurant_account})

    # Place an order
    item_ids = [0, 1]
    quantities = [2, 1]
    delivery_fee = 2
    delivery_address = "123 Main St"
    value, delivery = contract.getWeiPriceForOrder(restaurant_account, item_ids, quantities, delivery_fee)
    contract.placeOrder(restaurant_account, item_ids, quantities, delivery_fee, delivery_address, {'from': client_account, 'value': value + delivery})

    # Retrieve the order
    order_id = contract.getNumberOfOrderForRestaurant(restaurant_account) - 1
    order = contract.orders(order_id)

    # Decline the order
    contract.declineOrder(order_id, {'from': restaurant_account})

    # Retrieve the updated order
    updated_order = contract.orders(order_id)

    # Perform assertions
    assert order['status'] == 0  # Order should have been in PENDING status
    assert updated_order['status'] == 6  # Order should have been changed to CANCELLED status


def test_increase_delivery_fee():
    deploy_app(front_end_update=False)
    contract = FoodDelivery[-1]
    restaurant_account = get_account()
    client_account = get_account(2)

    # Register a restaurant
    contract.registerRestaurant("Meat up", "Best burgers", "Cluj-Napoca", {'from': restaurant_account})

    # Register a client
    contract.registerClient("John Doe", {'from': client_account})

    # Add items to the restaurant's menu
    contract.addItem("Cheeseburger", "Delicious cheeseburger", 10, {'from': restaurant_account})
    contract.addItem("Fries", "Crispy fries", 5, {'from': restaurant_account})

    # Place an order
    item_ids = [0, 1]
    quantities = [2, 1]
    delivery_fee = 2
    delivery_address = "123 Main St"
    value, delivery = contract.getWeiPriceForOrder(restaurant_account, item_ids, quantities, delivery_fee)
    contract.placeOrder(restaurant_account, item_ids, quantities, delivery_fee, delivery_address, {'from': client_account, 'value': value + delivery})

    # Accept the order
    order_id = contract.getNumberOfOrderForRestaurant(restaurant_account) - 1
    max_preparation_time = 1800
    contract.acceptOrder(order_id, max_preparation_time, {'from': restaurant_account})

    # Retrieve the order
    order_id = contract.getNumberOfOrderForRestaurant(restaurant_account) - 1
    order = contract.orders(order_id)

    # Increase the delivery fee
    additional_fee = 3 * 10 ** 16
    contract.increaseDeliveryFee(order_id, {'from': client_account, 'value': additional_fee})

    # Retrieve the updated order
    updated_order = contract.orders(order_id)

    # Perform assertions
    assert order['deliveryFee'] == delivery
    assert updated_order['deliveryFee'] == delivery + additional_fee

def test_take_order():
    deploy_app(front_end_update=False)
    contract = FoodDelivery[-1]
    restaurant_account = get_account()
    courier_account = get_account(2)

    # Register a restaurant
    contract.registerRestaurant("Meat up", "Best burgers", "Cluj-Napoca", {'from': restaurant_account})

    # Add items to the restaurant's menu
    contract.addItem("Cheeseburger", "Delicious cheeseburger", 10, {'from': restaurant_account})
    contract.addItem("Fries", "Crispy fries", 5, {'from': restaurant_account})

    # Place an order
    item_ids = [0, 1]
    quantities = [2, 1]
    delivery_fee = 2
    delivery_address = "123 Main St"
    value, delivery = contract.getWeiPriceForOrder(restaurant_account, item_ids, quantities, delivery_fee)
    contract.placeOrder(restaurant_account, item_ids, quantities, delivery_fee, delivery_address, {'from': get_account(5), 'value': value + delivery})

    # Retrieve the order
    order_id = contract.getNumberOfOrderForRestaurant(restaurant_account) - 1

    # Accept the order
    order_id = contract.getNumberOfOrderForRestaurant(restaurant_account) - 1
    max_preparation_time = 1800
    contract.acceptOrder(order_id, max_preparation_time, {'from': restaurant_account})

    # Take the order as a courier
    max_delivery_time = 1800
    contract.takeOrder(order_id, max_delivery_time, {'from': courier_account})

    # Retrieve the updated order
    updated_order = contract.orders(order_id)

    # Perform assertions
    assert updated_order['status'] == 2  # Order should have been changed to ASSIGNED_COURIER status
    assert updated_order['courierAddr'] == courier_account

def test_order_ready_to_deliver():
    deploy_app(front_end_update=False)
    contract = FoodDelivery[-1]
    restaurant_account = get_account()
    courier_account = get_account(2)

    # Register a restaurant
    contract.registerRestaurant("Meat up", "Best burgers", "Cluj-Napoca", {'from': restaurant_account})

    # Add items to the restaurant's menu
    contract.addItem("Cheeseburger", "Delicious cheeseburger", 10, {'from': restaurant_account})
    contract.addItem("Fries", "Crispy fries", 5, {'from': restaurant_account})

    # Place an order
    item_ids = [0, 1]
    quantities = [2, 1]
    delivery_fee = 2
    delivery_address = "123 Main St"
    value, delivery = contract.getWeiPriceForOrder(restaurant_account, item_ids, quantities, delivery_fee)
    contract.placeOrder(restaurant_account, item_ids, quantities, delivery_fee, delivery_address, {'from': get_account(5), 'value': value + delivery})

    # Accept the order
    order_id = contract.getNumberOfOrderForRestaurant(restaurant_account) - 1
    max_preparation_time = 1800
    contract.acceptOrder(order_id, max_preparation_time, {'from': restaurant_account})
    contract.takeOrder(order_id, max_preparation_time, {'fron': courier_account})

    # Retrieve the order
    order_id = contract.getNumberOfOrderForRestaurant(restaurant_account) - 1

    # Mark the order as ready to deliver
    contract.orderReadyToDeliver(order_id, {'from': restaurant_account})

    # Retrieve the updated order
    updated_order = contract.orders(order_id)

    # Perform assertions
    assert updated_order['status'] == 3  # Order should have been changed to READY_TO_DELIVER status

def test_get_order_items_and_quantities():
    deploy_app(front_end_update=False)
    contract = FoodDelivery[-1]
    restaurant_account = get_account()
    client_account = get_account(2)

    # Register a restaurant
    contract.registerRestaurant("Meat up", "Best burgers", "Cluj-Napoca", {'from': restaurant_account})

    # Register a client
    contract.registerClient("John Doe", {'from': client_account})

    # Add items to the restaurant's menu
    item_id1 = contract.addItem("Cheeseburger", "Delicious cheeseburger", 10, {'from': restaurant_account}).return_value
    item_id2 = contract.addItem("Fries", "Crispy fries", 5, {'from': restaurant_account}).return_value

    # Place an order
    item_ids = [item_id1, item_id2]
    quantities = [2, 1]
    delivery_fee = 2
    delivery_address = "123 Main St"
    value, delivery = contract.getWeiPriceForOrder(restaurant_account, item_ids, quantities, delivery_fee)
    contract.placeOrder(restaurant_account, item_ids, quantities, delivery_fee, delivery_address, {'from': client_account, 'value': value + delivery})

    # Retrieve the order
    order_id = contract.getNumberOfOrderForClient(client_account) - 1
    ordered_items, ordered_quantities = contract.getOrderItemsAndQuantities(order_id)

    # Perform assertions
    assert len(ordered_items) == 2
    assert ordered_items[0][1] == "Cheeseburger"
    assert ordered_items[1][1] == "Fries"
    assert ordered_quantities == quantities

def test_order_delivering():
    deploy_app(front_end_update=False)
    contract = FoodDelivery[-1]
    restaurant_account = get_account()
    courier_account = get_account(2)

    # Register a restaurant
    contract.registerRestaurant("Meat up", "Best burgers", "Cluj-Napoca", {'from': restaurant_account})

    # Add items to the restaurant's menu
    contract.addItem("Cheeseburger", "Delicious cheeseburger", 10, {'from': restaurant_account})
    contract.addItem("Fries", "Crispy fries", 5, {'from': restaurant_account})

    # Place an order
    item_ids = [0, 1]
    quantities = [2, 1]
    delivery_fee = 2
    delivery_address = "123 Main St"
    value, delivery = contract.getWeiPriceForOrder(restaurant_account, item_ids, quantities, delivery_fee)
    contract.placeOrder(restaurant_account, item_ids, quantities, delivery_fee, delivery_address, {'from': get_account(5), 'value': value + delivery})

    # Accept the order
    order_id = contract.getNumberOfOrderForRestaurant(restaurant_account) - 1
    max_preparation_time = 1800
    contract.acceptOrder(order_id, max_preparation_time, {'from': restaurant_account})
    contract.takeOrder(order_id, max_preparation_time, {'from': courier_account})
    contract.orderReadyToDeliver(order_id, {'from': restaurant_account})

    # Mark the order as delivering
    contract.orderDelivering(order_id, {'from': courier_account})

    # Retrieve the order
    order = contract.orders(order_id)

    # Perform assertions
    assert order['status'] == 4  # OrderStatus.DELIVERING

def test_order_delivered():
    deploy_app(front_end_update=False)
    contract = FoodDelivery[-1]
    restaurant_account = get_account()
    courier_account = get_account(2)
    client_account = get_account(5)

    # Register a restaurant
    contract.registerRestaurant("Meat up", "Best burgers", "Cluj-Napoca", {'from': restaurant_account})

    # Add items to the restaurant's menu
    contract.addItem("Cheeseburger", "Delicious cheeseburger", 10, {'from': restaurant_account})
    contract.addItem("Fries", "Crispy fries", 5, {'from': restaurant_account})

    # Place an order
    item_ids = [0, 1]
    quantities = [2, 1]
    delivery_fee = 2
    delivery_address = "123 Main St"
    value, delivery = contract.getWeiPriceForOrder(restaurant_account, item_ids, quantities, delivery_fee)
    contract.placeOrder(restaurant_account, item_ids, quantities, delivery_fee, delivery_address, {'from': client_account, 'value': value + delivery})

    # Accept the order
    order_id = contract.getNumberOfOrderForRestaurant(restaurant_account) - 1
    max_preparation_time = 1800
    contract.acceptOrder(order_id, max_preparation_time, {'from': restaurant_account})
    contract.takeOrder(order_id, max_preparation_time, {'from': courier_account})
    contract.orderReadyToDeliver(order_id, {'from': restaurant_account})
    contract.orderDelivering(order_id, {'from': courier_account})

    # Mark the order as delivered
    contract.orderDelivered(order_id, {'from': client_account})

    # Retrieve the order
    order = contract.orders(order_id)

    # Perform assertions
    assert order['status'] == 5  # OrderStatus.DELIVERED
