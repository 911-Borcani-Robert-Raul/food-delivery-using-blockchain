import { Restaurant } from "../domain/Restaurant";

interface Props {
  restaurant: Restaurant;
}

export function RestaurantComponent({ restaurant }: Props) {
  return (
    <div>
      <h1>{restaurant.name}</h1>
      <p>{restaurant.addr}</p>
      <p>{restaurant.description}</p>
    </div>
  );
}
