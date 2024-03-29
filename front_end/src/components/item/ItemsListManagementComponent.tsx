import { Box, Heading, SimpleGrid, VStack } from "@chakra-ui/react";
import { useGetItems, useGetNumberOfItemsInMenu } from "../../hooks/ItemHooks";
import { AddItemComponent } from "./AddItemComponent";
import { ItemManagementComponent } from "./ItemManagementComponent";

interface ItemsListComponentProps {
  contractAddress: string;
  restaurantAddress: string;
}

export function ItemsListManagementComponent({
  contractAddress,
  restaurantAddress,
}: ItemsListComponentProps) {
  const numberOfItems = useGetNumberOfItemsInMenu(
    contractAddress,
    restaurantAddress
  );
  const items = useGetItems(contractAddress, restaurantAddress);

  return (
    <Box>
      <SimpleGrid columns={[1, 2, 3]} spacing={8} mt={8}>
        {items.map((item) => (
          <ItemManagementComponent
            key={`Item${item.id}`}
            item={item}
            restaurantAddress={restaurantAddress}
            contractAddress={contractAddress}
          />
        ))}
      </SimpleGrid>
      <VStack mt={8} spacing={4}>
        <Heading as="h3" size="md">
          Add Item
        </Heading>
        <AddItemComponent
          key="addItem"
          restaurantAddress={restaurantAddress}
          contractAddress={contractAddress}
        />
      </VStack>
    </Box>
  );
}
