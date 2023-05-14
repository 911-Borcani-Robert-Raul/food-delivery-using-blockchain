import { Box, Heading, Text, Link, Button } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { Restaurant } from "../../domain/Restaurant";
import { clearShoppingCart } from "../../shopping-cart/ShoppingCart";

interface Props {
  restaurant: Restaurant;
}

export function RestaurantLinkComponent({ restaurant }: Props) {
  return (
    <Box p={4} borderWidth="1px" borderRadius="md" shadow="md">
      <Heading as="h2" size="md" mb={2}>
        {restaurant.name}
      </Heading>
      <Text fontSize="sm" color="gray.500" mb={2}>
        {restaurant.addr}
      </Text>
      <Text fontSize="sm" mb={4}>
        {restaurant.description}
      </Text>
      <Button
        as={RouterLink}
        to={`restaurant/${restaurant.addr}`}
        onClick={() => clearShoppingCart()}
        colorScheme="teal"
        size="sm"
      >
        Order
      </Button>
    </Box>
  );
}
