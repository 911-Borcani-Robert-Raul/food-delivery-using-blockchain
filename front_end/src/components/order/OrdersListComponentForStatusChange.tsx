import { useEffect, useState } from "react";
import { getOrderStatusString, Order, OrderStatus } from "../../domain/Order";
import { useChangeOrderStatus } from "../../hooks/OrderHooks";
import { OrderLinkComponent } from "./OrderLinkComponent";
import { SingleOrderStatusChangeComponent } from "./SingleOrderStatusChangeComponent";
import { Box, Grid, Text } from "@chakra-ui/react";

interface Props {
  contractAddress: string;
  ordersList: Order[];
  newStatus: OrderStatus;
  statusChangeActionName: string;
  allowTimeDuration?: boolean;
}

export function OrdersListComponentForStatusChange({
  contractAddress,
  ordersList,
  newStatus,
  statusChangeActionName,
  allowTimeDuration = false,
}: Props) {
  return (
    <Box p={8}>
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        You have {ordersList.length} orders.
      </Text>
      <Grid
        templateColumns={{
          base: "repeat(1, 1fr)",
          md: "repeat(2, 1fr)",
          lg: "repeat(3, 1fr)",
        }}
        gap={4}
      >
        {ordersList.map((order) => (
          <Box key={`Order:${order.orderId}`} mb={4}>
            <SingleOrderStatusChangeComponent
              contractAddress={contractAddress}
              newStatus={newStatus}
              order={order}
              statusChangeActionName={statusChangeActionName}
              allowTimeDuration={allowTimeDuration}
            />
          </Box>
        ))}
      </Grid>
    </Box>
  );
}
