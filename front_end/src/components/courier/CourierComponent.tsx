import React from "react";
import { OrdersReadyToDeliverListComponent } from "./OrdersReadyToDeliverListComponent";
import { WaitingForCourierOrderListComponent } from "./WaitingForCourierOrderListComponent";

export const CourierComponent = React.memo(() => {
  return (
    <div>
      <h2>Orders waiting for couriers</h2>
      <WaitingForCourierOrderListComponent />

      <h2>Orders waiting to be delivered</h2>
      <OrdersReadyToDeliverListComponent />
    </div>
  );
});
