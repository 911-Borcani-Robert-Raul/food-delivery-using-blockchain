import { Link } from "react-router-dom";
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
  const items = useGetItems(contractAddress, restaurantAddress, numberOfItems!);

  return (
    <div>
      {items.map(
        (item) =>
          item.available && (
            <ItemComponent
              key={item.id}
              item={item}
              restaurantAddress={restaurantAddress}
            />
          )
      )}
    </div>
  );
}