import { Box, Button, Center, Flex, Heading, Image, Skeleton, Spacer, Stack, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import Web3 from 'web3';
import DateTimer from '../../ui-kit/DateTimer';
import * as RoutePaths from '../../utils/constants/routings';
import { AUCTION_TYPE, marketplaceContractAddress, TOKEN_NAME } from '../../utils/constants/variables';
import { ipfsUrl } from '../../utils/ipfs';
import OnSale from './OnSale';
export default function Token({ token, loading }) {
  const history = useHistory();
  let location = useLocation();
  const [imageLoaded, setImageLoaded] = useState(false);
  const web3 = new Web3('https://evm.moonrabbit.com');

  const handleClickToken = () => {
    history.push({
      pathname: `${RoutePaths.NFT}/${token.CollectionId}:${token.Id}`,
      state: {
        imageUrl: token.CachedImage
          ? encodeURI(token.CachedImage)
          : encodeURI(`${ipfsUrl}${token.ImageURI.replace('ipfs:/', '')}`),
      },
    });
  };

  return (
    <>
      {!token ? (
        <Center pt={6}>
          <Box position="relative" maxW={'448px'} w={'full'}>
            <Box
              backgroundColor={'#272B2A'}
              color="white"
              rounded={'md'}
              p={6}
              overflow={'hidden'}
              _hover={{
                boxShadow: '2xl',
              }}
            >
              <Stack>
                <Skeleton height={'400px'} />
                <Heading fontSize={'2xl'} fontFamily={'body'} pt={5}>
                  <Skeleton height="25px" />
                </Heading>
                <Text color={'gray.500'} overflow="hidden" whiteSpace="nowrap" textOverflow="ellipsis">
                  <Skeleton height="40px" />
                </Text>
                <Flex mt={6} alignItems="center" spacing={4}>
                  <Skeleton width="200px" height="30px" pr={16} />
                  <Spacer />
                  <Skeleton width="80px" height="40px" />
                </Flex>
              </Stack>
            </Box>
          </Box>
        </Center>
      ) : (
        <Center pt={6}>
          <Box position="relative" maxW={'448px'} w={'full'}>
            {token.ListingType === AUCTION_TYPE && (
              <DateTimer
                seconds={false}
                startDate={token.TimeStart}
                endDate={parseInt(token.TimeStart) + parseInt(token.Duration)}
              />
            )}
            {location.pathname.includes('profile') &&
              parseInt(token.Ending) > Math.floor(Date.now() / 1000) &&
              token.Owner === marketplaceContractAddress && <OnSale />}

            <Box
              backgroundColor={'#272B2A'}
              color="white"
              rounded={'md'}
              p={6}
              overflow={'hidden'}
              _hover={{
                boxShadow: '2xl',
              }}
              onClick={() => handleClickToken()}
              cursor="pointer"
            >
              <Stack>
                {!imageLoaded && <Skeleton height={{ base: '300px', sm: '300px', lg: '400px' }} mW="400px" pt={2} />}
                <Box
                  position=" relative"
                  height={{ sm: '300px', lg: '400px' }}
                  mW="400px"
                  display={imageLoaded ? 'flex' : 'none'}
                  alignItems="center"
                  justifyContent="center"
                >
                  <Box
                    display="flex"
                    flexFlow="column"
                    alignItems="center"
                    width="100%"
                    height="100%"
                    justifyContent="center"
                  >
                    <Image
                      height="auto"
                      maxHeight="100%"
                      maxWidth="100%"
                      src={
                        token.CachedImage
                          ? encodeURI(token.CachedImage)
                          : encodeURI(`${ipfsUrl}${token.ImageURI.replace('ipfs:/', '')}`)
                      }
                      onLoad={() => setImageLoaded(true)}
                    />
                  </Box>
                </Box>

                <Heading fontSize={'2xl'} fontFamily={'body'} pt={8}>
                  {token.Name}
                </Heading>
                <Text color={'gray.500'} overflow="hidden" whiteSpace="nowrap" textOverflow="ellipsis" minH={4}>
                  {token.Description}
                </Text>
              </Stack>
              <Stack mt={6} direction={'row'} spacing={4} align={'center'} justifyContent="space-between" height={12}>
                {token.MinimalBid !== '0' ? (
                  <Text fontWeight="bold" fontSize={20}>
                    {token.LastBid > 0 && token.ListingType === AUCTION_TYPE
                      ? web3.utils.fromWei(token.LastBid)
                      : web3.utils.fromWei(token.MinimalBid)}{' '}
                    {TOKEN_NAME}
                  </Text>
                ) : (
                  <Box></Box>
                )}
                <Button variant="outline" colorScheme="black" color="teal.200" onClick={() => handleClickToken()}>
                  Open
                </Button>
                )}
              </Stack>
            </Box>
          </Box>
        </Center>
      )}
    </>
  );
}
