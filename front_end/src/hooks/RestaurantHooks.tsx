import { Falsy, useCall } from "@usedapp/core";
import { Contract, ethers, utils } from "ethers";
import { useEffect, useMemo, useState } from "react";
import abi from ".././chain-info/contracts/FoodDelivery.json";
import { alchemyGoerliProvider } from "../App";
import { Restaurant } from "../domain/Restaurant";

export function useGetRestaurant(
  contractAddress: string | Falsy,
  address: string | Falsy
) {
  const contractInterface = new utils.Interface(abi.abi);
  const { value, error } =
    useCall(
      address &&
        contractAddress && {
          contract: new Contract(contractAddress, contractInterface),
          method: "restaurants",
          args: [address],
        }
    ) ?? {};

  if (error) {
    console.error(`Error calling contract: ${error.message}`);
    return undefined;
  }

  if (value !== undefined && value.addr && value.name && value.description) {
    return new Restaurant(value.addr, value.name, value.description);
  } else {
    console.error(`Invalid response from contract: ${JSON.stringify(value)}`);
    return undefined;
  }
}

export function useGetNumberOfRestaurants(contractAddress: string | Falsy) {
  const contractInterface = new utils.Interface(abi.abi);
  const { value, error } =
    useCall(
      contractAddress && {
        contract: new Contract(contractAddress, contractInterface),
        method: "getNumberOfRestaurants",
        args: [],
      }
    ) ?? {};

  if (error) {
    console.error(`Error calling contract: ${error.message}`);
    return undefined;
  }

  if (value !== undefined) {
    return parseInt(value.toString());
  }
  return undefined;
}

export function useGetRestaurantAddress(
  contractAddress: string | Falsy,
  index: number
) {
  const contractInterface = new utils.Interface(abi.abi);
  const { value, error } =
    useCall(
      contractAddress && {
        contract: new Contract(contractAddress, contractInterface),
        method: "restaurantsAddr",
        args: [index],
      }
    ) ?? {};

  if (error) {
    console.error(`Error calling contract: ${error.message}`);
    return undefined;
  }

  if (value !== undefined) {
    return value.toString();
  }
  return undefined;
}

async function getRestaurantAddress(
  contract: Contract,
  contractAddress: string,
  index: number
) {
  try {
    const value = await contract.callStatic.restaurantsAddr(index);
    return value.toString();
  } catch (error: any) {
    console.error(`Error calling contract: ${error.toString()}`);
    return undefined;
  }
}

async function getRestaurant(
  contract: Contract,
  contractAddress: string,
  address: string
) {
  try {
    const value = await contract.callStatic.restaurants(address);

    if (value !== undefined && value.addr && value.name && value.description) {
      return new Restaurant(value.addr, value.name, value.description);
    } else {
      console.error(`Invalid response from contract: ${JSON.stringify(value)}`);
      return undefined;
    }
  } catch (error: any) {
    console.error(`Error calling contract: ${error.toString()}`);
    return undefined;
  }
}

export const useGetRestaurants = (
  contractAddress: string,
  numberOfRestaurants: number
) => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      const contractInterface = new utils.Interface(abi.abi);
      const contract = new Contract(
        contractAddress,
        contractInterface,
        alchemyGoerliProvider
      );

      const restaurantArray = [];
      for (
        let restaurantIndex = 0;
        restaurantIndex < numberOfRestaurants;
        ++restaurantIndex
      ) {
        const restaurantAddr = await getRestaurantAddress(
          contract,
          contractAddress,
          restaurantIndex
        );
        const restaurant = await getRestaurant(
          contract,
          contractAddress,
          restaurantAddr
        );
        if (restaurant) {
          restaurantArray.push(restaurant);
        }
      }
      setRestaurants(restaurantArray);
    };

    if (contractAddress && numberOfRestaurants > 0) {
      fetchRestaurants();
    }
  }, [contractAddress, numberOfRestaurants]);

  return restaurants;
};
