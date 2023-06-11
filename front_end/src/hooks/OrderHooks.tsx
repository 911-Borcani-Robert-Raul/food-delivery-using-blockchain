import {
  useBlockNumber,
  useCall,
  useContractFunction
} from "@usedapp/core";
import { Contract, ethers, utils } from "ethers";
import { useEffect, useState } from "react";
import abi from ".././chain-info/contracts/FoodDelivery.json";
import { alchemyGoerliProvider } from "../App";
import { Order, OrderStatus } from "../domain/Order";

/**
 * Custom hook to get an order from the smart contract based on its ID.
 * @param contractAddress - The address of the smart contract.
 * @param orderId - The ID of the order.
 * @returns The order object or null if not found.
 */
export function useGetOrder(contractAddress: string, orderId: number): Order | null {
  const [order, setOrder] = useState<Order | null>(null);

  const block = useBlockNumber();

  useEffect(() => {
    /**
     * Fetches the data of an order from the smart contract.
     */
    const fetchOrderData = async (): Promise<void> => {
      const contractInterface = new utils.Interface(abi.abi);
      const contract = new Contract(
        contractAddress,
        contractInterface,
        alchemyGoerliProvider
      );

      const order = await getOrder(contract, orderId);

      if (order !== undefined) {
        setOrder(order);
      }
    };

    fetchOrderData();
  }, [contractAddress, orderId, block]);

  return order;
}

/**
 * Custom hook to get the number of orders for a specific client from the smart contract.
 * @param contractAddress - The address of the smart contract.
 * @param clientAddress - The address of the client.
 * @returns The number of orders.
 */
export function useGetNumberOfOrders(
  contractAddress: string,
  clientAddress: string
) {
  const contractInterface = new utils.Interface(abi.abi);
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

/**
 * Custom hook to get the number of orders for a specific restaurant from the smart contract.
 * @param contractAddress - The address of the smart contract.
 * @param restaurantAddress - The address of the restaurant.
 * @returns The number of orders.
 */
export function useGetNumberOfOrdersForRestaurant(
  contractAddress: string,
  restaurantAddress: string
) {
  const contractInterface = new utils.Interface(abi.abi);
  const { value, error } =
    useCall(
      contractAddress &&
        restaurantAddress && {
          contract: new Contract(
            contractAddress,
            contractInterface,
            alchemyGoerliProvider
          ),
          method: "getNumberOfOrderForRestaurant",
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
 * Custom hook to get the number of orders for a specific courier from the smart contract.
 * @param contractAddress - The address of the smart contract.
 * @param courierAddress - The address of the courier.
 * @returns The number of orders.
 */
export function useGetNumberOfOrdersForCourier(
  contractAddress: string,
  courierAddress: string
) {
  const contractInterface = new utils.Interface(abi.abi);
  const { value, error } =
    useCall(
      contractAddress &&
        courierAddress && {
          contract: new Contract(
            contractAddress,
            contractInterface,
            alchemyGoerliProvider
          ),
          method: "getNumberOfOrdersForCourier",
          args: [courierAddress],
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
 * Custom hook to get the number of orders waiting for a courier from the smart contract.
 * @param contractAddress - The address of the smart contract.
 * @returns The number of orders.
 */
export function useGetNumberOfOrdersWaitingForCourier(contractAddress: string) {
  const contractInterface = new utils.Interface(abi.abi);
  const { value, error } =
    useCall(
      contractAddress && {
        contract: new Contract(
          contractAddress,
          contractInterface,
          alchemyGoerliProvider
        ),
        method: "getNumberOfOrdersWaitingForCourier",
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
 * Custom hook to get all orders for a specific client from the smart contract.
 * @param contractAddress - The address of the smart contract.
 * @param clientAddress - The address of the client.
 * @returns An array of order objects.
 */
export const useGetOrders = (
  contractAddress: string,
  clientAddress: string
) => {
  const [ordersList, setOrdersList] = useState<Order[]>([]);

  const block = useBlockNumber();

  useEffect(() => {
    /**
     * Fetches the list of orders for a client from the smart contract.
     */
    const fetchRestaurantList = async () => {
      try {
        const contract: Contract = new Contract(
          contractAddress,
          abi.abi,
          alchemyGoerliProvider
        );
        const orders = await contract.callStatic.getAllOrdersForClient(
          clientAddress
        );
        const formattedOrders = orders.map(
          (order: any) =>
            new Order(
              order.id,
              order.restaurantAddr,
              order.restaurantName,
              order.restaurantPhysicalAddress,
              order.clientAddr,
              undefined,
              order.quantities,
              order.deliveryFee,
              order.deliveryAddress,
              order.status,
              order.preparationStartTime
            )
        );
        setOrdersList(formattedOrders);
      } catch (error) {
        console.error("Error fetching order list:", error);
      }
    };

    fetchRestaurantList();
  }, [contractAddress, clientAddress, block]);

  return ordersList;
};

/**
 * Custom hook to get all orders for a specific restaurant from the smart contract.
 * @param contractAddress - The address of the smart contract.
 * @param restaurantAddress - The address of the restaurant.
 * @returns An array of order objects.
 */
export const useGetOrdersForRestaurant = (
  contractAddress: string,
  restaurantAddress: string
) => {
  const [ordersList, setOrdersList] = useState<Order[]>([]);

  const block = useBlockNumber();

  useEffect(() => {
    /**
     * Fetches the list of orders for a restaurant from the smart contract.
     */
    const fetchRestaurantList = async () => {
      try {
        const contract: Contract = new Contract(
          contractAddress,
          abi.abi,
          alchemyGoerliProvider
        );
        const orders = await contract.callStatic.getAllOrdersForRestaurant(
          restaurantAddress
        );
        const formattedOrders = orders.map(
          (order: any) =>
            new Order(
              order.id,
              order.restaurantAddr,
              order.restaurantName,
              order.restaurantPhysicalAddress,
              order.clientAddr,
              undefined,
              order.quantities,
              order.deliveryFee,
              order.deliveryAddress,
              order.status,
              order.preparationStartTime
            )
        );
        setOrdersList(formattedOrders);
      } catch (error) {
        console.error("Error fetching order list:", error);
      }
    };

    fetchRestaurantList();
  }, [contractAddress, restaurantAddress, block]);

  return ordersList;
};

/**
 * Custom hook to get all orders for a specific courier from the smart contract.
 * @param contractAddress - The address of the smart contract.
 * @param courierAddress - The address of the courier.
 * @returns An array of order objects.
 */
export const useGetOrdersForCourier = (
  contractAddress: string,
  courierAddress: string
) => {
  const [ordersList, setOrdersList] = useState<Order[]>([]);

  const block = useBlockNumber();

  useEffect(() => {
    /**
     * Fetches the list of orders for a courier from the smart contract.
     */
    const fetchRestaurantList = async () => {
      try {
        const contract: Contract = new Contract(
          contractAddress,
          abi.abi,
          alchemyGoerliProvider
        );
        const orders = await contract.callStatic.getOrdersForCouriers(
          courierAddress
        );
        const formattedOrders = orders.map(
          (order: any) =>
            new Order(
              order.id,
              order.restaurantAddr,
              order.restaurantName,
              order.restaurantPhysicalAddress,
              order.clientAddr,
              undefined,
              order.quantities,
              order.deliveryFee,
              order.deliveryAddress,
              order.status,
              order.preparationStartTime
            )
        );
        setOrdersList(formattedOrders);
      } catch (error) {
        console.error("Error fetching order list:", error);
      }
    };

    fetchRestaurantList();
  }, [contractAddress, courierAddress, block]);

  return ordersList;
};

/**
 * Custom hook to get all orders waiting for a courier from the smart contract.
 * @param contractAddress - The address of the smart contract.
 * @returns An array of order objects.
 */
export const useGetWaitingForCourierOrders = (contractAddress: string) => {
  const [ordersList, setOrdersList] = useState<Order[]>([]);

  const block = useBlockNumber();

  useEffect(() => {
    /**
     * Fetches the list of orders waiting for a courier from the smart contract.
     */
    const fetchRestaurantList = async () => {
      try {
        const contract: Contract = new Contract(
          contractAddress,
          abi.abi,
          alchemyGoerliProvider
        );
        const orders = await contract.callStatic.getOrdersByStatus(
          OrderStatus.WAITING_COURIER
        );
        const formattedOrders = orders.map(
          (order: any) =>
            new Order(
              order.id,
              order.restaurantAddr,
              order.restaurantName,
              order.restaurantPhysicalAddress,
              order.clientAddr,
              undefined,
              order.quantities,
              order.deliveryFee,
              order.deliveryAddress,
              order.status,
              order.preparationStartTime
            )
        );
        setOrdersList(formattedOrders);
      } catch (error) {
        console.error("Error fetching order list:", error);
      }
    };

    fetchRestaurantList();
  }, [contractAddress, block]);

  return ordersList;
};

/**
 * Retrieves an order from the smart contract.
 * @param contract - The contract instance.
 * @param orderId - The ID of the order.
 * @returns The order object or undefined if not found.
 */
async function getOrder(contract: Contract, orderId: number) {
  try {
    const order = await contract.callStatic.orders(orderId);

    if (order !== undefined) {
      const [items, quantities] = await contract.callStatic.getOrderItemsAndQuantities(orderId);

      const result = new Order(
        orderId,
        order.restaurantAddr,
        order.restaurantName,
        order.restaurantPhysicalAddress,
        order.clientAddr,
        undefined,
        quantities,
        order.deliveryFee,
        order.deliveryAddress,
        order.status,
        order.preparationStartTime
      );
      result.items = items;

      return result;
    } else {
      console.error(`Invalid response from contract: ${JSON.stringify(order)}`);
      return undefined;
    }
  } catch (error: any) {
    console.error(`Error calling contract: ${error.toString()}`);
    return undefined;
  }
}

/**
 * Custom hook to place an order.
 * @param contractAddress - The address of the smart contract.
 * @param order - The order object.
 * @returns The state and function for placing an order.
 */
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
    const { 0: totalPrice, 1: ethDeliveryFee } = await contract.getWeiPriceForOrder(
      order.restaurantAddr,
      order.itemIds,
      order.quantities,
      order.deliveryFee
    );

    const valueToSend = totalPrice.add(ethDeliveryFee);
    const valueToSendString = valueToSend.toString(); // convert to string
    const valueToSendWei = ethers.utils.parseUnits(valueToSendString, "wei"); // convert to BigNumber

    send(
      order.restaurantAddr,
      order.itemIds,
      order.quantities,
      order.deliveryFee,
      order.deliveryAddress,
      {
        value: valueToSendWei,
      }
    );
  };

  return { state, placeOrder };
}

/**
 * Custom hook to increase the delivery fee for an order.
 * @param contractAddress - The address of the smart contract.
 * @returns The state and function for increasing the delivery fee.
 */
export function useIncreaseDeliveryFee(contractAddress: string) {
  const contract = new Contract(
    contractAddress,
    abi.abi,
    alchemyGoerliProvider
  );

  const { state, send } = useContractFunction(contract, "increaseDeliveryFee", {
    transactionName: "IncreaseDeliveryFee",
  });

  const increaseFee = async (orderId: number, fee: number) => {
    const cost = await contract.getPriceInEth(fee);

    send(orderId, {
      value: cost,
    });
  };

  return { state, increaseFee };
}

/**
 * Custom hook to change the status of an order.
 * @param contractAddress - The address of the smart contract.
 * @param toStatus - The desired status of the order.
 * @returns The state and function for changing the order status.
 */
export function useChangeOrderStatus(
  contractAddress: string,
  toStatus: OrderStatus
) {
  const contract = new Contract(
    contractAddress,
    abi.abi,
    alchemyGoerliProvider
  );

  let methodName: string = "";
  let transactionName: string = "";

  switch (toStatus) {
    case OrderStatus.WAITING_COURIER:
      methodName = "acceptOrder";
      transactionName = "AcceptOrder";
      break;
    case OrderStatus.ASSIGNED_COURIER:
      methodName = "takeOrder";
      transactionName = "TakeOrder";
      break;
    case OrderStatus.READY_TO_DELIVER:
      methodName = "orderReadyToDeliver";
      transactionName = "ReadyToDeliver";
      break;
    case OrderStatus.DELIVERING:
      methodName = "orderDelivering";
      transactionName = "Delivering";
      break;
    case OrderStatus.DELIVERED:
      methodName = "orderDelivered";
      transactionName = "OrderDelivered";
      break;
    case OrderStatus.CANCELLED:
      methodName = "cancelOrder";
      transactionName = "CancelOrder";
      break;
  }

  if (toStatus === OrderStatus.WAITING_COURIER) {
    methodName = "acceptOrder";
    transactionName = "AcceptOrder";
  }

  const { state, send } = useContractFunction(contract, methodName!, {
    transactionName: transactionName,
  });

  const changeStatus = async (
    orderId: number,
    durationSeconds: number | undefined
  ) => {
    if (durationSeconds) {
      send(orderId, durationSeconds);
    } else {
      send(orderId);
    }
  };

  return { state, changeStatus };
}
