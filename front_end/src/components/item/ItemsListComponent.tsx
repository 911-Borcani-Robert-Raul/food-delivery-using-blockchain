import { Box, Text, Link, Spinner } from "@chakra-ui/react";
import { useEthers } from "@usedapp/core";
import { Item } from "../../domain/Item";
import { Restaurant } from "../../domain/Restaurant";
import { useGetItems, useGetNumberOfItemsInMenu } from "../../hooks/ItemHooks";
import { ItemComponent } from "./ItemComponent";

interface ItemsListComponentProps {
  contractAddress: string;
  restaurant: Restaurant;
}

export function ItemsListComponent({
  contractAddress,
  restaurant,
}: ItemsListComponentProps) {
  const { account: clientAddress } = useEthers();

  const items = useGetItems(contractAddress, restaurant!.addr!);

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
              restaurantAddress={restaurant.addr!}
              restaurantName={restaurant.name}
              restaurantPhysicalAddress={restaurant.physicalAddress}
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
