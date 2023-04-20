import { useParams } from "react-router-dom";
import { OrderStatus } from "../../domain/Order";
import { useGetOrder } from "../../hooks/OrderHooks";
import { useGetOrderReview } from "../../hooks/ReviewHooks";
import { useGetContractAddress } from "../Main";

export function OrderComponent() {
  const contractAddr = useGetContractAddress();
  const { orderIdString } = useParams();
  const orderId = parseInt(orderIdString!);
  const order = useGetOrder(contractAddr, orderId);
  const review = useGetOrderReview(contractAddr, orderId);

  async function onClick_Confirm() {
    console.log("Confirming order...");
  }

  return (
    <div>
      {order && (
        <div>
          <div>{order.restaurantAddr}</div>
          <div>{order.deliveryAddress}</div>
          <div>{order.orderStatus}</div>

          {order.orderStatus == OrderStatus.PENDING && (
            <div>
              <button onClick={onClick_Confirm}>Confirm order</button>
            </div>
          )}

          {review && (
            <div>
              <h2>Review</h2>
              <div>Rating {review.rating}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
