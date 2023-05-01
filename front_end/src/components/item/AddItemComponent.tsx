import { Contract } from "ethers";
import { useEffect, useState } from "react";
import { alchemyGoerliProvider } from "../../App";
import { Item } from "../../domain/Item";
import abi from "../../chain-info/contracts/FoodDelivery.json";
import { useAddItem, useUpdateItem } from "../../hooks/ItemHooks";

interface ItemComponentProps {
  contractAddress: string;
  restaurantAddress: string;
}

export function AddItemComponent({
  contractAddress,
  restaurantAddress,
}: ItemComponentProps) {
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
        <button type="submit">Add</button>
      </form>
      {progress && <p>{progress}</p>}
    </div>
  );
}
