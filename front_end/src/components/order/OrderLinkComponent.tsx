import { Link } from "react-router-dom";
import { Order } from "../../domain/Order";

interface Props {
  order: Order;
}

export function OrderLinkComponent({ order }: Props) {
  return (
    <div>
      <h1>{order.restaurantAddr}</h1>
      <p>Address: {order.deliveryAddress}</p>
      <p>Delivery fee: {order.deliveryFee.toString()}</p>
      <Link to={`/order/${order.orderId}`}>See details</Link>
    </div>
  );
}
