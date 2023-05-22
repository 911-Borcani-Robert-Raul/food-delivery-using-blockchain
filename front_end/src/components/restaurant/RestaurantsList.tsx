import React from "react";
import {
  useGetNumberOfRestaurants,
  useGetRestaurants,
} from "../../hooks/RestaurantHooks";
import { useGetContractAddress } from "../Main";
import { RestaurantLinkComponent } from "./ReataurantLinkComponent";
import { Box, Grid, GridItem, Center } from "@chakra-ui/react";

export const RestaurantsList = React.memo(() => {
  const contractAddress = useGetContractAddress();
  const numberOfRestaurants = useGetNumberOfRestaurants(contractAddress);
  const restaurants = useGetRestaurants(contractAddress, numberOfRestaurants!);

  console.log("RestaurantComponent render");
  return (
    <Box
      p={6}
      bg="white"
      boxShadow="sm"
      borderRadius="lg"
      maxW="900px"
      mx="auto"
      mt={8}
    >
      <div>There are {numberOfRestaurants} restaurants.</div>
      <Center>
        <Grid templateColumns="repeat(1, 1fr)" gap={6}>
          {restaurants.map((restaurant) => (
            <GridItem key={restaurant.addr}>
              <RestaurantLinkComponent restaurant={restaurant} />
            </GridItem>
          ))}
        </Grid>
      </Center>
    </Box>
  );
});
