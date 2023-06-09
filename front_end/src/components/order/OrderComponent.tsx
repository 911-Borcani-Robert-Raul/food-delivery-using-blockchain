import { useParams } from "react-router-dom";
import { getOrderStatusString, OrderStatus } from "../../domain/Order";
import { Review } from "../../domain/Review";
import { useGetOrder, useIncreaseDeliveryFee } from "../../hooks/OrderHooks";
import { useGetOrderReview, usePlaceReview } from "../../hooks/ReviewHooks";
import { useGetContractAddress } from "../Main";
import { CreateReviewComponent } from "../review/CreateReviewComponent";
import { Box, Button, FormLabel, Input, Text } from "@chakra-ui/react";
import { useEthers } from "@usedapp/core";
import { useEffect, useState } from "react";

interface Props {}

export function OrderComponent(_: Props) {
  const contractAddr = useGetContractAddress();
  const { orderIdString } = useParams();
  const orderId = parseInt(orderIdString!);
  const order = useGetOrder(contractAddr, orderId);
  const review = useGetOrderReview(contractAddr, orderId);
  const { state: placeReviewState, placeReview } = usePlaceReview(contractAddr);
  const { account } = useEthers();
  const canGiveReview =
    order?.clinetAddr === account &&
    order?.orderStatus === OrderStatus.DELIVERED;
  const canIncreaseDeliveryFee =
    order?.clinetAddr === account &&
    order?.orderStatus === OrderStatus.WAITING_COURIER;
  const [deliveryFee, setDeliveryFee] = useState(0);
  const { state: increaseDeliveryFeeState, increaseFee } =
    useIncreaseDeliveryFee(contractAddr);
  const [progressPlaceReview, setProgressPlaceReview] = useState("");
  const [progressIncreaseFee, setProgressIncreaseFee] = useState("");

  async function sendReview(review: Review) {
    review.orderId = order?.orderId;
    await placeReview(review);
  }

  async function onClick_IncreaseDeliveryFee() {
    await increaseFee(orderId, deliveryFee);
  }

  useEffect(() => {
    if (placeReviewState.status === "Success") {
      setProgressPlaceReview("Success!");
    } else if (placeReviewState.status === "Exception") {
      setProgressPlaceReview("Error: " + placeReviewState.errorMessage);
    } else if (placeReviewState.status === "Mining") {
      setProgressPlaceReview("Processing...");
    } else {
      setProgressPlaceReview("");
    }
  }, [placeReviewState]);

  useEffect(() => {
    if (increaseDeliveryFeeState.status === "Success") {
      setProgressIncreaseFee("Success!");
    } else if (increaseDeliveryFeeState.status === "Exception") {
      setProgressIncreaseFee("Error: " + increaseDeliveryFeeState.errorMessage);
    } else if (increaseDeliveryFeeState.status === "Mining") {
      setProgressIncreaseFee("Processing...");
    } else {
      setProgressIncreaseFee("");
    }
  }, [increaseDeliveryFeeState]);

  return (
    <Box display="flex" flexDirection="column" alignItems="center" pt={4}>
      {order && (
        <Box>
          <Text fontSize="xl" fontWeight="bold">
            {order.restaurantName}
          </Text>
          <Text>{order.restaurantPhysicalAddress}</Text>
          <Text fontSize="sm">{order.restaurantAddr}</Text>
          <Text>{order.deliveryAddress}</Text>

          {order?.items?.map((item, index) => (
            <div key={`OrderItem:${index}`}>
              {order?.quantities![index].toString()} x {item.toString()}
            </div>
          ))}

          <Text>
            Delivery fee: {(order?.deliveryFee! / 10 ** 18).toFixed(5)} Ethereum
          </Text>

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

          {!review && canGiveReview && (
            <Box mt={2}>
              <Text fontSize="lg" fontWeight="bold">
                Give a review for this order!
              </Text>
              <CreateReviewComponent onSubmit={sendReview} />
              {progressPlaceReview && <p>{progressPlaceReview}</p>}
            </Box>
          )}

          {canIncreaseDeliveryFee && (
            <Box mt={2}>
              <FormLabel>Increase delivery Fee:</FormLabel>
              <Input
                type="number"
                value={deliveryFee}
                onChange={(e) => setDeliveryFee(parseInt(e.target.value))}
              />
              <Button colorScheme="teal" onClick={onClick_IncreaseDeliveryFee}>
                Increase fee
              </Button>
              {progressIncreaseFee && <p>{progressIncreaseFee}</p>}
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}
