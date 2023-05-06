import { Link } from "react-router-dom";
import { getOrderStatusString, Order } from "../../domain/Order";
import { Box, Text, Link as ChakraLink } from "@chakra-ui/react";

interface Props {
  order: Order;
}

export function OrderLinkComponent({ order }: Props) {
  return (
    <Box
      bg="white"
      borderRadius={5}
      p={4}
      mb={2}
      boxShadow="0 0 10px rgba(0, 0, 0, 0.2)"
    >
      <Text mb={1}>{order.restaurantAddr}</Text>
      <Text mb={1}>Address: {order.deliveryAddress}</Text>
      <Text mb={1}>Delivery fee: {order.deliveryFee.toString()}</Text>
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
