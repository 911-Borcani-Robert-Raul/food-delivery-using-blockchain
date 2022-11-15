from decimal import HAVE_THREADS
from scripts.helpful_scripts import get_account
from brownie import FoodDelivery
import time

def deploy_app():
    account = get_account()
    FoodDelivery.deploy(
        {"from": account}
    )
    print("Deployed Food delivery!")


def main():
    deploy_app()
