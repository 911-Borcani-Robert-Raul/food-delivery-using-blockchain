import { useEthers } from "@usedapp/core";
import React from "react";
import { getOrderStatusString, OrderStatus } from "../../domain/Order";
import {
  useChangeOrderStatus,
  useGetNumberOfOrdersForRestaurant,
  useGetNumberOfOrdersWaitingForCourier,
  useGetOrdersForRestaurant,
  useGetWaitingForCourierOrders,
} from "../../hooks/OrderHooks";
import { useGetContractAddress } from "../Main";
import { OrderLinkComponent } from "../order/OrderLinkComponent";
import { OrdersListComponentForStatusChange } from "../order/OrdersListComponentForStatusChange";
import { Box, Button, Flex, Heading, HStack, Text } from "@chakra-ui/react";

export const WaitingForCourierOrderListComponent = React.memo(() => {
  const contractAddress = useGetContractAddress();
  const { account } = useEthers();

  const numberOfOrders = useGetNumberOfOrdersWaitingForCourier(contractAddress);
  const orders = useGetWaitingForCourierOrders(
    contractAddress,
    account!,
    numberOfOrders!
  );
  const { state: takeOrderState, changeStatus: takeOrderSend } =
    useChangeOrderStatus(contractAddress, OrderStatus.ASSIGNED_COURIER);

  return (
    <Box>
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
