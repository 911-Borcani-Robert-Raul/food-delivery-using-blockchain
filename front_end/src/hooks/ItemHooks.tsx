import {
  useBlockNumber,
  useCall,
  useContractFunction
} from "@usedapp/core";
import { Contract, utils } from "ethers";
import { useEffect, useState } from "react";
import abi from ".././chain-info/contracts/FoodDelivery.json";
import { alchemyGoerliProvider } from "../App";
import { Item } from "../domain/Item";
/**
 * Custom hook to get the number of items in the menu of a restaurant from the smart contract.
 * @param contractAddress - The address of the smart contract.
 * @param restaurantAddress - The address of the restaurant.
 * @returns The number of items in the menu.
 */
export function useGetNumberOfItemsInMenu(
  contractAddress: string,
  restaurantAddress: string
) {
  const contractInterface = new utils.Interface(abi.abi);
  const { value, error } =
    useCall(
      contractAddress && {
        contract: new Contract(contractAddress, contractInterface),
        method: "getNumberOfItemsInMenu",
        args: [restaurantAddress],
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
 * Custom hook to get an item from the menu of a restaurant based on its index.
 * @param contractAddress - The address of the smart contract.
 * @param restaurantAddress - The address of the restaurant.
 * @param index - The index of the item in the menu.
 * @returns The item object.
 */
export function useGetItemByIndex(
  contractAddress: string,
  restaurantAddress: string,
  index: number
) {
  const [item, setItem] = useState<Item>();

  useEffect(() => {
    /**
     * Fetches an item from the menu of a restaurant.
     */
    const fetchRestaurants = async () => {
      const contractInterface = new utils.Interface(abi.abi);
      const contract = new Contract(
        contractAddress,
        contractInterface,
        alchemyGoerliProvider
      );
      const item = await getItem(contract, restaurantAddress, index);
      setItem(item);
    };

    if (contractAddress) {
      fetchRestaurants();
    }
  }, [contractAddress, restaurantAddress, index]);

  return item;
}

/**
 * Custom hook to get all items in the menu of a restaurant from the smart contract.
 * @param contractAddress - The address of the smart contract.
 * @param restaurantAddress - The address of the restaurant.
 * @returns An array of item objects.
 */
export function useGetItems(
  contractAddress: string,
  restaurantAddress: string
) {
  const [items, itemsList] = useState<Item[]>([]);

  const block = useBlockNumber();

  useEffect(() => {
    /**
     * Fetches the list of items in the menu of a restaurant.
     */
    const fetchRestaurantList = async () => {
      try {
        const contract: Contract = new Contract(
          contractAddress,
          abi.abi,
          alchemyGoerliProvider
        );
        const items = await contract.callStatic.getItemsForRestaurant(
          restaurantAddress
        );
        const formattedRestaurants = items.map(
          (item: any) =>
            new Item(
              item.id,
              item.name,
              item.description,
              item.price,
              item.available
            )
        );
        itemsList(formattedRestaurants);
      } catch (error) {
        console.error("Error fetching restaurant list:", error);
      }
    };

    fetchRestaurantList();
  }, [contractAddress, restaurantAddress, block]);

  return items;
}

/**
 * Retrieves an item from the smart contract based on its index in the menu of a restaurant.
 * @param contract - The instance of the smart contract.
 * @param restaurantAddress - The address of the restaurant.
 * @param index - The index of the item in the menu.
 * @returns The item object
 */
async function getItem(
  contract: Contract,
  restaurantAddress: string,
  index: number
) {
  try {
    const value = await contract.callStatic.getMenuEntryAtIndex(
      restaurantAddress,
      index
    );

    if (
      value !== undefined &&
      value.id &&
      value.name &&
      value.description &&
      value.price &&
      value.available !== undefined
    ) {
      return new Item(
        value.id,
        value.name,
        value.description,
        value.price,
        value.available
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
 * Custom hook to update an item in the menu using the smart contract.
 * @param contractAddress - The address of the smart contract.
 * @returns An object with the state and a function to update an item.
 */
export function useUpdateItem(contractAddress: string) {
  const contract = new Contract(
    contractAddress,
    abi.abi,
    alchemyGoerliProvider
  );

  const { state, send } = useContractFunction(contract, "updateItem", {
    transactionName: "UpdateItem",
  });

  /**
   * Updates an item in the menu using the smart contract.
   * @param item - The item to be updated.
   */
  const updateItem = async (item: Item) => {
    await contract.getWeiPriceForOrder(
      send(item.id, item.name, item.description, item.price)
    );
  };

  return { state, updateItem };
}

/**
 * Custom hook to add an item to the menu using the smart contract.
 * @param contractAddress - The address of the smart contract.
 * @returns An object with the state and a function to add an item.
 */
export function useAddItem(contractAddress: string) {
  const contract = new Contract(
    contractAddress,
    abi.abi,
    alchemyGoerliProvider
  );

  const { state, send } = useContractFunction(contract, "addItem", {
    transactionName: "AddItem",
  });

  /**
   * Adds an item to the menu using the smart contract.
   * @param item - The item to be added.
   */
  const addItem = async (item: Item) => {
    console.log(item.name);
    console.log(item.description);
    await contract.getWeiPriceForOrder(
      send(item.name, item.description, item.price)
    );
  };

  return { state, addItem };
}

/**
 * Custom hook to enable an item in the menu using the smart contract.
 * @param contractAddress - The address of the smart contract.
 * @returns An object with the state and a function to enable an item.
 */
export function useEnableItem(contractAddress: string) {
  const contract = new Contract(
    contractAddress,
    abi.abi,
    alchemyGoerliProvider
  );

  const { state, send } = useContractFunction(contract, "enableItem", {
    transactionName: "EnableItem",
  });

  /**
   * Enables an item in the menu using the smart contract.
   * @param itemId - The ID of the item to be enabled.
   */
  const enableItem = async (itemId: number) => {
    await contract.enableItem(send(itemId));
  };

  return { state, enableItem };
}

/**
 * Custom hook to disable an item in the menu using the smart contract.
 * @param contractAddress - The address of the smart contract.
 * @returns An object with the state and a function to disable an
 * item.
 * @param contractAddress - The address of the smart contract.
 * @returns An object with the state and a function to disable an item.
 */
export function useDisableItem(contractAddress: string) {
  const contract = new Contract(
    contractAddress,
    abi.abi,
    alchemyGoerliProvider
  );

  const { state, send } = useContractFunction(contract, "disableItem", {
    transactionName: "DisableItem",
  });

  /**
   * Disables an item in the menu using the smart contract.
   * @param itemId - The ID of the item to be disabled.
   */
  const disableItem = async (itemId: number) => {
    await contract.disableItem(send(itemId));
  };

  return { state, disableItem };
}
