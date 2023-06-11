import { Box, Button, Heading, Stack, Text } from "@chakra-ui/react";
import { useEthers } from "@usedapp/core";
import { useState } from "react";
import { useGetRestaurant } from "../../hooks/RestaurantHooks";
import { useGetContractAddress } from "../Main";
import { ItemsListManagementComponent } from "../item/ItemsListManagementComponent";
import { RegisterRestaurantComponent } from "./RegisterRestaurantForm";
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
    <Box py={8} px={4} maxW="2xl" mx="auto">
      {restaurant === undefined && (
        <Box>
          <Heading as="h2" size="md" mb={4}>
            Register restaurant
          </Heading>
          <RegisterRestaurantComponent contractAddress={contractAddr} />
        </Box>
      )}

      {restaurant && (
        <Stack spacing={8}>
          <Box>
            <Heading as="h1" size="xl">
              {restaurant.name}
            </Heading>
            <Text mb={2}>{restaurant.addr}</Text>
            <Text mb={4}>{restaurant.description}</Text>
            <Button onClick={handleShowItems}>
              {showItems ? "Hide Items" : "Show Items"}
            </Button>
            {showItems && (
              <ItemsListManagementComponent
                contractAddress={contractAddr}
                restaurantAddress={restaurantAddress!}
              />
            )}
          </Box>
          <Box>
            <RestaurantOrdersComponent />
          </Box>
        </Stack>
      )}
    </Box>
  );
}
