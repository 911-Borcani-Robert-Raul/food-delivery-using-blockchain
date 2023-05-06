import { useCall, useContractFunction, useEthers } from "@usedapp/core";
import { Contract, ethers, utils } from "ethers";
import { useEffect, useMemo, useState } from "react";
import abi from ".././chain-info/contracts/FoodDelivery.json";
import { alchemyGoerliProvider } from "../App";
import { Order, OrderStatus } from "../domain/Order";

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

      const order = await getOrder(contract, orderId);

      if (order !== undefined) {
        setOrder(order);
      }
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
  const [orders, setOrders] = useState<Order[]>([]);

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
      setOrders(restaurantArray);
    };

    if (contractAddress && numberOfOrders > 0) {
      fetchRestaurants();
    }
  }, [contractAddress, restaurantAddress, numberOfOrders]);

  return orders;
};

export const useGetOrdersForCourier = (
  contractAddress: string,
  courierAddress: string,
  numberOfOrders: number
) => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const contractInterface = new utils.Interface(abi.abi);
      const contract = new Contract(
        contractAddress,
        contractInterface,
        alchemyGoerliProvider
      );

      const restaurantArray = [];
      for (let orderIndex = 0; orderIndex < numberOfOrders; ++orderIndex) {
        const orderId = await getCourierOrderId(
          contract,
          courierAddress,
          orderIndex
        );
        const restaurant = await getOrder(contract, orderId);
        if (restaurant) {
          restaurantArray.push(restaurant);
        }
      }
      setOrders(restaurantArray);
    };

    if (contractAddress && numberOfOrders > 0) {
      fetchOrders();
    }
  }, [contractAddress, courierAddress, numberOfOrders]);

  return orders;
};

export const useGetWaitingForCourierOrders = (
  contractAddress: string,
  restaurantAddress: string,
  numberOfOrders: number
) => {
  const [orders, setOrders] = useState<Order[]>([]);

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
        const orderId = await getWaitingForCourierOrderId(contract, orderIndex);
        const restaurant = await getOrder(contract, orderId);
        if (restaurant) {
          restaurantArray.push(restaurant);
        }
      }
      setOrders(restaurantArray);
    };

    if (contractAddress && numberOfOrders > 0) {
      fetchRestaurants();
    }
  }, [contractAddress, restaurantAddress, numberOfOrders]);

  return orders;
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

async function getCourierOrderId(
  contract: Contract,
  courierAddress: string,
  index: number
) {
  try {
    const value = await contract.callStatic.couriersToOrdersMapping(
      courierAddress,
      index
    );
    return value;
  } catch (error: any) {
    console.error(`Error calling contract: ${error.toString()}`);
    return undefined;
  }
}

async function getWaitingForCourierOrderId(contract: Contract, index: number) {
  try {
    const value = await contract.callStatic.ordersWaitingForCourier(index);
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
      const [items, quantities] =
        await contract.callStatic.getOrderItemsAndQuantities(orderId);

      //   console.log("@##" + quantities);

      const result = new Order(
        orderId,
        order!.restaurantAddr,
        undefined,
        quantities,
        order.deliveryFee,
        order.deliveryAddress,
        order!.status
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
    // console.log(contractAddress);
    // console.log(order.restaurantAddr);
    // console.log(order.itemIds);
    // console.log(order.quantities);
    // console.log(order.deliveryFee);
    const { 0: totalPrice, 1: ethDeliveryFee } =
      await contract.getWeiPriceForOrder(
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
    // console.log(contractAddress);
    // console.log(order.restaurantAddr);
    // console.log(order.itemIds);
    // console.log(order.quantities);
    // console.log(order.deliveryFee);
    if (durationSeconds) {
      send(orderId, durationSeconds);
    } else {
      send(orderId);
    }
  };

  return { state, changeStatus };
}
