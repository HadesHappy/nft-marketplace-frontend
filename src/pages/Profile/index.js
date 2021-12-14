import { Avatar, Badge, Box, Flex, Heading, Stat, StatLabel, StatNumber, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import TokenList from '../../components/TokenList/index';
import UserContext from '../../utils/contexts/User';
import { shortAddress } from '../../utils/helper';
import useTokenProfileList from '../../utils/hooks/useTokenProfileList';
import { InfoWrapper, StatWrapper } from '../NFT/styled-ui';

const ProfilePage = () => {
  const { address } = useParams();
  const data = React.useContext(UserContext);
  const [pageNumber, setPageNumber] = useState(1);
  const [query, setQuery] = useState('');
  const resetPage = () => setPageNumber(1);
  const { tokens, count, hasMore, loading, error } = useTokenProfileList({ query, pageNumber, address, resetPage });
  const isOwner = address === data.account.address;

  const handleSortMenu = async (value) => {
    setQuery(value);
    setPageNumber(1);
  };

  const listenMMAccount = React.useCallback(async () => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', async () => {
        setPageNumber(1);
      });
    }
  }, []);

  useEffect(() => {
    listenMMAccount();
  }, []);

  if (isOwner === undefined) return false;

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
              <StatLabel>{isOwner ? 'You ' : 'User '} owns</StatLabel>
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
      <Box pt={{ base: 18, sm: 340, md: 240, lg: 120 }}>
        <Box minH={'300px'} maxW="1536" margin="0 auto" pr={10} pl={10} pb={150}>
          <TokenList
            tokens={tokens}
            handleSort={handleSortMenu}
            loading={loading}
            setPageNumber={setPageNumber}
            hasMore={hasMore}
            address={address}
            error={error}
            headerTitle={isOwner ? 'My NFTs' : "User's NFTs"}
            headerVisability
          />
        </Box>
      </Box>
    </>
  );
};

export default ProfilePage;
