import { Box, Button, Heading, Text } from "@chakra-ui/react";
import { Item } from "../../domain/Item";
import { addToCart } from "../../shopping-cart/ShoppingCart";

interface ItemComponentProps {
  restaurantAddress: string;
  restaurantName: string;
  restaurantPhysicalAddress: string;
  clientAddress: string;
  item: Item;
}

export function ItemComponent({
  restaurantAddress,
  restaurantName,
  restaurantPhysicalAddress,
  clientAddress,
  item,
}: ItemComponentProps) {
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
        onClick={() =>
          addToCart(
            clientAddress,
            restaurantAddress,
            restaurantName,
            restaurantPhysicalAddress,
            item,
            1
          )
        }
      >
        Add to cart
      </Button>
    </Box>
  );
}
