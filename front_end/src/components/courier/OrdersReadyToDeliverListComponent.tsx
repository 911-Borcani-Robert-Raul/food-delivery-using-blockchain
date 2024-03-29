import { Box, Text } from "@chakra-ui/react";
import { useEthers } from "@usedapp/core";
import React from "react";
import { Order, OrderStatus } from "../../domain/Order";
import {
  useGetOrdersForCourier
} from "../../hooks/OrderHooks";
import { useGetContractAddress } from "../Main";
import { OrdersListComponentForStatusChange } from "../order/OrdersListComponentForStatusChange";

export const OrdersReadyToDeliverListComponent = React.memo(() => {
  const contractAddress = useGetContractAddress();
  const { account } = useEthers();

  const orders: Order[] = useGetOrdersForCourier(contractAddress, account!);

  const readyToDeliverOrders: Order[] = orders.filter(
    (order) => order.orderStatus === OrderStatus.READY_TO_DELIVER
  );

  return (
    <Box
      p={6}
      bg="white"
      boxShadow="sm"
      borderRadius="lg"
      maxW="900px"
      mx="auto"
      mt={8}
    >
      <Text fontSize="lg" mb="4">
        Orders Ready to Deliver:
      </Text>
      <OrdersListComponentForStatusChange
        contractAddress={contractAddress}
        ordersList={readyToDeliverOrders}
        newStatus={OrderStatus.DELIVERING}
        statusChangeActionName={"Deliver order"}
      />
    </Box>
  );
});
