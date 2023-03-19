from decimal import HAVE_THREADS
from scripts.helpful_scripts import get_account
from brownie import FoodDelivery

def test_register_restaurant():
    last_contract = FoodDelivery[-1]

    account = get_account()
    last_contract.registerRestaurant("Meat up", "Best burgers", {"from": account})

    restaurants = last_contract.restaurants
    my_restaurant = restaurants(account)

    assert(my_restaurant[0] == account)
    assert(my_restaurant[1] == "Meat up")
    assert(my_restaurant[2] == "Best burgers")

    print(last_contract.getPriceInEth(20000))


def test_app():
    test_register_restaurant()


def main():
    test_app()
