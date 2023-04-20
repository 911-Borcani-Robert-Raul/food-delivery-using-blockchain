import { useCall, useContractFunction, useEthers } from "@usedapp/core";
import { Contract, utils } from "ethers";
import { useEffect, useMemo, useState } from "react";
import abi from ".././chain-info/contracts/FoodDelivery.json";
import { alchemyGoerliProvider } from "../App";
import { Order } from "../domain/Order";

interface OrderData {
  itemIndices: {
    id: number;
  }[];
  quantities: number[];
  deliveryFee: number;
  deliveryAddress: string;
}

export function useGetOrder(
  contractAddress: string,
  orderId: number
): Order | null {
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const fetchOrderData = async (): Promise<void> => {
      const contractInterface = new utils.Interface(abi.abi);
      const contract = new Contract(
        contractAddress,
        contractInterface,
        alchemyGoerliProvider
      );
      const [itemIndices, quantities] =
        await contract.callStatic.getOrderItemsAndQuantities(orderId);

      const partialOrderData = await getOrder(contract, orderId);

      const orderData: OrderData = {
        itemIndices,
        quantities,
        deliveryFee: partialOrderData!.deliveryFee,
        deliveryAddress: partialOrderData!.deliveryAddress,
      };

      const order = new Order(
        orderId,
        contractAddress,
        itemIndices,
        quantities,
        orderData.deliveryFee,
        orderData.deliveryAddress,
        partialOrderData!.orderStatus
      );

      setOrder(order);
    };

    fetchOrderData();
  }, [contractAddress, orderId]);

  return order;
}

export function useGetNumberOfOrders(
  contractAddress: string,
  clientAddress: string
) {
  const contractInterface = new utils.Interface(abi.abi);
  console.log("Getting number of orders...");
  const { value, error } =
    useCall(
      contractAddress &&
        clientAddress && {
          contract: new Contract(
            contractAddress,
            contractInterface,
            alchemyGoerliProvider
          ),
          method: "getNumberOfOrderForClient",
          args: [clientAddress],
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

export function useGetNumberOfOrdersForRestaurant(
  contractAddress: string,
  restaurantAddress: string
) {
  const contractInterface = new utils.Interface(abi.abi);
  console.log("Getting number of orders...");
  const { value, error } =
    useCall(
      contractAddress &&
        restaurantAddress && {
          contract: new Contract(
            contractAddress,
            contractInterface,
            alchemyGoerliProvider
          ),
          method: "restaurantToOrdersIds",
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

export const useGetOrders = (
  contractAddress: string,
  clientAddress: string,
  numberOfOrders: number
) => {
  const [restaurants, setRestaurants] = useState<Order[]>([]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      const contractInterface = new utils.Interface(abi.abi);
      const contract = new Contract(
        contractAddress,
        contractInterface,
        alchemyGoerliProvider
      );

      const restaurantArray = [];
      for (let orderIndex = 0; orderIndex < numberOfOrders; ++orderIndex) {
        console.log(`Fetching order ${orderIndex}...`);
        const orderId = await getOrderId(contract, clientAddress, orderIndex);
        const restaurant = await getOrder(contract, orderId);
        if (restaurant) {
          restaurantArray.push(restaurant);
        }
      }
      setRestaurants(restaurantArray);
    };

    if (contractAddress && numberOfOrders > 0) {
      fetchRestaurants();
    }
  }, [contractAddress, clientAddress, numberOfOrders]);

  return restaurants;
};

export const useGetOrdersForRestaurant = (
  contractAddress: string,
  restaurantAddress: string,
  numberOfOrders: number
) => {
  const [restaurants, setRestaurants] = useState<Order[]>([]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      const contractInterface = new utils.Interface(abi.abi);
      const contract = new Contract(
        contractAddress,
        contractInterface,
        alchemyGoerliProvider
      );

      const restaurantArray = [];
      for (let orderIndex = 0; orderIndex < numberOfOrders; ++orderIndex) {
        console.log(`Fetching order ${orderIndex}...`);
        const orderId = await getRestaurantOrderId(
          contract,
          restaurantAddress,
          orderIndex
        );
        const restaurant = await getOrder(contract, orderId);
        if (restaurant) {
          restaurantArray.push(restaurant);
        }
      }
      setRestaurants(restaurantArray);
    };

    if (contractAddress && numberOfOrders > 0) {
      fetchRestaurants();
    }
  }, [contractAddress, restaurantAddress, numberOfOrders]);

  return restaurants;
};

async function getOrderId(
  contract: Contract,
  clientAddress: string,
  index: number
) {
  try {
    const value = await contract.callStatic.clientsToOrdersMapping(
      clientAddress,
      index
    );
    return value;
  } catch (error: any) {
    console.error(`Error calling contract: ${error.toString()}`);
    return undefined;
  }
}

async function getRestaurantOrderId(
  contract: Contract,
  restaurantAddress: string,
  index: number
) {
  try {
    const value = await contract.callStatic.restaurantToOrdersIds(
      restaurantAddress,
      index
    );
    return value;
  } catch (error: any) {
    console.error(`Error calling contract: ${error.toString()}`);
    return undefined;
  }
}

async function getOrder(contract: Contract, orderId: number) {
  try {
    const order = await contract.callStatic.orders(orderId);
    if (order !== undefined) {
      return new Order(
        order.id,
        order.restaurantAddr,
        undefined,
        undefined,
        order.deliveryFee,
        order.deliveryAddress,
        order.status
      );
    } else {
      console.error(`Invalid response from contract: ${JSON.stringify(order)}`);
      return undefined;
    }
  } catch (error: any) {
    console.error(`Error calling contract: ${error.toString()}`);
    return undefined;
  }
}

export function usePlaceOrder(contractAddress: string, order: Order) {
  const contract = new Contract(
    contractAddress,
    abi.abi,
    alchemyGoerliProvider
  );

  const { state, send } = useContractFunction(contract, "placeOrder", {
    transactionName: "PlaceOrder",
  });

  const placeOrder = async (order: Order) => {
    console.log(contractAddress);
    console.log(order.restaurantAddr);
    console.log(order.itemIds);
    console.log(order.quantities);
    console.log(order.deliveryFee);
    const { 0: totalPrice } = await contract.getWeiPriceForOrder(
      order.restaurantAddr,
      order.itemIds,
      order.quantities,
      order.deliveryFee
    );

    console.log(totalPrice);

    const valueToSend = totalPrice.add(order.deliveryFee) + 10;

    send(
      order.restaurantAddr,
      order.itemIds,
      order.quantities,
      order.deliveryFee,
      order.deliveryAddress,
      {
        value: valueToSend,
      }
    );
  };

  return { state, placeOrder };
}
