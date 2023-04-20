import React from "react";
import {
  useGetNumberOfRestaurants,
  useGetRestaurants,
} from "../../hooks/RestaurantHooks";
import { useGetContractAddress } from "../Main";
import { RestaurantLinkComponent } from "./ReataurantLinkComponent";

export const RestaurantsList = React.memo(() => {
  const contractAddress = useGetContractAddress();
  const numberOfRestaurants = useGetNumberOfRestaurants(contractAddress);
  const restaurants = useGetRestaurants(contractAddress, numberOfRestaurants!);

  console.log("RestaurantComponent render");
  return (
    <div>
      <div>There are {numberOfRestaurants} restaurants.</div>
      <div>
        {restaurants.map((restaurant) => (
          <RestaurantLinkComponent
            key={restaurant.addr}
            restaurant={restaurant}
          />
        ))}
      </div>
    </div>
  );
});
