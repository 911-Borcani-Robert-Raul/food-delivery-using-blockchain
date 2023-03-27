import { useEtherBalance, useEthers } from "@usedapp/core";
import { formatEther } from "ethers/lib/utils";
import helperConfig from "../helper-config.json";
import {
  useGetNumberOfRestaurants,
  useGetRestaurant,
  useGetRestaurantAddress,
  useGetRestaurants,
} from "../hooks/RestaurantHooks";
import { RestaurantComponent } from "./RestaurantComponent";
import networkMapping from "../chain-info/deployments/map.json";
import { constants } from "ethers";
import { Restaurant } from "../domain/Restaurant";
import { useMemo } from "react";

export const Main = () => {
  const { account, chainId, error } = useEthers();
  const networkName = chainId ? helperConfig[chainId] : "dev";
  const etherBalance = useEtherBalance(account);

  let stringChainId = String(chainId);
  const contractAddress = chainId
    ? networkMapping[stringChainId]["FoodDelivery"][0]
    : constants.AddressZero;
  const numberOfRestaurants = useGetNumberOfRestaurants(contractAddress);
  const firstRestaurantAddr = useGetRestaurantAddress(contractAddress, 0);
  const firstRestaurant = useGetRestaurant(
    contractAddress,
    firstRestaurantAddr
  );

  const restaurants = useGetRestaurants(contractAddress, numberOfRestaurants!);

  // console.log(chainId);
  // console.log(networkName);
  // console.log(error);
  // console.log(etherBalance);

  console.log(restaurants);

  return (
    <div>
      <div>
        Hi! Your ether balance is {formatEther(etherBalance ? etherBalance : 0)}
        ! There are {numberOfRestaurants} restaurants.
      </div>
      <div>
        {restaurants.map((restaurant) => (
          <RestaurantComponent key={restaurant.addr} restaurant={restaurant} />
        ))}
      </div>
    </div>
  );
};
