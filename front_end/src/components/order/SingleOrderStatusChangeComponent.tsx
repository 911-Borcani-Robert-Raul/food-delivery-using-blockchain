import { Box, Button, Input, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Order, OrderStatus } from "../../domain/Order";
import { useChangeOrderStatus } from "../../hooks/OrderHooks";
import { usePlaceReview } from "../../hooks/ReviewHooks";
import { useGetContractAddress } from "../Main";
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
    durationMinutes: number | undefined
  ) {
    await changeStatus(
      orderId,
      durationMinutes ? durationMinutes * 60 : undefined
    );
  }

  let durationMinutes: number | undefined = undefined;

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
      {order?.items?.map((item, index) => (
        <div key={`OrderItem:${index}`}>
          {order?.quantities![index].toString()} x {item.toString()}
        </div>
      ))}
      {allowTimeDuration && (
        <Input
          type="number"
          id={`duration_${order.orderId}`}
          min="0"
          placeholder="Minutes"
          onChange={(event) => {
            durationMinutes = parseInt(event.target.value, 10);
          }}
        />
      )}
      {!(
        newStatus === OrderStatus.CANCELLED &&
        (order.orderStatus === OrderStatus.CANCELLED ||
          order.orderStatus === OrderStatus.DELIVERED)
      ) && (
        <Box>
          <Button
            onClick={() =>
              onClick_modifyOrderStatus(order.orderId!, durationMinutes)
            }
          >
            {statusChangeActionName}
          </Button>
          {progress && <p>{progress}</p>}{" "}
        </Box>
      )}
    </VStack>
  );
}
