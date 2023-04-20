import { useEthers } from "@usedapp/core";
import React from "react";
import {
  useGetNumberOfOrdersForRestaurant,
  useGetOrdersForRestaurant,
} from "../../hooks/OrderHooks";
import { useGetContractAddress } from "../Main";
import { OrderLinkComponent } from "../order/OrderLinkComponent";

export const RestaurantOrdersComponent = React.memo(() => {
  const contractAddress = useGetContractAddress();
  const { account } = useEthers();

  const numberOfOrders = useGetNumberOfOrdersForRestaurant(
    contractAddress,
    account!
  );
  const orders = useGetOrdersForRestaurant(
    contractAddress,
    account!,
    numberOfOrders!
  );

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
