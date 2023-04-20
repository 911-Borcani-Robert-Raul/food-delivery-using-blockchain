import { Contract } from "ethers";
import { useEffect, useState } from "react";
import { alchemyGoerliProvider } from "../../App";
import { Item } from "../../domain/Item";
import abi from "../../chain-info/contracts/FoodDelivery.json";
import { useUpdateItem } from "../../hooks/ItemHooks";

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

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    const updatedItem = new Item(item.id, name, description, price);
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
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label>
          Description:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <label>
          Price:
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(parseFloat(e.target.value))}
          />
        </label>
        <button type="submit">Update</button>
      </form>
      {progress && <p>{progress}</p>}
    </div>
  );
}
