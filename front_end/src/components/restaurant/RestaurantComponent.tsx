import { useParams } from "react-router-dom";
import { useGetNumberOfItemsInMenu } from "../../hooks/ItemHooks";
import { useGetRestaurant } from "../../hooks/RestaurantHooks";
import { ItemsListComponent } from "../item/ItemsListComponent";
import { useGetContractAddress } from "../Main";

export function RestaurantComponent() {
  const contractAddr = useGetContractAddress();
  const { restaurantAddr } = useParams();
  const restaurant = useGetRestaurant(contractAddr, restaurantAddr!);

  return (
    <div>
      <h1>{restaurant && restaurant.name}</h1>
      <p>{restaurant && restaurant.addr}</p>
      <p>{restaurant && restaurant.description}</p>

      <ItemsListComponent
        contractAddress={contractAddr}
        restaurantAddress={restaurantAddr!}
      />
    </div>
  );
}
