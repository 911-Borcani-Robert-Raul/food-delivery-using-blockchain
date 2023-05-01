import { useEthers } from "@usedapp/core";
import React from "react";
import { OrderStatus } from "../../domain/Order";
import { useGetNumberOfOrders, useGetOrders } from "../../hooks/OrderHooks";
import { useGetContractAddress } from "../Main";
import { OrderLinkComponent } from "./OrderLinkComponent";
import { OrdersListComponentForStatusChange } from "./OrdersListComponentForStatusChange";

export const OrdersListComponent = React.memo(() => {
  const contractAddress = useGetContractAddress();
  const { account } = useEthers();

  const numberOfOrders = useGetNumberOfOrders(contractAddress, account!);
  const orders = useGetOrders(contractAddress, account!, numberOfOrders!);

  const deliveringOrders = orders.filter(
    (order) => order.orderStatus === OrderStatus.DELIVERING
  );

  console.log("RestaurantComponent render");
  return (
    <div>
      <h2>Orders being delivered now</h2>
      <OrdersListComponentForStatusChange
        contractAddress={contractAddress}
        ordersList={deliveringOrders}
        newStatus={OrderStatus.DELIVERED}
        statusChangeActionName={"Confirm order delivery"}
      />

      <h2>All your orders</h2>
      <div>You have {numberOfOrders} orders.</div>
      <div>
        {orders.map((order) => (
          <OrderLinkComponent key={order.orderId} order={order} />
        ))}
      </div>
    </div>
  );
});
