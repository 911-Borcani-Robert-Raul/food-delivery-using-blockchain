import { constants } from "ethers";
import { Item } from "../domain/Item";

export interface CartState {
  restaurantAddr: string;
  items: Item[];
  quantities: { [itemId: number]: number };
  clientAddress: string;
}

// Get the cart state from local storage
export function getCartState(): CartState {
  const storedState = localStorage.getItem("cart");

  if (storedState) {
    const result: CartState = JSON.parse(storedState);
    return result;
  } else {
    return {
      restaurantAddr: constants.AddressZero,
      clientAddress: constants.AddressZero,
      items: [],
      quantities: {},
    };
  }
}

// Save the cart state to local storage
export function saveCartState(state: CartState): void {
  localStorage.setItem("cart", JSON.stringify(state));
}

export function setRestaurantAddress(restaurantAddress: string): void {
  const cartState = getCartState();
  cartState.restaurantAddr = restaurantAddress;
  saveCartState(cartState);
}

export function clearShoppingCart(): void {
  const cartState = {
    restaurantAddr: constants.AddressZero,
    items: [],
    quantities: {},
    clientAddress: constants.AddressZero,
  };
  saveCartState(cartState);
}

// Add an item to the cart
export async function addToCart(
  clientAddress: string,
  restaurantAddress: string,
  item: Item,
  quantity: number
) {
  let cartState = getCartState();

  // Check if the restaurant was changed
  if (
    cartState.restaurantAddr !== restaurantAddress ||
    cartState.clientAddress !== clientAddress
  ) {
    clearShoppingCart();
    cartState = getCartState();
    cartState.restaurantAddr = restaurantAddress;
    cartState.clientAddress = clientAddress;
  }

  const { items, quantities } = cartState;

  // Check if the item is already in the cart
  const index = items.findIndex((i) => i.id === item.id);
  if (index !== -1) {
    console.log(`Adding to shopping cart existing item: ${item.id}...`);
    // Item is already in the cart, update the quantity
    quantities[item.id!] += quantity;
  } else {
    console.log(`Adding to shopping cart new item: ${item.id}...`);
    // Item is not in the cart, add it
    items.push(item);
    quantities[item.id!] = quantity;
  }

  // Save the updated cart state to local storage
  saveCartState(cartState);
}
