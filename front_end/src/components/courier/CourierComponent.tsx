import { Box, Heading, SimpleGrid, VStack } from "@chakra-ui/react";
import React from "react";
import { OrdersReadyToDeliverListComponent } from "./OrdersReadyToDeliverListComponent";
import { WaitingForCourierOrderListComponent } from "./WaitingForCourierOrderListComponent";

export const CourierComponent = React.memo(() => {
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
        <Heading size="lg">Orders waiting for couriers</Heading>
        <WaitingForCourierOrderListComponent />

        <Heading size="lg">Orders waiting to be delivered</Heading>
        <OrdersReadyToDeliverListComponent />
      </Box>
    </VStack>
  );
});
