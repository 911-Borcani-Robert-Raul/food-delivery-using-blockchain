import { Container } from "@material-ui/core";
import { ChainId, DAppProvider, Goerli, Mainnet } from "@usedapp/core";
import { getDefaultProvider } from "ethers";
import { Header } from "./components/Header";
import { Main } from "./components/Main";
import { AlchemyProvider } from "@ethersproject/providers";

const alchemyApiKey = "";
const alchemyUrl = `https://eth-mainnet.alchemyapi.io/v2/${alchemyApiKey}`;

export const alchemyGoerliProvider = new AlchemyProvider(
  "goerli",
  alchemyApiKey
);

function App() {
  return (
    <DAppProvider
      config={{
        readOnlyChainId: Goerli.chainId,
        readOnlyUrls: {
          [Goerli.chainId]: alchemyGoerliProvider,
          5777: getDefaultProvider("http://localhost:7545"),
        },
        notifications: {
          expirationPeriod: 1000,
          checkInterval: 1000,
        },
      }}
    >
      <Header></Header>
      <Container maxWidth="md">
        <Main />
      </Container>
    </DAppProvider>
  );
}

export default App;
