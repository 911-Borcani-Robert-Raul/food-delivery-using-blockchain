import { Box, Heading, SimpleGrid } from "@chakra-ui/react";
import React from "react";
import { OrdersReadyToDeliverListComponent } from "./OrdersReadyToDeliverListComponent";
import { WaitingForCourierOrderListComponent } from "./WaitingForCourierOrderListComponent";

export const CourierComponent = React.memo(() => {
  return (
    <Box p="4">
      <Heading as="h2" size="lg" mb="4">
        Orders waiting for couriers
      </Heading>
      <WaitingForCourierOrderListComponent />

      <Heading as="h2" size="lg" mt="8" mb="4">
        Orders waiting to be delivered
      </Heading>
      <OrdersReadyToDeliverListComponent />
    </Box>
  );
});
