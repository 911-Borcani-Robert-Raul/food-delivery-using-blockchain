
from brownie import FoodDelivery
from scripts.deploy import deploy_app
from scripts.helpful_scripts import get_account


def test_register_client():
    deploy_app(front_end_update=False)
    contract = FoodDelivery[-1]
    account = get_account()

    # Register a client
    contract.registerClient("John Doe", {'from': account})

    # Retrieve the registered client
    client = contract.clients(account)

    # Perform assertions
    assert client[0] == account
    assert client[1] == "John Doe"