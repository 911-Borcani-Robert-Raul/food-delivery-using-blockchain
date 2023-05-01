import { useEthers } from "@usedapp/core";
import React from "react";
import { Order, OrderStatus } from "../../domain/Order";
import {
  useChangeOrderStatus,
  useGetNumberOfOrdersForCourier,
  useGetNumberOfOrdersWaitingForCourier,
  useGetOrdersForCourier,
  useGetWaitingForCourierOrders,
} from "../../hooks/OrderHooks";
import { useGetContractAddress } from "../Main";
import { OrdersListComponentForStatusChange } from "../order/OrdersListComponentForStatusChange";

export const OrdersReadyToDeliverListComponent = React.memo(() => {
  const contractAddress = useGetContractAddress();
  const { account } = useEthers();

  const numberOfOrders = useGetNumberOfOrdersForCourier(
    contractAddress,
    account!
  );
  const orders: Order[] = useGetOrdersForCourier(
    contractAddress,
    account!,
    numberOfOrders!
  );

  const readyToDeliverOrders: Order[] = orders.filter(
    (order) => order.orderStatus === OrderStatus.READY_TO_DELIVER
  );

  return (
    <div>
      <OrdersListComponentForStatusChange
        contractAddress={contractAddress}
        ordersList={readyToDeliverOrders}
        newStatus={OrderStatus.DELIVERING}
        statusChangeActionName={"Deliver order"}
      />
    </div>
  );
});
