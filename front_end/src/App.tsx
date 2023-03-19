import { Container } from '@material-ui/core';
import { ChainId, DAppProvider, Goerli, Mainnet } from '@usedapp/core';
import { getDefaultProvider } from 'ethers';
import { Header } from './components/Header';
import { Main } from './components/Main';

function App() {
  return (
    <DAppProvider config={{
      readOnlyChainId: Goerli.chainId,
      readOnlyUrls: {
        [Goerli.chainId]: getDefaultProvider('goerli'),
      },
      notifications: {
      expirationPeriod: 1000,
      checkInterval: 1000
  }
    }}>
      <Header></Header>
      <Container maxWidth="md">
        <Main/> 
      </Container>
    </DAppProvider>
  );
}

export default App;
