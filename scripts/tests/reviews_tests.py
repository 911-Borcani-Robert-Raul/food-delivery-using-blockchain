from decimal import HAVE_THREADS

from brownie import FoodDelivery
from scripts.deploy import deploy_app
from scripts.helpful_scripts import get_account


def test_place_review():
    deploy_app(front_end_update=False)
    contract = FoodDelivery[-1]
    client_account = get_account()
    courier_account = get_account(1)

    # Register a client
    contract.registerClient("John Doe", {'from': client_account})

    # Place an order
    restaurant_account = get_account(2)
    contract.registerRestaurant("Meat up", "Best burgers", "Cluj-Napoca", {'from': restaurant_account})
    item_id1 = contract.addItem("Cheeseburger", "Delicious cheeseburger", 10, {'from': restaurant_account}).return_value
    item_ids = [item_id1]
    quantities = [1]
    delivery_fee = 2
    delivery_address = "123 Main St"
    max_preparation_time = 100
    value, delivery = contract.getWeiPriceForOrder(restaurant_account, item_ids, quantities, delivery_fee)
    contract.placeOrder(restaurant_account, item_ids, quantities, delivery_fee, delivery_address, {'from': client_account, 'value': value + delivery})

    order_id = contract.getNumberOfOrderForClient(client_account) - 1

    contract.acceptOrder(order_id, max_preparation_time, {'from': restaurant_account})
    contract.takeOrder(order_id, max_preparation_time, {'from': courier_account})
    contract.orderReadyToDeliver(order_id, {'from': restaurant_account})
    contract.orderDelivering(order_id, {'from': courier_account})
    contract.orderDelivered(order_id, {'from': client_account})

    # Place a review for the order
    rating = 4
    comment = "Great food and fast delivery"
    contract.placeReview(order_id, rating, comment, {'from': client_account})

    # Retrieve the review
    review = contract.reviews(order_id)

    # Perform assertions
    assert review['orderId'] == order_id
    assert review['rating'] == rating
    assert review['comment'] == comment

