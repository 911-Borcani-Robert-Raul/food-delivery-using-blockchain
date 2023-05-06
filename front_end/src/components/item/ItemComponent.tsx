import { Box, Button, Heading, Text } from "@chakra-ui/react";
import { Item } from "../../domain/Item";
import { Restaurant } from "../../domain/Restaurant";
import { addToCart } from "../../shopping-cart/ShoppingCart";

interface ItemComponentProps {
  restaurantAddress: string;
  item: Item;
}

export function ItemComponent({ restaurantAddress, item }: ItemComponentProps) {
  return (
    <Box p="4" borderWidth="1px" borderRadius="md" boxShadow="md" my="4">
      <Heading size="md" mb="2">
        {item.id!.toString()}. {item.name}
      </Heading>
      <Text fontSize="sm" mb="2">
        {item.description}
      </Text>
      <Text fontSize="lg" fontWeight="bold" mb="4">
        Price: {item.price.toString()}
      </Text>

      <Button
        colorScheme="teal"
        onClick={() => addToCart(restaurantAddress, item, 1)}
      >
        Add to cart
      </Button>
    </Box>
  );
}
