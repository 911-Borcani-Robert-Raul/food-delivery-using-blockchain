import { Link } from "react-router-dom";
import { Item } from "../../domain/Item";
import { Restaurant } from "../../domain/Restaurant";
import { useGetItems, useGetNumberOfItemsInMenu } from "../../hooks/ItemHooks";
import { AddItemComponent } from "./AddItemComponent";
import { ItemComponent } from "./ItemComponent";
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
  const items = useGetItems(contractAddress, restaurantAddress, numberOfItems!);

  return (
    <div>
      {items.map((item) => (
        <ItemManagementComponent
          key={item.id}
          item={item}
          restaurantAddress={restaurantAddress}
          contractAddress={contractAddress}
        />
      ))}
      <h3>Add item</h3>
      <AddItemComponent
        key="addItem"
        restaurantAddress={restaurantAddress}
        contractAddress={contractAddress}
      />
    </div>
  );
}
