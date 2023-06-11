import { Box, Divider, Heading, VStack } from "@chakra-ui/react";
import { useEthers } from "@usedapp/core";
import React from "react";
import { OrderStatus } from "../../domain/Order";
import { useGetOrders } from "../../hooks/OrderHooks";
import { useGetContractAddress } from "../Main";
import { OrdersListComponentForStatusChange } from "./OrdersListComponentForStatusChange";

const OrdersListComponent = React.memo(() => {
  const contractAddress = useGetContractAddress();
  const { account } = useEthers();

  const orders = useGetOrders(contractAddress, account!);

  const deliveringOrders = orders.filter(
    (order) => order.orderStatus === OrderStatus.DELIVERING
  );

  return (
    <VStack
      p={6}
      bg="white"
      boxShadow="sm"
      borderRadius="lg"
      maxW="900px"
      mx="auto"
      mt={8}
      spacing={8}
    >
      <Box w="100%">
        <Heading size="lg">Orders being delivered now</Heading>
        <Divider />
        <OrdersListComponentForStatusChange
          contractAddress={contractAddress}
          ordersList={deliveringOrders}
          newStatus={OrderStatus.DELIVERED}
          statusChangeActionName={"Confirm order delivery"}
          allowTimeDuration={false}
        />
      </Box>

      <Box w="100%">
        <Heading size="lg">All your orders</Heading>
        <Divider />
        <Box mt={2}>
          <OrdersListComponentForStatusChange
            contractAddress={contractAddress}
            ordersList={orders}
            newStatus={OrderStatus.CANCELLED}
            statusChangeActionName={"Delete order"}
            allowTimeDuration={false}
          />
        </Box>
      </Box>
    </VStack>
  );
});

export default OrdersListComponent;
