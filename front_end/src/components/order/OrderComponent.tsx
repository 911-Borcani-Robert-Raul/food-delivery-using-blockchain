import { useParams } from "react-router-dom";
import { getOrderStatusString, OrderStatus } from "../../domain/Order";
import { Review } from "../../domain/Review";
import { useGetOrder } from "../../hooks/OrderHooks";
import { useGetOrderReview, usePlaceReview } from "../../hooks/ReviewHooks";
import { useGetContractAddress } from "../Main";
import { CreateReviewComponent } from "../review/CreateReviewComponent";
import { Box, Button, Text } from "@chakra-ui/react";

interface Props {}

export function OrderComponent(props: Props) {
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
    <Box display="flex" flexDirection="column" alignItems="center" pt={4}>
      {order && (
        <Box>
          <Text fontSize="xl" fontWeight="bold">
            {order.restaurantAddr}
          </Text>
          <Text>{order.deliveryAddress}</Text>

          {order?.items?.map((item, index) => (
            <div key={`OrderItem:${index}`}>
              {order?.quantities![index].toString()} x {item.toString()}
            </div>
          ))}

          <Text>Order status: {getOrderStatusString(order.orderStatus)}</Text>

          {review && (
            <Box mt={2}>
              <Text fontSize="lg" fontWeight="bold">
                Review
              </Text>
              <Text>Rating: {review.rating}</Text>
              <Text>
                <strong>Comment:</strong> {review.comment}
              </Text>
            </Box>
          )}

          {!review && (
            <Box mt={2}>
              <Text fontSize="lg" fontWeight="bold">
                Give a review for this order!
              </Text>
              <CreateReviewComponent onSubmit={sendReview} />
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}
