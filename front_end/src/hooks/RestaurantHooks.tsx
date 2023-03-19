import { Falsy, useCall } from "@usedapp/core";
import { Contract, utils } from "ethers";
import abi from ".././chain-info/contracts/FoodDelivery.json";

export function useNumberOfRestaurants(
    contractAddress: string | Falsy,
    address: string | Falsy
  ) {
    const contractInterface = new utils.Interface(abi.abi);
    const { value, error } =
      useCall(
        address &&
          contractAddress && {
            contract: new Contract(contractAddress, contractInterface), // instance of called contract
            method: "restaurants", // Method to be called
            args: [address], // Method arguments - address to be checked for balance
          }
      ) ?? {};
    if(error) {
      console.error(error.message)
      return undefined
    }
    console.log(value);
    return value?.[1]
  }