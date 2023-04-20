import { Link } from "react-router-dom";
import { Item } from "../../domain/Item";
import { Restaurant } from "../../domain/Restaurant";
import { useGetItems, useGetNumberOfItemsInMenu } from "../../hooks/ItemHooks";
import { ItemComponent } from "./ItemComponent";

interface ItemsListComponentPropsProps {
  contractAddress: string;
  restaurantAddress: string;
}

export function ItemsListComponent({
  contractAddress,
  restaurantAddress,
}: ItemsListComponentPropsProps) {
  const numberOfItems = useGetNumberOfItemsInMenu(
    contractAddress,
    restaurantAddress
  );
  const items = useGetItems(contractAddress, restaurantAddress, numberOfItems!);

  return (
    <div>
      {items.map((item) => (
        <ItemComponent
          key={item.id}
          item={item}
          restaurantAddress={restaurantAddress}
        />
      ))}
    </div>
  );
}
