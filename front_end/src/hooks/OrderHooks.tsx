import {
  useBlockMeta,
  useBlockNumber,
  useCall,
  useContractFunction,
  useEthers,
} from "@usedapp/core";
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

  const block = useBlockNumber();

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
  }, [contractAddress, orderId, block]);

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
  clientAddress: string
) => {
  const [ordersList, setOrdersList] = useState<Order[]>([]);

  const block = useBlockNumber();

  useEffect(() => {
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
        const formattedRestaurants = orders.map(
          (order: any) =>
            new Order(
              order.id,
              order!.restaurantAddr,
              order!.restaurantName,
              order!.restaurantPhysicalAddress,
              order!.clientAddr,
              undefined,
              order.quantities,
              order.deliveryFee,
              order.deliveryAddress,
              order!.status
            )
        );
        setOrdersList(formattedRestaurants);
      } catch (error) {
        console.error("Error fetching restaurant list:", error);
      }
    };

    fetchRestaurantList();
  }, [contractAddress, clientAddress, block]);

  return ordersList;
};

export const useGetOrdersForRestaurant = (
  contractAddress: string,
  restaurantAddress: string
) => {
  const [ordersList, setOrdersList] = useState<Order[]>([]);

  const block = useBlockNumber();

  useEffect(() => {
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
        const formattedRestaurants = orders.map(
          (order: any) =>
            new Order(
              order.id,
              order!.restaurantAddr,
              order!.restaurantName,
              order!.restaurantPhysicalAddress,
              order!.clientAddr,
              undefined,
              order.quantities,
              order.deliveryFee,
              order.deliveryAddress,
              order!.status
            )
        );
        setOrdersList(formattedRestaurants);
      } catch (error) {
        console.error("Error fetching restaurant list:", error);
      }
    };

    fetchRestaurantList();
  }, [contractAddress, restaurantAddress, block]);

  return ordersList;
};

export const useGetOrdersForCourier = (
  contractAddress: string,
  courierAddress: string
) => {
  const [ordersList, setOrdersList] = useState<Order[]>([]);

  const block = useBlockNumber();

  useEffect(() => {
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
        const formattedRestaurants = orders.map(
          (order: any) =>
            new Order(
              order.id,
              order!.restaurantAddr,
              order!.restaurantName,
              order!.restaurantPhysicalAddress,
              order!.clientAddr,
              undefined,
              order.quantities,
              order.deliveryFee,
              order.deliveryAddress,
              order!.status
            )
        );
        setOrdersList(formattedRestaurants);
      } catch (error) {
        console.error("Error fetching restaurant list:", error);
      }
    };

    fetchRestaurantList();
  }, [contractAddress, courierAddress, block]);

  return ordersList;
};

export const useGetWaitingForCourierOrders = (contractAddress: string) => {
  const [ordersList, setOrdersList] = useState<Order[]>([]);

  const block = useBlockNumber();

  useEffect(() => {
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
        const formattedRestaurants = orders.map(
          (order: any) =>
            new Order(
              order.id,
              order!.restaurantAddr,
              order!.restaurantName,
              order!.restaurantPhysicalAddress,
              order!.clientAddr,
              undefined,
              order.quantities,
              order.deliveryFee,
              order.deliveryAddress,
              order!.status
            )
        );
        setOrdersList(formattedRestaurants);
      } catch (error) {
        console.error("Error fetching restaurant list:", error);
      }
    };

    fetchRestaurantList();
  }, [contractAddress, block]);

  return ordersList;
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
        order!.restaurantName,
        order!.restaurantPhysicalAddress,
        order!.clientAddr,
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
    console.log(
      order.restaurantAddr,
      order.itemIds,
      order.quantities,
      order.deliveryFee
    );
    const { 0: totalPrice, 1: ethDeliveryFee } =
      await contract.getWeiPriceForOrder(
        order.restaurantAddr,
        order.itemIds,
        order.quantities,
        order.deliveryFee
      );

    console.log("32423");

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
