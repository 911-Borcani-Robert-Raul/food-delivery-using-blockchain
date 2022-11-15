from decimal import HAVE_THREADS
from scripts.helpful_scripts import get_account
from brownie import FoodDelivery

def test_app():
    last_contract = FoodDelivery[-1]
    assert last_contract.test() == 23


def main():
    test_app()
