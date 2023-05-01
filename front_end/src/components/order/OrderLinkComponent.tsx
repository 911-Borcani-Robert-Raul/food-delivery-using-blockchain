import { Link } from "react-router-dom";
import { getOrderStatusString, Order } from "../../domain/Order";

interface Props {
  order: Order;
}

export function OrderLinkComponent({ order }: Props) {
  return (
    <div>
      <p>{order.restaurantAddr}</p>
      <p>Address: {order.deliveryAddress}</p>
      <p>Delivery fee: {order.deliveryFee.toString()}</p>
      <div>Order status: {getOrderStatusString(order.orderStatus)}</div>
      <Link key={`Link${order.orderId}`} to={`/order/${order.orderId}`}>
        See details
      </Link>
    </div>
  );
}
