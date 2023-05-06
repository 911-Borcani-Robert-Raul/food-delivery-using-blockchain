import { Box, Heading, Text, VStack } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { useGetNumberOfItemsInMenu } from "../../hooks/ItemHooks";
import { useGetRestaurant } from "../../hooks/RestaurantHooks";
import { ItemsListComponent } from "../item/ItemsListComponent";
import { useGetContractAddress } from "../Main";

export function RestaurantComponent() {
  const contractAddr = useGetContractAddress();
  const { restaurantAddr } = useParams();
  const restaurant = useGetRestaurant(contractAddr, restaurantAddr!);
  const numberOfItems = useGetNumberOfItemsInMenu(
    contractAddr,
    restaurantAddr!
  );

  return (
    <Box py={8} px={4} maxW="2xl" mx="auto">
      <VStack spacing={4} align="stretch">
        <Heading as="h1" size="xl" mb={4}>
          {restaurant?.name}
        </Heading>
        <Text fontSize="lg" color="gray.500" mb={4}>
          {restaurant?.description}
        </Text>
        <Box display="flex" alignItems="center" mb={4}>
          <Text fontSize="lg" mr={2}>
            {numberOfItems} items on the menu:
          </Text>
        </Box>
        <ItemsListComponent
          contractAddress={contractAddr}
          restaurantAddress={restaurantAddr!}
        />
      </VStack>
    </Box>
  );
}
