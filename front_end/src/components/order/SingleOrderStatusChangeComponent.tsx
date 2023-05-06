import { Button, Input, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOrderStatusString, Order, OrderStatus } from "../../domain/Order";
import { Review } from "../../domain/Review";
import { useChangeOrderStatus, useGetOrder } from "../../hooks/OrderHooks";
import { useGetOrderReview, usePlaceReview } from "../../hooks/ReviewHooks";
import { useGetContractAddress } from "../Main";
import { CreateReviewComponent } from "../review/CreateReviewComponent";
import { OrderLinkComponent } from "./OrderLinkComponent";

interface Props {
  contractAddress: string;
  newStatus: OrderStatus;
  order: Order;
  allowTimeDuration?: boolean;
  statusChangeActionName: string;
}

export function SingleOrderStatusChangeComponent({
  contractAddress,
  newStatus,
  order,
  allowTimeDuration,
  statusChangeActionName,
}: Props) {
  const [progress, setProgress] = useState("");
  const contractAddr = useGetContractAddress();
  const { state: placeReviewState, placeReview } = usePlaceReview(contractAddr);
  const { state, changeStatus } = useChangeOrderStatus(
    contractAddress,
    newStatus
  );

  async function onClick_modifyOrderStatus(
    orderId: number,
    durationSeconds: number | undefined
  ) {
    await changeStatus(orderId, durationSeconds);
  }

  let durationSeconds: number | undefined = undefined;

  useEffect(() => {
    if (state.status === "Success") {
      setProgress("Success!");
    } else if (state.status === "Exception") {
      setProgress("Error: " + state.errorMessage);
    } else if (state.status === "Mining") {
      setProgress("Processing...");
    } else {
      setProgress("");
    }
  }, [state]);

  return (
    <VStack
      className="container"
      spacing={4}
      p={8}
      border="1px solid"
      borderColor="gray.200"
      borderRadius="md"
    >
      <OrderLinkComponent order={order} />
      {order?.items?.map((item) => (
        <div key={`Item:${item}`}>{item.toString()}</div>
      ))}
      {order?.quantities?.map((quantity, index) => (
        <div key={`Quantity:${index}`}>{quantity.toString()}</div>
      ))}
      {allowTimeDuration && (
        <Input
          type="number"
          id={`duration_${order.orderId}`}
          min="0"
          placeholder="Seconds"
          onChange={(event) => {
            durationSeconds = parseInt(event.target.value, 10);
          }}
        />
      )}
      <Button
        onClick={() =>
          onClick_modifyOrderStatus(order.orderId!, durationSeconds)
        }
      >
        {statusChangeActionName}
      </Button>
      {progress && <p>{progress}</p>}
    </VStack>
  );
}
