import { Falsy, useCall, useContractFunction } from "@usedapp/core";
import { Contract, utils } from "ethers";
import { useEffect, useState } from "react";
import abi from ".././chain-info/contracts/FoodDelivery.json";
import { alchemyGoerliProvider } from "../App";
import { Restaurant } from "../domain/Restaurant";
/**
 * Custom hook to fetch a restaurant from the smart contract.
 * @param contractAddress - The address of the smart contract.
 * @param address - The address of the restaurant.
 * @returns The restaurant object.
 */
export function useGetRestaurant(contractAddress: string, address: string) {
  const [restaurant, setRestaurant] = useState<Restaurant>();

  useEffect(() => {
    /**
     * Fetches a restaurant from the smart contract.
     */
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

/**
 * Custom hook to get the number of restaurants from the smart contract.
 * @param contractAddress - The address of the smart contract.
 * @returns The number of restaurants.
 */
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

/**
 * Custom hook to get the address of a restaurant at the specified index from the smart contract.
 * @param contractAddress - The address of the smart contract.
 * @param index - The index of the restaurant.
 * @returns The address of the restaurant.
 */
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

/**
 * Custom hook to fetch a list of restaurants from the smart contract.
 * @param contractAddress - The address of the smart contract.
 * @param numberOfRestaurants - The number of restaurants to fetch.
 * @returns An array of restaurant objects.
 */
export const useGetRestaurants = (
  contractAddress: string,
  numberOfRestaurants: number
) => {
  const [restaurantList, setRestaurantList] = useState<Restaurant[]>([]);

  useEffect(() => {
    /**
     * Fetches a list of restaurants from the smart contract.
     */
    const fetchRestaurantList = async () => {
      try {
        const contract: Contract = new Contract(
          contractAddress,
          abi.abi,
          alchemyGoerliProvider
        );
        const restaurants = await contract.callStatic.getAllRestaurants();
        const formattedRestaurants = restaurants[0].map(
          (restaurant: any, index: number) =>
            new Restaurant(
              restaurant.addr,
              restaurant.name,
              restaurant.description,
              restaurant.physicalAddress,
              restaurants[1][index].toNumber()
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

/**
 * Retrieves a restaurant from the smart contract.
 * @param contract - The instance of the smart contract.
 * @param contractAddress - The address of the smart contract.
 * @param address - The address of the restaurant.
 * @returns The restaurant object.
 */
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
        value.physicalAddress,
        undefined
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

/**
 * Custom hook to register a restaurant using the smart contract.
 * @param contractAddress - The address of the smart contract.
 * @returns An object with the state and a function to register a restaurant.
 */
export function useRegisterRestaurant(contractAddress: string) {
  const contract = new Contract(
    contractAddress,
    abi.abi,
    alchemyGoerliProvider
  );

  const { state, send } = useContractFunction(contract, "registerRestaurant", {
    transactionName: "RegisterRestaurant",
  });

  /**
   * Registers a restaurant using the smart contract.
   * @param restaurant - The restaurant to be registered.
   */
  const registerRestaurant = async (restaurant: Restaurant) => {
    send(restaurant.name, restaurant.description, restaurant.physicalAddress);
  };

  return { state, registerRestaurant };
}
