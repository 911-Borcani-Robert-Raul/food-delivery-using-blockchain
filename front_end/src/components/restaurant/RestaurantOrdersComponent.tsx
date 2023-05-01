import { useEthers } from "@usedapp/core";
import React from "react";
import { getOrderStatusString, Order, OrderStatus } from "../../domain/Order";
import {
  useChangeOrderStatus,
  useGetNumberOfOrdersForRestaurant,
  useGetOrdersForRestaurant,
} from "../../hooks/OrderHooks";
import { useGetContractAddress } from "../Main";
import { OrderLinkComponent } from "../order/OrderLinkComponent";
import { OrdersListComponentForStatusChange } from "../order/OrdersListComponentForStatusChange";

export const RestaurantOrdersComponent = React.memo(() => {
  const contractAddress = useGetContractAddress();
  const { account } = useEthers();

  const numberOfOrders = useGetNumberOfOrdersForRestaurant(
    contractAddress,
    account!
  );
  const orders: Order[] = useGetOrdersForRestaurant(
    contractAddress,
    account!,
    numberOfOrders!
  );

  const pendingOrders: Order[] = orders.filter(
    (order) => order.orderStatus === OrderStatus.PENDING
  );
  const assignedCourierOrders: Order[] = orders.filter(
    (order) => order.orderStatus === OrderStatus.ASSIGNED_COURIER
  );

  const { state: acceptOrderState, changeStatus: acceptOrderSend } =
    useChangeOrderStatus(contractAddress, OrderStatus.WAITING_COURIER);

  async function onClick_acceptOrder(orderId: number) {
    await acceptOrderSend(orderId);
  }

  return (
    <div>
      <h2>Pending orders</h2>
      <OrdersListComponentForStatusChange
        contractAddress={contractAddress}
        ordersList={pendingOrders}
        newStatus={OrderStatus.WAITING_COURIER}
        statusChangeActionName={"Accept order"}
      />

      <h2>Orders being prepared</h2>
      <OrdersListComponentForStatusChange
        contractAddress={contractAddress}
        ordersList={assignedCourierOrders}
        newStatus={OrderStatus.READY_TO_DELIVER}
        statusChangeActionName={"Order is finished"}
      />

      {/* <div>You have {numberOfOrders} orders.</div>
      <div>
        {orders.map((order) => (
          <div key={`Order:${order.orderId}`}>
            <OrderLinkComponent order={order} />
            {order!.items?.map((item) => (
              <div key={`Item:${item}`}>{item.toString()}</div>
            ))}
            {order!.quantities?.map((quantity, index) => (
              <div key={`Quantity:${index}`}>{quantity.toString()}</div>
            ))}
            {order.orderStatus === OrderStatus.PENDING && (
              <div>
                <button onClick={() => onClick_acceptOrder(order.orderId!)}>
                  Accept order
                </button>
              </div>
            )}
            <div>Order status: {getOrderStatusString(order.orderStatus)}</div>
          </div>
        ))}
      </div> */}
    </div>
  );
});
