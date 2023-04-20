from decimal import HAVE_THREADS

from brownie import FoodDelivery, accounts
from scripts.helpful_scripts import get_account


def register_restaurants():
    last_contract = FoodDelivery[-1]

    account = get_account()
    last_contract.registerRestaurant("Meat up", "Best burgers", {"from": account})
    last_contract.addItem("Classic burger", "The best one", 10, {"from": account})
    last_contract.addItem("El Chapo", "Spicy", 12, {"from": account})
