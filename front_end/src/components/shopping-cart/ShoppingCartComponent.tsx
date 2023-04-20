import { constants } from "ethers";
import { useEffect, useState } from "react";
import { Order, OrderStatus } from "../../domain/Order";
import { usePlaceOrder } from "../../hooks/OrderHooks";
import { CartState, getCartState } from "../../shopping-cart/ShoppingCart";
import { useGetContractAddress } from "../Main";

export function ShoppingCartComponent() {
  const [cartState, setCartState] = useState<CartState>({
    restaurantAddr: constants.AddressZero,
    items: [],
    quantities: {},
  });

  const [transactionStatus, setTransactionStatus] = useState("");

  useEffect(() => {
    setCartState(getCartState());
  }, []);

  let totalPrice = 0;
  cartState.items.forEach((item) => {
    totalPrice += item.price * cartState.quantities[item.id!];
  });
  const [address, setAddress] = useState("");
  const [deliveryFee, setDeliveryFee] = useState(0);
  const contractAddress = useGetContractAddress();

  const { state, placeOrder } = usePlaceOrder(contractAddress, {
    orderId: undefined,
    restaurantAddr: cartState.restaurantAddr,
    itemIds: cartState.items.map((item) => item.id!),
    quantities: Object.values(cartState.quantities),
    deliveryFee: deliveryFee,
    deliveryAddress: address,
    orderStatus: OrderStatus.PENDING,
  });

  async function onClick_Order() {
    const itemIds: number[] = [];
    const itemQuantities: number[] = [];
    cartState.items.forEach((item) => {
      itemIds.push(item.id!);
      itemQuantities.push(cartState.quantities[item.id!]);
    });

    const order: Order = new Order(
      undefined,
      cartState.restaurantAddr,
      itemIds,
      itemQuantities,
      deliveryFee,
      address,
      OrderStatus.PENDING
    );

    await placeOrder(order);
  }

  useEffect(() => {
    if (state.status === "Success") {
      setTransactionStatus("Order has been placed successfully!");
    } else if (state.status === "Exception") {
      setTransactionStatus("Error placing order: " + state.errorMessage);
    } else if (state.status === "Mining") {
      setTransactionStatus("Order is being processed...");
    } else {
      setTransactionStatus("");
    }
  }, [state]);

  return (
    <div>
      <h2>Shopping Cart</h2>
      {cartState.items.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div>
          <ul>
            {cartState.items.map((item) => (
              <li key={item.id}>
                {item.name} ({cartState.quantities[item.id!]}) - $
                {typeof item.price === "number"
                  ? `${item.price.toFixed(2)}`
                  : "N/A"}
              </li>
            ))}
          </ul>
          <div>Total price is {totalPrice.toFixed(2)}.</div>
          <form>
            <label htmlFor="address">Address:</label>
            <input
              id="address"
              title="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <br />
            <label htmlFor="delivery-fee">Delivery Fee:</label>
            <input
              id="delivery-fee"
              title="Delivery Fee"
              value={deliveryFee}
              onChange={(e) => setDeliveryFee(parseInt(e.target.value))}
              type="number"
            />
          </form>

          <button onClick={onClick_Order}>Order</button>

          <div>{transactionStatus}</div>
        </div>
      )}
    </div>
  );
}
