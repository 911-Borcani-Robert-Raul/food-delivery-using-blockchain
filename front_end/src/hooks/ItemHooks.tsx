import {
  Falsy,
  useBlockNumber,
  useCall,
  useContractFunction,
} from "@usedapp/core";
import { Contract, utils } from "ethers";
import { useEffect, useState } from "react";
import abi from ".././chain-info/contracts/FoodDelivery.json";
import { alchemyGoerliProvider } from "../App";
import { Item } from "../domain/Item";

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

export function useGetItemByIndex(
  contractAddress: string,
  restaurantAddress: string,
  index: number
) {
  const [item, setItem] = useState<Item>();

  useEffect(() => {
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

export function useGetItems(
  contractAddress: string,
  restaurantAddress: string
) {
  const [items, itemsList] = useState<Item[]>([]);

  const block = useBlockNumber();

  useEffect(() => {
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

export function useUpdateItem(contractAddress: string) {
  const contract = new Contract(
    contractAddress,
    abi.abi,
    alchemyGoerliProvider
  );

  const { state, send } = useContractFunction(contract, "updateItem", {
    transactionName: "UpdateItem",
  });

  const updateItem = async (item: Item) => {
    await contract.getWeiPriceForOrder(
      send(item.id, item.name, item.description, item.price)
    );
  };

  return { state, updateItem };
}

export function useAddItem(contractAddress: string) {
  const contract = new Contract(
    contractAddress,
    abi.abi,
    alchemyGoerliProvider
  );

  const { state, send } = useContractFunction(contract, "addItem", {
    transactionName: "AddItem",
  });

  const addItem = async (item: Item) => {
    console.log(item.name);
    console.log(item.description);
    await contract.getWeiPriceForOrder(
      send(item.name, item.description, item.price)
    );
  };

  return { state, addItem };
}

export function useEnableItem(contractAddress: string) {
  const contract = new Contract(
    contractAddress,
    abi.abi,
    alchemyGoerliProvider
  );

  const { state, send } = useContractFunction(contract, "enableItem", {
    transactionName: "EnableItem",
  });

  const enableItem = async (itemId: number) => {
    await contract.enableItem(send(itemId));
  };

  return { state, enableItem };
}

export function useDisableItem(contractAddress: string) {
  const contract = new Contract(
    contractAddress,
    abi.abi,
    alchemyGoerliProvider
  );

  const { state, send } = useContractFunction(contract, "disableItem", {
    transactionName: "DisableItem",
  });

  const disableItem = async (itemId: number) => {
    await contract.disableItem(send(itemId));
  };

  return { state, disableItem };
}
