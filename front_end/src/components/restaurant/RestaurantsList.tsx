import React from "react";
import {
  useGetNumberOfRestaurants,
  useGetRestaurants,
} from "../../hooks/RestaurantHooks";
import { useGetContractAddress } from "../Main";
import { RestaurantLinkComponent } from "./ReataurantLinkComponent";
import { Box, Grid, GridItem } from "@chakra-ui/react";

export const RestaurantsList = React.memo(() => {
  const contractAddress = useGetContractAddress();
  const numberOfRestaurants = useGetNumberOfRestaurants(contractAddress);
  const restaurants = useGetRestaurants(contractAddress, numberOfRestaurants!);

  console.log("RestaurantComponent render");
  return (
    <Box>
      <div>There are {numberOfRestaurants} restaurants.</div>
      <Grid templateColumns="repeat(3, 1fr)" gap={6}>
        {restaurants.map((restaurant) => (
          <GridItem key={restaurant.addr}>
            <RestaurantLinkComponent restaurant={restaurant} />
          </GridItem>
        ))}
      </Grid>
    </Box>
  );
});
