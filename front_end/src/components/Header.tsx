import {
  Box,
  Button,
  Flex,
  Link as ChakraLink,
  Spacer,
} from "@chakra-ui/react";
import { useEthers } from "@usedapp/core";
import { Link as RouterLink } from "react-router-dom";

export const Header = () => {
  const { account, activateBrowserWallet, deactivate } = useEthers();
  const isConnected = account !== undefined;

  return (
    <Flex
      as="nav"
      padding={4}
      bg="gray.100"
      color="gray.700"
      alignItems="center"
    >
      <Flex alignItems="center" justifyContent="space-between" gap={4}>
        <ChakraLink as={RouterLink} to="/" fontWeight="semibold">
          Home
        </ChakraLink>
        <ChakraLink as={RouterLink} to="/shoppingCart" fontWeight="semibold">
          Shopping Cart
        </ChakraLink>
        <ChakraLink as={RouterLink} to="/orders" fontWeight="semibold">
          Orders
        </ChakraLink>
        <ChakraLink
          as={RouterLink}
          to="/restaurant/manage"
          fontWeight="semibold"
        >
          Manage restaurant
        </ChakraLink>
        <ChakraLink as={RouterLink} to="/courier" fontWeight="semibold">
          Courier section
        </ChakraLink>
      </Flex>
      <Spacer />
      <Box>
        {isConnected ? (
          <Button colorScheme="teal" variant="solid" onClick={deactivate}>
            Disconnect
          </Button>
        ) : (
          <Button
            colorScheme="teal"
            variant="solid"
            onClick={activateBrowserWallet}
          >
            Connect
          </Button>
        )}
      </Box>
    </Flex>
  );
};
