import { useEthers } from "@usedapp/core";
import React from "react";
import { Order, OrderStatus } from "../../domain/Order";
import {
  useChangeOrderStatus,
  useGetNumberOfOrdersForCourier,
  useGetOrdersForCourier,
} from "../../hooks/OrderHooks";
import { useGetContractAddress } from "../Main";
import { OrdersListComponentForStatusChange } from "../order/OrdersListComponentForStatusChange";
import { Box, Text } from "@chakra-ui/react";

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
