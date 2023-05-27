import { Box, Text, Link } from "@chakra-ui/react";
import { useEthers } from "@usedapp/core";
import { Item } from "../../domain/Item";
import { Restaurant } from "../../domain/Restaurant";
import { useGetItems, useGetNumberOfItemsInMenu } from "../../hooks/ItemHooks";
import { ItemComponent } from "./ItemComponent";

interface ItemsListComponentProps {
  contractAddress: string;
  restaurantAddress: string;
}

export function ItemsListComponent({
  contractAddress,
  restaurantAddress,
}: ItemsListComponentProps) {
  const numberOfItems = useGetNumberOfItemsInMenu(
    contractAddress,
    restaurantAddress
  );
  const { account: clientAddress } = useEthers();
  const items = useGetItems(contractAddress, restaurantAddress);

  return (
    <Box>
      <Text fontSize="lg" mb="4">
        Menu Items:
      </Text>
      {items.map(
        (item) =>
          item.available && (
            <ItemComponent
              key={item.id}
              item={item}
              restaurantAddress={restaurantAddress}
              clientAddress={clientAddress!}
            />
          )
      )}
      <Link href={`/`} mt="4">
        Back to restaurants
      </Link>
    </Box>
  );
}
