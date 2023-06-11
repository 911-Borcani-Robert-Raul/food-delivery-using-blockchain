import { Box, Heading } from "@chakra-ui/react";
import { useEthers } from "@usedapp/core";
import React from "react";
import { Order, OrderStatus } from "../../domain/Order";
import {
  useGetNumberOfOrdersForRestaurant,
  useGetOrdersForRestaurant
} from "../../hooks/OrderHooks";
import { useGetContractAddress } from "../Main";
import { OrdersListComponentForStatusChange } from "../order/OrdersListComponentForStatusChange";

export const RestaurantOrdersComponent = React.memo(() => {
  const contractAddress = useGetContractAddress();
  const { account } = useEthers();

  const numberOfOrders = useGetNumberOfOrdersForRestaurant(
    contractAddress,
    account!
  );
  const orders: Order[] = useGetOrdersForRestaurant(contractAddress, account!);

  const pendingOrders: Order[] = orders.filter(
    (order) => order.orderStatus === OrderStatus.PENDING
  );
  const assignedCourierOrders: Order[] = orders.filter(
    (order) => order.orderStatus === OrderStatus.ASSIGNED_COURIER
  );

  return (
    <Box>
      <Heading as="h2" size="md">
        Pending orders
      </Heading>
      <OrdersListComponentForStatusChange
        contractAddress={contractAddress}
        ordersList={pendingOrders}
        newStatus={OrderStatus.WAITING_COURIER}
        statusChangeActionName={"Accept order"}
        allowTimeDuration={true}
      />

      <Heading as="h2" size="md">
        Orders being prepared
      </Heading>
      <OrdersListComponentForStatusChange
        contractAddress={contractAddress}
        ordersList={assignedCourierOrders}
        newStatus={OrderStatus.READY_TO_DELIVER}
        statusChangeActionName={"Order is finished"}
      />

      {/* <Box>You have {numberOfOrders} orders.</Box>
      <Box>
        {orders.map((order) => (
          <Box key={`Order:${order.orderId}`}>
            <OrderLinkComponent order={order} />
            {order!.items?.map((item) => (
              <Box key={`Item:${item}`}>{item.toString()}</Box>
            ))}
            {order!.quantities?.map((quantity, index) => (
              <Box key={`Quantity:${index}`}>{quantity.toString()}</Box>
            ))}
            {order.orderStatus === OrderStatus.PENDING && (
              <Box>
                <Button onClick={() => onClick_acceptOrder(order.orderId!)}>
                  Accept order
                </Button>
              </Box>
            )}
            <Box>Order status: {getOrderStatusString(order.orderStatus)}</Box>
          </Box>
        ))}
      </Box> */}
    </Box>
  );
});
