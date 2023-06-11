import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Restaurant } from "../../domain/Restaurant";
import { useRegisterRestaurant } from "../../hooks/RestaurantHooks";

interface RestaurantFormProps {
  contractAddress: string;
}

export function RegisterRestaurantComponent({
  contractAddress,
}: RestaurantFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [physicalAddress, setPhysicalAddress] = useState("");
  const [progress, setProgress] = useState("");
  const { state, registerRestaurant } = useRegisterRestaurant(contractAddress);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newRestaurant = new Restaurant(
      undefined,
      name,
      description,
      physicalAddress,
      undefined
    );

    await registerRestaurant(newRestaurant);
  };

  useEffect(() => {
    if (state.status === "Success") {
      setProgress("Restaurant has been registered!");
    } else if (state.status === "Exception") {
      setProgress("Error registering restaurant: " + state.errorMessage);
    } else if (state.status === "Mining") {
      setProgress("Registering restaurant...");
    } else {
      setProgress("");
    }
  }, [state]);

  return (
    <Box maxW="sm" mx="auto" p={6}>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          <FormControl id="name" isRequired>
            <FormLabel>Name:</FormLabel>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <FormErrorMessage>Enter a name for the restaurant</FormErrorMessage>
          </FormControl>

          <FormControl id="description" isRequired>
            <FormLabel>Description:</FormLabel>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <FormErrorMessage>
              Enter a description for the restaurant
            </FormErrorMessage>
          </FormControl>

          <FormControl id="physicalAddress" isRequired>
            <FormLabel>Physical Address:</FormLabel>
            <Input
              type="text"
              value={physicalAddress}
              onChange={(e) => setPhysicalAddress(e.target.value)}
            />
            <FormErrorMessage>
              Enter a physical address for the restaurant
            </FormErrorMessage>
          </FormControl>

          <Button type="submit">Add Restaurant</Button>

          {progress && <p>{progress}</p>}
        </VStack>
      </form>
    </Box>
  );
}
