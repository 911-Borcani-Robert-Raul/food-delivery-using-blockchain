import { useState } from "react";
import { useEthers } from "@usedapp/core";
import { useParams } from "react-router-dom";
import { useGetNumberOfItemsInMenu } from "../../hooks/ItemHooks";
import { useGetRestaurant } from "../../hooks/RestaurantHooks";
import { ItemsListComponent } from "../item/ItemsListComponent";
import { ItemsListManagementComponent } from "../item/ItemsListManagementComponent";
import { useGetContractAddress } from "../Main";
import { RestaurantOrdersComponent } from "./RestaurantOrdersComponent";

export function RestaurantManagementComponent() {
  const contractAddr = useGetContractAddress();
  const { account } = useEthers();

  const restaurantAddress = account;
  const restaurant = useGetRestaurant(contractAddr, restaurantAddress!);

  const [showItems, setShowItems] = useState(false);

  const handleShowItems = () => {
    setShowItems(!showItems);
  };

  return (
    <div>
      {restaurant === undefined && (
        <div>
          <button>Register restaurant</button>
        </div>
      )}

      {restaurant && (
        <div>
          <h1>{restaurant.name}</h1>
          <p>{restaurant.addr}</p>
          <p>{restaurant.description}</p>
          <button onClick={handleShowItems}>
            {showItems ? "Hide Items" : "Show Items"}
          </button>
          {showItems && (
            <ItemsListManagementComponent
              contractAddress={contractAddr}
              restaurantAddress={restaurantAddress!}
            />
          )}
          <RestaurantOrdersComponent />
        </div>
      )}
    </div>
  );
}
