import { Link } from "react-router-dom";
import { Restaurant } from "../../domain/Restaurant";

interface Props {
  restaurant: Restaurant;
}

export function RestaurantLinkComponent({ restaurant }: Props) {
  return (
    <div>
      <h1>{restaurant.name}</h1>
      <p>{restaurant.addr}</p>
      <p>{restaurant.description}</p>
      <Link to={`restaurant/${restaurant.addr}`}>Order</Link>
    </div>
  );
}
