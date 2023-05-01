import { Item } from "../../domain/Item";
import { Restaurant } from "../../domain/Restaurant";
import { addToCart } from "../../shopping-cart/ShoppingCart";

interface ItemComponentProps {
  restaurantAddress: string;
  item: Item;
}

export function ItemComponent({ restaurantAddress, item }: ItemComponentProps) {
  return (
    <div>
      <h2>
        {item.id!.toString()}.{item.name}
      </h2>
      <p>{item.description}</p>
      <p>Price: {item.price.toString()}</p>

      <button onClick={() => addToCart(restaurantAddress, item, 1)}>
        Add to cart
      </button>
    </div>
  );
}
