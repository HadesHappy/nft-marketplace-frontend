import { Box } from '@chakra-ui/layout';
import { Button, Flex } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { ReactComponent as ConnectImg } from './assets/images/icons/connect.svg';
import Loading from './components/Loader';
import Routings from './routing';
import WrongNetworkModal from './ui-kit/WrongNetworkModal/index';
import { chainId } from './utils/constants/variables';
import UserContext from './utils/contexts/User';
import { createContract, getActiveAccount, getEthBalance, initWeb3, metamaskEnabled } from './utils/web3Utils';

const App = () => {
  const [loading, setLoading] = useState(true);
  const [contract, setContract] = useState(null);
  const [connectNetwork, setConnectNetwork] = useState(true);

  const getData = React.useCallback(async () => {
    const contract = await createContract();
    setContract(contract);
    const address = await getActiveAccount();
    if (address) {
      const ethBalance = await getEthBalance(address);
      setAccount({
        address,
        ethBalance,
        updateUserData: async () => getData(),
        setAccount: setAccount,
      });
    }
  }, []);

  const [account, setAccount] = useState({
    address: null,
    ethBalance: 0,
    updateUserData: null,
  });

  const listenMMAccount = React.useCallback(async () => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', async () => getData());
      window.ethereum.on('chainChanged', async () => {
        getData();
        checkNetwork();
      });
    }
  }, [getData]);

  const checkNetwork = () => {
    if (window.ethereum && window.ethereum.chainId) {
      setConnectNetwork(window.ethereum.chainId === chainId);
    }
  };

  useEffect(() => {
    checkNetwork();
  }, [window.ethereum]);

  useEffect(() => {
    setLoading(true);
    getData();
    listenMMAccount();
    initWeb3().then((result) => {
      if (result) {
        checkNetwork();
      }
    });
    setLoading(false);
  }, []);

  return (
    <>
      {!loading ? (
        <UserContext.Provider value={{ account, contract }}>
          {<WrongNetworkModal isOpen={!connectNetwork} />}
          <Routings />
        </UserContext.Provider>
      ) : (
        <>
          <Box display="flex" justifyContent="center" pt={12} flexDirection="column">
            <Loading />
            {!loading && !account.address && (
              <Flex justifyContent="center" pt={4}>
                <Button
                  leftIcon={<ConnectImg />}
                  variant="outline"
                  colorScheme="black"
                  color="teal.200"
                  onClick={metamaskEnabled}
                >
                  Connect to wallet
                </Button>
              </Flex>
            )}
          </Box>
        </>
      )}
    </>
  );
};

export default App;
