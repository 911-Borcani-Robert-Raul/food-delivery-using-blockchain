import { useEthers } from "@usedapp/core";
import React from "react";
import { OrderStatus } from "../../domain/Order";
import { useGetNumberOfOrders, useGetOrders } from "../../hooks/OrderHooks";
import { useGetContractAddress } from "../Main";
import { OrderLinkComponent } from "./OrderLinkComponent";
import { OrdersListComponentForStatusChange } from "./OrdersListComponentForStatusChange";
import { Box, Divider, Heading, VStack } from "@chakra-ui/react";

const OrdersListComponent = React.memo(() => {
  const contractAddress = useGetContractAddress();
  const { account } = useEthers();

  const numberOfOrders = useGetNumberOfOrders(contractAddress, account!);
  const orders = useGetOrders(contractAddress, account!, numberOfOrders!);

  const deliveringOrders = orders.filter(
    (order) => order.orderStatus === OrderStatus.DELIVERING
  );

  console.log("RestaurantComponent render");
  return (
    <VStack mt={8} spacing={8}>
      <Box w="100%">
        <Heading size="lg">Orders being delivered now</Heading>
        <Divider />
        <OrdersListComponentForStatusChange
          contractAddress={contractAddress}
          ordersList={deliveringOrders}
          newStatus={OrderStatus.DELIVERED}
          statusChangeActionName={"Confirm order delivery"}
          allowTimeDuration={true}
        />
      </Box>

      <Box w="100%">
        <Heading size="lg">All your orders</Heading>
        <Divider />
        <Box>You have {numberOfOrders} orders.</Box>
        <Box mt={2}>
          {orders.map((order) => (
            <OrderLinkComponent key={order.orderId} order={order} />
          ))}
        </Box>
      </Box>
    </VStack>
  );
});

export default OrdersListComponent;
