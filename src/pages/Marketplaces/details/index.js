import { AddIcon } from '@chakra-ui/icons';
import { Box } from '@chakra-ui/layout';
import { Avatar, Button, chakra, Flex, Spacer, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router';
import AvatarSrc from '../../../assets/images/logo.png';
import CollectionList from '../../../components/CollectionList/index';
import NFTFilter from '../../../components/HeaderTokenList/filter';
import TokenList from '../../../components/TokenList/index';
import TopCollections from '../../../components/Trending/TrendingCollections';
import TopNFTs from '../../../components/Trending/TrendingNFTs';
import * as RoutePaths from '../../../utils/constants/routings';
import { marketplaceContractAddress } from '../../../utils/constants/variables';
import UserContext from '../../../utils/contexts/User';
import useTokenList from '../../../utils/hooks/useTokenList';
import { InfoWrapper } from '../../NFT/styled-ui';
import MarketplaceHeader from '../components/header/index';
import '../slider/css/style.css';
import { Description, Title } from '../styled-ui';

const MarketplaceDetails = () => {
  let history = useHistory();
  const location = useLocation();
  const { address } = useParams();
  const data = React.useContext(UserContext);
  const [query, setQuery] = useState('');
  const [nftType, setNftType] = useState('');
  const [pageNumber, setPageNumber] = useState(1);

  const handleSortMenu = async (value) => {
    setQuery(value);
    setPageNumber(1);
  };

  const handleTab = (type) => {
    setTokens([]);
    setPageNumber(1);
    setNftType(type);
    handleSortMenu('');
    history.push({
      pathname: `${RoutePaths.HOME}`,
      state: {
        tab: type,
      },
    });
  };

  const { tokens, hasMore, loading, error, setTokens } = useTokenList({ query, pageNumber, nftType, handleTab });

  React.useEffect(() => {
    handleTab('nfts');
  }, []);

  const activeTabCollections = location.state && location.state.tab === 'collections';
  const activeTabNfts = location.state && location.state.tab === 'nfts';

  return (
    <>
      <Box position="relative">
        <MarketplaceHeader />
        <Box
          maxW="1536"
          p={10}
          margin="0 auto"
          position="absolute"
          left={0}
          right={0}
          bottom={{ sm: -340, md: -240, lg: -120 }}
          top={{ base: 300, lg: 220 }}
          flexDir="column"
        >
          <Box display="flex" flexFlow="row wrap" gridGap={6}>
            <Flex flex={{ base: 1, md: 'auto', lg: 1 }} order={{ sm: 1, md: 1, lg: 2 }}>
              <InfoWrapper>
                <Avatar backgroundColor="transparent" loading="lazy" size="xl" src={AvatarSrc} />
                <Box ml="3">
                  <Title>Moon Rabbit NFT Marketplace</Title>
                  <chakra.span colorScheme="gray.500" color="teal.200" fontWeight="bold">
                    <Description>{marketplaceContractAddress}</Description>
                  </chakra.span>

                  <Flex
                    flexWrap="wrap"
                    gridRowGap={1}
                    pt={3}
                    justifyContent={{ base: 'center', md: 'start', lg: 'start' }}
                  >
                    {window.ethereum && data.account.address && (
                      <Button
                        leftIcon={<AddIcon />}
                        variant="outline"
                        colorScheme="black"
                        color="teal.200"
                        size="sm"
                        onClick={() => history.push(`${RoutePaths.CREATE_NFT}`)}
                      >
                        Create NFT
                      </Button>
                    )}
                  </Flex>
                </Box>
              </InfoWrapper>
            </Flex>
          </Box>
        </Box>
      </Box>

      {location.state && location.state.tab === nftType && (
        <Box pt={{ base: 240, sm: 340, md: 240, lg: 120 }}>
          <Box minH={'300px'} maxW="1536" margin="0 auto" pr={10} pl={10} pb={150}>
            <TopNFTs />
            <Spacer height={10}></Spacer>
            <TopCollections />
            <Spacer height={10}></Spacer>
            <Flex justifyContent="space-between" alignItems="center" height="50px">
              <Flex gridGap={4} pr={4}>
                <Box onClick={() => handleTab('nfts')} cursor="pointer">
                  <Text
                    color={activeTabNfts ? 'teal.300' : 'white'}
                    fontSize={{ base: '18px', lg: '32px' }}
                    fontWeight="bold"
                    decoration={activeTabNfts ? 'underline' : 'none'}
                    textUnderlineOffset={'6px'}
                    textDecorationThickness="5px"
                  >
                    All NFTs{' '}
                  </Text>
                </Box>
                <Box>
                  <Text fontSize={{ base: '18px', lg: '32px' }} fontWeight="bold" color="white">
                    /
                  </Text>
                </Box>
                <Box onClick={() => handleTab('collections')} cursor="pointer">
                  <Text
                    color={activeTabCollections ? 'teal.300' : 'white'}
                    decoration={activeTabCollections ? 'underline' : 'none'}
                    textUnderlineOffset={'6px'}
                    textDecorationThickness="5px"
                    fontSize={{ base: '18px', lg: '32px' }}
                    fontWeight="bold"
                  >
                    All Collections
                  </Text>
                </Box>
              </Flex>
              {location.state && location.state.tab !== 'collections' && (
                <NFTFilter handleSort={handleSortMenu} isHomePage={true} />
              )}
            </Flex>
            {location.state && (location.state.tab === 'nfts' || location.state.page === 'home') && (
              <TokenList
                tokens={tokens}
                handleSort={handleSortMenu}
                loading={loading}
                setPageNumber={setPageNumber}
                hasMore={hasMore}
                address={address}
                error={error}
                headerVisability={false}
              />
            )}

            {location.state && location.state.tab === 'collections' && location.state.page !== 'home' && (
              <CollectionList collections={tokens} hasMore={hasMore} loading={loading} setPageNumber={setPageNumber} />
            )}
          </Box>
        </Box>
      )}
    </>
  );
};

export default MarketplaceDetails;
