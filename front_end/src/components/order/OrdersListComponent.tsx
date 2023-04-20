import { useEthers } from "@usedapp/core";
import React from "react";
import { useGetNumberOfOrders, useGetOrders } from "../../hooks/OrderHooks";
import { useGetContractAddress } from "../Main";
import { OrderLinkComponent } from "./OrderLinkComponent";

export const OrdersListComponent = React.memo(() => {
  const contractAddress = useGetContractAddress();
  const { account } = useEthers();

  const numberOfOrders = useGetNumberOfOrders(contractAddress, account!);
  const orders = useGetOrders(contractAddress, account!, numberOfOrders!);

  console.log("RestaurantComponent render");
  return (
    <div>
      <div>You have {numberOfOrders} orders.</div>
      <div>
        {orders.map((order) => (
          <OrderLinkComponent key={order.orderId} order={order} />
        ))}
      </div>
    </div>
  );
});
