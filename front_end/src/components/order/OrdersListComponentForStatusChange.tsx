import { getOrderStatusString, Order, OrderStatus } from "../../domain/Order";
import { useChangeOrderStatus } from "../../hooks/OrderHooks";
import { OrderLinkComponent } from "./OrderLinkComponent";

interface Props {
  contractAddress: string;
  ordersList: Order[];
  newStatus: OrderStatus;
  statusChangeActionName: string;
}

export function OrdersListComponentForStatusChange({
  contractAddress,
  ordersList,
  newStatus,
  statusChangeActionName,
}: Props) {
  const { state, changeStatus } = useChangeOrderStatus(
    contractAddress,
    newStatus
  );

  async function onClick_modifyOrderStatus(orderId: number) {
    await changeStatus(orderId);
  }

  return (
    <div>
      <div>You have {ordersList.length} orders.</div>
      <div>
        {ordersList.map((order) => (
          <div key={`Order:${order.orderId}`}>
            <OrderLinkComponent order={order} />
            {order!.items?.map((item) => (
              <div key={`Item:${item}`}>{item.toString()}</div>
            ))}
            {order!.quantities?.map((quantity, index) => (
              <div key={`Quantity:${index}`}>{quantity.toString()}</div>
            ))}
            <div>
              <button onClick={() => onClick_modifyOrderStatus(order.orderId!)}>
                {statusChangeActionName}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
