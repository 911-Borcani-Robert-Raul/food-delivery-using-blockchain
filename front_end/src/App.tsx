import { AlchemyProvider } from "@ethersproject/providers";
import { Container } from "@material-ui/core";
import { DAppProvider, Goerli } from "@usedapp/core";
import { getDefaultProvider } from "ethers";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { CourierComponent } from "./components/courier/CourierComponent";
import { Header } from "./components/Header";
import { Main } from "./components/Main";
import { OrderComponent } from "./components/order/OrderComponent";
import { RestaurantComponent } from "./components/restaurant/RestaurantComponent";
import { RestaurantManagementComponent } from "./components/restaurant/RestaurantManagementComponent";
import { ShoppingCartComponent } from "./components/shopping-cart/ShoppingCartComponent";
import { ChakraProvider } from "@chakra-ui/react";
import OrdersListComponent from "./components/order/OrdersListComponent";

const alchemyApiKey = "IkArG5DA0XETBZgRCCspcYfoRJndJtJn";
const alchemyUrl = `https://eth-mainnet.alchemyapi.io/v2/${alchemyApiKey}`;

export const alchemyGoerliProvider = new AlchemyProvider(
  "goerli",
  alchemyApiKey
);

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Container maxWidth="md">
        <Header />
        <Main />
      </Container>
    ),
  },
  {
    path: "/restaurant/:restaurantAddr",
    element: (
      <Container>
        <Header />
        <RestaurantComponent />{" "}
      </Container>
    ),
  },
  {
    path: "/restaurant/manage",
    element: (
      <Container>
        <Header />
        <RestaurantManagementComponent />{" "}
      </Container>
    ),
  },
  {
    path: "/order/:orderIdString",
    element: (
      <Container>
        <Header />
        <OrderComponent />{" "}
      </Container>
    ),
  },
  {
    path: "/shoppingCart",
    element: (
      <Container>
        <Header /> <ShoppingCartComponent />{" "}
      </Container>
    ),
  },
  {
    path: "/orders",
    element: (
      <Container>
        <Header /> <OrdersListComponent />{" "}
      </Container>
    ),
  },
  {
    path: "/courier",
    element: (
      <Container>
        <Header /> <CourierComponent />{" "}
      </Container>
    ),
  },
  {
    path: "/test",
    element: <div>Test</div>,
  },
]);

function App() {
  return (
    <ChakraProvider>
      <DAppProvider
        config={{
          readOnlyChainId: Goerli.chainId,
          readOnlyUrls: {
            [Goerli.chainId]: alchemyGoerliProvider,
            5777: getDefaultProvider("http://localhost:7545"),
          },
          refresh: "everyBlock",
        }}
      >
        <RouterProvider router={router} />
      </DAppProvider>
    </ChakraProvider>
  );
}

export default App;
