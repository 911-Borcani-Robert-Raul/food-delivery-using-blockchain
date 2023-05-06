import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { Contract } from "ethers";
import { useEffect, useState } from "react";
import { alchemyGoerliProvider } from "../../App";
import { Item } from "../../domain/Item";
import abi from "../../chain-info/contracts/FoodDelivery.json";
import {
  useDisableItem,
  useEnableItem,
  useUpdateItem,
} from "../../hooks/ItemHooks";

interface ItemComponentProps {
  contractAddress: string;
  restaurantAddress: string;
  item: Item;
}

export function ItemManagementComponent({
  contractAddress,
  restaurantAddress,
  item,
}: ItemComponentProps) {
  const [name, setName] = useState(item.name);
  const [description, setDescription] = useState(item.description);
  const [price, setPrice] = useState(item.price);
  const [progress, setProgress] = useState("");
  const { state, updateItem } = useUpdateItem(contractAddress);
  const { state: enableState, enableItem } = useEnableItem(contractAddress);
  const { state: disableState, disableItem } = useDisableItem(contractAddress);
  const [enableTransactionStatus, setEnableTransactionStatus] = useState("");
  const [disableTransactionStatus, setDisableTransactionStatus] = useState("");

  useEffect(() => {
    if (enableState.status === "Success") {
      setEnableTransactionStatus("Enable request has completed successfully!");
    } else if (enableState.status === "Exception") {
      setEnableTransactionStatus(
        "Error enabling item: " + enableState.errorMessage
      );
    } else if (enableState.status === "Mining") {
      setEnableTransactionStatus("Enable request is being processed...");
    } else {
      setEnableTransactionStatus("");
    }
  }, [enableState]);

  useEffect(() => {
    if (disableState.status === "Success") {
      setDisableTransactionStatus(
        "Disable request has completed successfully!"
      );
    } else if (disableState.status === "Exception") {
      setDisableTransactionStatus(
        "Error disabing item: " + disableState.errorMessage
      );
    } else if (disableState.status === "Mining") {
      setDisableTransactionStatus("Disabling request is being processed...");
    } else {
      setDisableTransactionStatus("");
    }
  }, [disableState]);

  async function onClick_enableItem() {
    await enableItem(item.id!);
  }

  async function onClick_disableItem() {
    await disableItem(item.id!);
  }

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    const updatedItem = new Item(
      item.id,
      name,
      description,
      price,
      item.available
    );
    updateItem(updatedItem);
  };

  useEffect(() => {
    if (state.status === "Success") {
      setProgress("Update has been completed successfully!");
    } else if (state.status === "Exception") {
      setProgress("Error updating: " + state.errorMessage);
    } else if (state.status === "Mining") {
      setProgress("Updating is being processed...");
    } else {
      setProgress("");
    }
  }, [state]);

  return (
    <Box p={4} bg="white" borderRadius={5} boxShadow="md" mb={4}>
      <FormControl onSubmit={handleSubmit}>
        <FormLabel>Name:</FormLabel>
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          mb={2}
        />
        <FormLabel>Description:</FormLabel>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          mb={2}
        />
        <FormLabel>Price:</FormLabel>
        <Input
          type="number"
          value={price}
          onChange={(e) => setPrice(parseFloat(e.target.value))}
          mb={2}
        />
        <Button type="submit" colorScheme="blue" size="sm">
          Update
        </Button>
      </FormControl>
      {progress && (
        <Text fontWeight="bold" color="green.500" mt={2}>
          {progress}
        </Text>
      )}

      {item.available && (
        <Box mt={4}>
          <Button
            onClick={onClick_disableItem}
            colorScheme="red"
            size="sm"
            mr={2}
          >
            Disable item
          </Button>
          <Text fontWeight="bold" color="red.500" display="inline">
            {disableTransactionStatus}
          </Text>
        </Box>
      )}

      {!item.available && (
        <Box mt={4}>
          <Button
            onClick={onClick_enableItem}
            colorScheme="green"
            size="sm"
            mr={2}
          >
            Enable item
          </Button>
          <Text fontWeight="bold" color="green.500" display="inline">
            {enableTransactionStatus}
          </Text>
        </Box>
      )}
    </Box>
  );
}
