import { Avatar, Badge, Box, Flex, Heading, Stat, StatLabel, StatNumber, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router';
import CollectionList from '../../components/CollectionList';
import NFTFilter from '../../components/HeaderTokenList/filter';
import TokenList from '../../components/TokenList/index';
import * as RoutePaths from '../../utils/constants/routings';
import UserContext from '../../utils/contexts/User';
import { shortAddress } from '../../utils/helper';
import useTokenProfileList from '../../utils/hooks/useTokenProfileList';
import { InfoWrapper, StatWrapper } from '../NFT/styled-ui';

const ProfilePage = () => {
  let history = useHistory();
  const location = useLocation();
  const { address } = useParams();
  const data = React.useContext(UserContext);
  const [pageNumber, setPageNumber] = useState(1);
  const [query, setQuery] = useState('');
  const resetPage = () => setPageNumber(1);

  const isOwner = address === data.account.address;
  const [nftType, setNftType] = useState('');

  const handleSortMenu = async (value) => {
    setPageNumber(1);
    setQuery(value);
  };

  const listenMMAccount = React.useCallback(async () => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', async () => {
        setPageNumber(1);
      });
    }
  }, []);

  const handleTab = (type) => {
    setTokens([]);
    setPageNumber(1);
    setNftType(type);
    handleSortMenu('');
    history.push({
      pathname: `${RoutePaths.PROFILE_PAGE}/${address}`,
      state: {
        tabs: type,
        page: 'profile',
      },
    });
  };

  const { tokens, count, hasMore, loading, error, setTokens } = useTokenProfileList({
    query,
    pageNumber,
    address,
    nftType,
    resetPage,
    handleTab,
  });

  useEffect(() => {
    handleTab('profile-nfts');
    listenMMAccount();
  }, []);

  if (isOwner === undefined) return false;

  const activeTabCollections = location.state && location.state.tabs === 'profile-collections';
  const activeTabNfts = location.state && location.state.tabs === 'profile-nfts';

  return (
    <>
      <Box maxWidth="1536px" m={(0, 'auto')} pt={12} padding="80px 40px 31px 40px">
        <Heading textAlign="center" color="white" fontWeight={800}>
          {isOwner ? 'My profile' : 'Profile'}
        </Heading>
        <Box maxW="588px" margin="0 auto">
          <Flex pt={6} pb={6}>
            <InfoWrapper>
              <Avatar size="xl" src="https://bit.ly/broken-link" />
              <Box ml="3">
                <Text color="white" fontWeight={800} fontSize={24} textOverflow="hidden">
                  {shortAddress(address)}
                </Text>
                {isOwner && (
                  <>
                    <Badge colorScheme="black" color="blackAlpha.400">
                      <Text color="teal.200">Connected with MetaMask</Text>
                    </Badge>
                    <Text color="gray.400" fontSize={12}>
                      All your Moon Rabbit NFTs are safely stored here. View them, expand your collection, build your
                      own metaverse.
                    </Text>
                  </>
                )}
              </Box>
            </InfoWrapper>
          </Flex>

          <StatWrapper>
            <Stat color="white">
              <StatLabel>{isOwner ? 'You own' : 'User owns'}</StatLabel>
              <Flex alignItems="baseline">
                <StatNumber fontSize={24} fontWeight={600} lineHeight="32px" pr={2}>
                  {count}
                </StatNumber>
                <Box fontSize="14px" fontWeight={600}>
                  NFTs
                </Box>
              </Flex>
            </Stat>
          </StatWrapper>
        </Box>
      </Box>

      {location.state && location.state.tabs === nftType && (
        <Box pt={{ base: 18, sm: 340, md: 240, lg: 120 }}>
          <Box minH={'300px'} maxW="1536" margin="0 auto" pr={10} pl={10} pb={150}>
            <Flex justifyContent="space-between" alignItems="center" height="50px">
              <Flex gridGap={4} pr={4}>
                <Box onClick={() => handleTab('profile-nfts')} cursor="pointer">
                  <Text
                    color={activeTabNfts ? 'teal.300' : 'white'}
                    fontSize={{ base: '18px', lg: '32px' }}
                    fontWeight="bold"
                    decoration={activeTabNfts ? 'underline' : 'none'}
                    textUnderlineOffset={'6px'}
                    textDecorationThickness="5px"
                  >
                    {isOwner ? 'My NFTs' : "User's NFTs"}
                  </Text>
                </Box>
                <Box>
                  <Text fontSize={{ base: '18px', lg: '32px' }} fontWeight="bold" color="white">
                    /
                  </Text>
                </Box>
                <Box onClick={() => handleTab('profile-collections')} cursor="pointer">
                  <Text
                    color={activeTabCollections ? 'teal.300' : 'white'}
                    fontSize={{ base: '18px', lg: '32px' }}
                    fontWeight="bold"
                    decoration={activeTabCollections ? 'underline' : 'none'}
                    textUnderlineOffset={'6px'}
                    textDecorationThickness="5px"
                  >
                    {isOwner ? 'My Collections' : "User's Collections"}
                  </Text>
                </Box>
              </Flex>
              {location.state && location.state.tabs !== 'profile-collections' && (
                <NFTFilter handleSort={handleSortMenu} isHomePage={true} />
              )}
            </Flex>
            {location.state && location.state.tabs === 'profile-nfts' && (
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

            {location.state && location.state.tabs === 'profile-collections' && (
              <CollectionList collections={tokens} hasMore={hasMore} loading={loading} setPageNumber={setPageNumber} />
            )}
          </Box>
        </Box>
      )}
    </>
  );
};

export default ProfilePage;
