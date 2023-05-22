from web3 import Web3

from brownie import MockV3Aggregator, accounts, config, network

FORKED_LOCAL_ENVIRONEMENTS = ["mainnet-fork-dev", "mainnet-fork"]
LOCAL_BLOCKCHAIN_ENVIRONEMENTS = ["development", "ganache-local"]

DECIMALS = 18
STARTING_PRICE = 2000

def get_account(index=None, id=None):
    if index:
        return accounts[index]
    if id:
        return accounts.load(id)
    if (
        network.show_active() in LOCAL_BLOCKCHAIN_ENVIRONEMENTS
        or network.show_active() in FORKED_LOCAL_ENVIRONEMENTS
    ):
        return accounts[3]
    
    return accounts.add(config["wallets"]["from_key"])

def deploy_mocks():
    print(f"The active network is {network.show_active()}")
    print(f"Deploying mocks...")
    if len(MockV3Aggregator) < 1:
        MockV3Aggregator.deploy(DECIMALS, Web3.toWei(STARTING_PRICE, "ether"), {"from": get_account()})
    print("Mocks deployed!")
