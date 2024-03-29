import { Box, Grid, Text } from "@chakra-ui/react";
import { Order, OrderStatus } from "../../domain/Order";
import { SingleOrderStatusChangeComponent } from "./SingleOrderStatusChangeComponent";

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
        templateColumns="repeat(1, 1fr)" // Display a single column in all screen sizes
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
