import { constants } from "ethers";
import { useEffect, useState } from "react";
import { Order, OrderStatus } from "../../domain/Order";
import { usePlaceOrder } from "../../hooks/OrderHooks";
import {
  CartState,
  clearShoppingCart,
  getCartState,
} from "../../shopping-cart/ShoppingCart";
import { useGetContractAddress } from "../Main";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";

export function ShoppingCartComponent() {
  const [cartState, setCartState] = useState<CartState>({
    restaurantAddr: constants.AddressZero,
    clientAddress: constants.AddressZero,
    items: [],
    quantities: {},
  });

  const [transactionStatus, setTransactionStatus] = useState("");

  useEffect(() => {
    setCartState(getCartState());
  }, []);

  let totalPrice = 0;
  cartState.items.forEach((item) => {
    totalPrice += item.price * cartState.quantities[item.id!];
  });
  const [address, setAddress] = useState("");
  const [deliveryFee, setDeliveryFee] = useState(0);
  const contractAddress = useGetContractAddress();

  const { state, placeOrder } = usePlaceOrder(
    contractAddress,
    new Order(
      undefined,
      cartState.restaurantAddr,
      cartState.clientAddress,
      cartState.items.map((item) => item.id!),
      Object.values(cartState.quantities),
      deliveryFee,
      address,
      OrderStatus.PENDING
    )
  );

  async function onClick_Order() {
    const itemIds: number[] = [];
    const itemQuantities: number[] = [];
    cartState.items.forEach((item) => {
      itemIds.push(item.id!);
      itemQuantities.push(cartState.quantities[item.id!]);
    });

    const order: Order = new Order(
      undefined,
      cartState.restaurantAddr,
      cartState.clientAddress,
      itemIds,
      itemQuantities,
      deliveryFee,
      address,
      OrderStatus.PENDING
    );

    await placeOrder(order);
  }

  useEffect(() => {
    if (state.status === "Success") {
      setTransactionStatus("Order has been placed successfully!");
    } else if (state.status === "Exception") {
      setTransactionStatus("Error placing order: " + state.errorMessage);
    } else if (state.status === "Mining") {
      setTransactionStatus("Order is being processed...");
    } else {
      setTransactionStatus("");
    }
  }, [state]);
  return (
    <Box
      p={6}
      bg="white"
      boxShadow="sm"
      borderRadius="lg"
      maxW="400px"
      mx="auto"
    >
      <Text fontSize="2xl" fontWeight="semibold" mb={4}>
        Shopping Cart
      </Text>
      {cartState.items.length === 0 ? (
        <Text>Your cart is empty</Text>
      ) : (
        <div>
          {cartState.items.map((item) => (
            <Box
              key={item.id}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              py={2}
              borderBottom="1px"
              borderColor="gray.300"
            >
              <Text fontWeight="semibold" fontSize="lg">
                {item.name} ({cartState.quantities[item.id!]})
              </Text>
              <Text fontSize="lg" color="gray.600">
                {typeof item.price === "number"
                  ? `$${item.price.toFixed(2)}`
                  : "N/A"}
              </Text>
            </Box>
          ))}
          <Text fontSize="xl" fontWeight="semibold" mt={4}>
            Total price is ${totalPrice.toFixed(2)}
          </Text>
          <VStack spacing={4} mt={6}>
            <FormControl id="address">
              <FormLabel>Address:</FormLabel>
              <Input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </FormControl>
            <FormControl id="delivery-fee">
              <FormLabel>Delivery Fee:</FormLabel>
              <Input
                type="number"
                value={deliveryFee}
                onChange={(e) => setDeliveryFee(parseInt(e.target.value))}
              />
            </FormControl>
            <Button colorScheme="teal" onClick={onClick_Order}>
              Order
            </Button>
            <Button
              variant="outline"
              colorScheme="teal"
              onClick={clearShoppingCart}
            >
              Clear shopping cart
            </Button>
          </VStack>
          {transactionStatus && (
            <Text mt={4} fontSize="md" color="gray.600">
              {transactionStatus}
            </Text>
          )}
        </div>
      )}
    </Box>
  );
}
