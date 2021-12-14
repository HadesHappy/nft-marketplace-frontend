import { Avatar, Box, Center, Flex, Heading, Skeleton, SkeletonCircle, Stack, Text } from '@chakra-ui/react';
import React from 'react';
import { useHistory } from 'react-router';
import * as RoutePaths from '../../utils/constants/routings';
import { ipfsUrl } from '../../utils/ipfs';

export default function CollectionItem({ collection, userAddress, loading }) {
  const history = useHistory();
  const [imageLoaded, setImageLoaded] = React.useState(false);

  const handleClickCollection = () => {
    history.push(`${RoutePaths.COLLECTION}/${collection.Id}`);
  };

  return (
    <>
      {!collection ? (
        <Center pt={6}>
          <Box position="relative" maxW={'448px'} w={'full'} cursor="pointer" onClick={handleClickCollection}>
            <Skeleton loading="lazy" bgSize="cover" h={100} />

            <Flex position="absolute" bottom={90} w={'full'} justifyContent="center ">
              <SkeletonCircle size="24" opacity="1" />
            </Flex>
            <Box
              backgroundColor={'#272B2A'}
              color="white"
              rounded={'md'}
              p={6}
              overflow={'hidden'}
              _hover={{
                boxShadow: '2xl',
              }}
              pt={8}
              cursor="pointer"
            >
              <Stack alignItems="center">
                <Skeleton height="25px" width="sm" pt={5} />
                <Skeleton height="25px" width="xs" pt={5} />
              </Stack>
            </Box>
          </Box>
        </Center>
      ) : (
        <Center pt={6}>
          <Box position="relative" maxW={'448px'} w={'full'} cursor="pointer" onClick={() => handleClickCollection()}>
            {!imageLoaded && <Skeleton h={100} pt={2} />}
            <Box
              loading="lazy"
              bgSize="cover"
              h={100}
              backgroundPosition="center center"
              display={imageLoaded ? 'flex' : 'none'}
              bgImage={encodeURI(ipfsUrl + collection.BackgroundURI.replace('ipfs:/', ''))}
            ></Box>
            <Flex position="absolute" bottom={90} w={'full'} justifyContent="center ">
              <Avatar
                loading="lazy"
                onLoad={() => setImageLoaded(true)}
                size="xl"
                src={encodeURI(ipfsUrl + collection.AvatarURI.replace('ipfs:/', ''))}
              />
            </Flex>
            <Box
              backgroundColor={'#272B2A'}
              color="white"
              rounded={'md'}
              p={6}
              overflow={'hidden'}
              _hover={{
                boxShadow: '2xl',
              }}
              pt={8}
              cursor="pointer"
            >
              <Stack alignItems="center">
                <Heading fontSize={{ base: 18, lg: '2xl' }} fontFamily={'body'} pt={5}>
                  {collection.CollectionName}
                </Heading>
                <Text color={'gray.500'} overflow="hidden" whiteSpace="nowrap" textOverflow="ellipsis">
                  {collection.Symbol}
                </Text>
              </Stack>
            </Box>
          </Box>
        </Center>
      )}
    </>
  );
}
