import { useEthers } from "@usedapp/core";
import { constants } from "ethers";
import networkMapping from "../chain-info/deployments/map.json";
import { RestaurantsList } from "./restaurant/RestaurantsList";

export const useGetContractAddress = () => {
  const { chainId, error } = useEthers();

  let stringChainId = String(chainId);
  const contractAddress = chainId
    ? networkMapping[stringChainId]["FoodDelivery"][0]
    : constants.AddressZero;

  return contractAddress;
};

export const Main = () => {
  return <RestaurantsList></RestaurantsList>;
};
