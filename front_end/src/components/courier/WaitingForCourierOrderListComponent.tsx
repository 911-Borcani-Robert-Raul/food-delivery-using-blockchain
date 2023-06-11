import { Box } from "@chakra-ui/react";
import React from "react";
import { OrderStatus } from "../../domain/Order";
import {
  useGetWaitingForCourierOrders
} from "../../hooks/OrderHooks";
import { useGetContractAddress } from "../Main";
import { OrdersListComponentForStatusChange } from "../order/OrdersListComponentForStatusChange";

export const WaitingForCourierOrderListComponent = React.memo(() => {
  const contractAddress = useGetContractAddress();
  const orders = useGetWaitingForCourierOrders(contractAddress);

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
      <OrdersListComponentForStatusChange
        contractAddress={contractAddress}
        ordersList={orders}
        newStatus={OrderStatus.ASSIGNED_COURIER}
        statusChangeActionName={"Take order"}
        allowTimeDuration={true}
      />
    </Box>
  );
});
