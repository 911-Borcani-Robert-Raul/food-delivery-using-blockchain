import { Box, Link as ChakraLink, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { getOrderStatusString, Order } from "../../domain/Order";

interface Props {
  order: Order;
}

export function OrderLinkComponent({ order }: Props) {
  let orderDateAndTime = undefined;
  if (order.preparationStartTime) {
    const milliseconds = order.preparationStartTime * 1000;
    orderDateAndTime = new Date(milliseconds);
  }

  return (
    <Box
      bg="white"
      borderRadius={5}
      p={4}
      mb={2}
      boxShadow="0 0 10px rgba(0, 0, 0, 0.2)"
      width="100%" // Take up all available horizontal space
    >
      <Text mb={1}>{order.restaurantName}</Text>
      {orderDateAndTime && <Text>{orderDateAndTime.toLocaleString()}</Text>}
      <Text mb={1}>Address: {order.deliveryAddress}</Text>
      <Text fontWeight="bold" mb={1}>
        Order status: {getOrderStatusString(order.orderStatus)}
      </Text>
      <ChakraLink
        as={Link}
        to={`/order/${order.orderId}`}
        color="blue.500"
        fontWeight="bold"
        _hover={{ textDecoration: "none" }}
      >
        See details
      </ChakraLink>
    </Box>
  );
}
