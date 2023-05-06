import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { Contract } from "ethers";
import { useEffect, useState } from "react";
import { alchemyGoerliProvider } from "../../App";
import { Item } from "../../domain/Item";
import abi from "../../chain-info/contracts/FoodDelivery.json";
import { useAddItem } from "../../hooks/ItemHooks";

interface AddItemComponentProps {
  contractAddress: string;
  restaurantAddress: string;
}

export function AddItemComponent({
  contractAddress,
  restaurantAddress,
}: AddItemComponentProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [progress, setProgress] = useState("");
  const { state, addItem } = useAddItem(contractAddress);

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    const newItem = new Item(undefined, name, description, price, true);
    addItem(newItem);
  };

  useEffect(() => {
    if (state.status === "Success") {
      setProgress("Item has been added!");
    } else if (state.status === "Exception") {
      setProgress("Error adding item: " + state.errorMessage);
    } else if (state.status === "Mining") {
      setProgress("Adding item is being processed...");
    } else {
      setProgress("");
    }
  }, [state]);

  return (
    <Box>
      <form onSubmit={handleSubmit}>
        <FormControl mb="3">
          <FormLabel>Name:</FormLabel>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </FormControl>
        <FormControl mb="3">
          <FormLabel>Description:</FormLabel>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </FormControl>
        <FormControl mb="3">
          <FormLabel>Price:</FormLabel>
          <Input
            type="number"
            value={price}
            onChange={(e) => setPrice(parseFloat(e.target.value))}
          />
        </FormControl>
        <Button colorScheme="teal" type="submit" mb="3">
          Add
        </Button>
      </form>
      {progress && <Text>{progress}</Text>}
    </Box>
  );
}
