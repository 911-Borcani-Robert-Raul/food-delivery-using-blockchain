from decimal import HAVE_THREADS
from scripts.helpful_scripts import get_account
from brownie import FoodDelivery

def test_app():
    last_contract = FoodDelivery[-1]

    account = get_account()
    last_contract.registerRestaurant("Meat up", "Best burgers", {"from": account})

    restaurants = last_contract.restaurants
    print(restaurants("0x7887fBECC18Dcb05A4Ac2e30DD40688B2cfA8A58"))


def main():
    test_app()
