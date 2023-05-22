import { Falsy, useCall, useContractFunction } from "@usedapp/core";
import { Contract, utils } from "ethers";
import { useEffect, useState } from "react";
import abi from ".././chain-info/contracts/FoodDelivery.json";
import { alchemyGoerliProvider } from "../App";
import { Restaurant } from "../domain/Restaurant";

export function useGetRestaurant(contractAddress: string, address: string) {
  const [restaurant, setRestaurant] = useState<Restaurant>();

  useEffect(() => {
    const fetchRestaurants = async () => {
      const contractInterface = new utils.Interface(abi.abi);
      const contract = new Contract(
        contractAddress,
        contractInterface,
        alchemyGoerliProvider
      );

      const restaurant = await getRestaurant(
        contract,
        contractAddress,
        address
      );
      setRestaurant(restaurant);
    };

    if (contractAddress) {
      fetchRestaurants();
    }
  }, [contractAddress, address]);

  return restaurant;
}

export function useGetNumberOfRestaurants(contractAddress: string | Falsy) {
  const contractInterface = new utils.Interface(abi.abi);
  const { value, error } =
    useCall(
      contractAddress && {
        contract: new Contract(
          contractAddress,
          contractInterface,
          alchemyGoerliProvider
        ),
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
        contract: new Contract(
          contractAddress,
          contractInterface,
          alchemyGoerliProvider
        ),
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

export const useGetRestaurants = (
  contractAddress: string,
  numberOfRestaurants: number
) => {
  const [restaurantList, setRestaurantList] = useState<Restaurant[]>([]);

  useEffect(() => {
    const fetchRestaurantList = async () => {
      try {
        const contract: Contract = new Contract(
          contractAddress,
          abi.abi,
          alchemyGoerliProvider
        );
        const restaurants = await contract.callStatic.getAllRestaurants();
        const formattedRestaurants = restaurants[0].map(
          (restaurant: any) =>
            new Restaurant(
              restaurant.addr,
              restaurant.name,
              restaurant.description,
              restaurant.physicalAddress
            )
        );
        setRestaurantList(formattedRestaurants);
      } catch (error) {
        console.error("Error fetching restaurant list:", error);
      }
    };

    fetchRestaurantList();
  }, [contractAddress, numberOfRestaurants]);

  return restaurantList;
};

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

    if (
      value !== undefined &&
      value.addr &&
      value.name &&
      value.description &&
      value.physicalAddress
    ) {
      return new Restaurant(
        value.addr,
        value.name,
        value.description,
        value.physicalAddress
      );
    } else {
      console.error(`Invalid response from contract: ${JSON.stringify(value)}`);
      return undefined;
    }
  } catch (error: any) {
    console.error(`Error calling contract: ${error.toString()}`);
    return undefined;
  }
}

export function useRegisterRestaurant(contractAddress: string) {
  const contract = new Contract(
    contractAddress,
    abi.abi,
    alchemyGoerliProvider
  );

  const { state, send } = useContractFunction(contract, "registerRestaurant", {
    transactionName: "RegisterRestaurant",
  });

  const registerRestaurant = async (restaurant: Restaurant) => {
    send(restaurant.name, restaurant.description, restaurant.physicalAddress);
  };

  return { state, registerRestaurant };
}
