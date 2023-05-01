import { useParams } from "react-router-dom";
import { getOrderStatusString, OrderStatus } from "../../domain/Order";
import { Review } from "../../domain/Review";
import { useGetOrder } from "../../hooks/OrderHooks";
import { useGetOrderReview, usePlaceReview } from "../../hooks/ReviewHooks";
import { useGetContractAddress } from "../Main";
import { CreateReviewComponent } from "../review/CreateReviewComponent";

export function OrderComponent() {
  const contractAddr = useGetContractAddress();
  const { orderIdString } = useParams();
  const orderId = parseInt(orderIdString!);
  const order = useGetOrder(contractAddr, orderId);
  const review = useGetOrderReview(contractAddr, orderId);
  const { state: placeReviewState, placeReview } = usePlaceReview(contractAddr);

  async function sendReview(review: Review) {
    review.orderId = order?.orderId;
    await placeReview(review);
  }

  return (
    <div>
      {order && (
        <div>
          <div>{order.restaurantAddr}</div>
          <div>{order.deliveryAddress}</div>
          <div>{order.orderStatus}</div>

          <div>Order status: {getOrderStatusString(order.orderStatus)}</div>

          {review && (
            <div>
              <h2>Review</h2>
              <div>Rating {review.rating}</div>
              <div>
                <h4>Comment</h4>
                {review.comment}
              </div>
            </div>
          )}

          {!review && (
            <div>
              <h2>Give a review for this order!</h2>
              <CreateReviewComponent onSubmit={sendReview} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
