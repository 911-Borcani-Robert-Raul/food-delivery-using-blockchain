from brownie import accounts, network, config

FORKED_LOCAL_ENVIRONEMENTS = ["mainnet-fork-dev", "mainnet-fork"]
LOCAL_BLOCKCHAIN_ENVIRONEMENTS = ["development", "ganache-local"]

def get_account(index=None, id=None):
    if index:
        return accounts[index]
    if id:
        return accounts.load(id)
    if (
        network.show_active() in LOCAL_BLOCKCHAIN_ENVIRONEMENTS
        or network.show_active() in FORKED_LOCAL_ENVIRONEMENTS
    ):
        return accounts[0]
    
    return accounts.add(config["wallets"]["from_key"])
