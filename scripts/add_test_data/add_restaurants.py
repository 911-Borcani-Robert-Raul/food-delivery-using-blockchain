from decimal import HAVE_THREADS
from scripts.helpful_scripts import get_account
from brownie import FoodDelivery, accounts

def register_restaurants():
    last_contract = FoodDelivery[-1]

    account = get_account()
    last_contract.registerRestaurant("Meat up", "Best burgers", {"from": accounts[0]})
    last_contract.registerRestaurant("KFC", "KFC description", {"from": accounts[1]})
    last_contract.registerRestaurant("Subway", "Subway description", {"from": accounts[2]})
    last_contract.registerRestaurant("Lunch box", "Lunch box description", {"from": accounts[3]})
    last_contract.registerRestaurant("Deliciul cartofilor", "Deliciul cartofilor description", {"from": accounts[4]})
    last_contract.registerRestaurant("Salad Box", "Salad box description", {"from": accounts[5]})
