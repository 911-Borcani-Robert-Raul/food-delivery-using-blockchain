import json
import os
import shutil
from decimal import HAVE_THREADS

import yaml
from web3 import Web3

from brownie import FoodDelivery, MockV3Aggregator, config, network
from scripts.helpful_scripts import (LOCAL_BLOCKCHAIN_ENVIRONEMENTS,
                                     deploy_mocks, get_account)


def deploy_app(front_end_update=False):
    account = get_account()

    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONEMENTS:
        price_feed_address = config["networks"][network.show_active()].get("eth_usd_price_feed")
    else:
        deploy_mocks()
        price_feed_address = MockV3Aggregator[-1]
    FoodDelivery.deploy(
        price_feed_address,
        {"from": account},
        publish_source=config["networks"][network.show_active()].get("verify", False),
    )
    if front_end_update:
        update_front_end()
    print("Deployed Food delivery!")


def update_front_end():
    # Send the build folder
    copy_folders_to_front_end("./build", "./front_end/src/chain-info")

    with open("brownie-config.yaml", "r") as brownie_config:
        config_dict = yaml.load(brownie_config, Loader=yaml.FullLoader)
        with open("./front_end/src/brownie-config.json", "w") as brownie_config_json:
            json.dump(config_dict, brownie_config_json)
    print("Front end updated!")


def copy_folders_to_front_end(src, dest):
    if os.path.exists(dest):
        shutil.rmtree(dest)
    shutil.copytree(src, dest)


def main():
    deploy_app(front_end_update=False)
