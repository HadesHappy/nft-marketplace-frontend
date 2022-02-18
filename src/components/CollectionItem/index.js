import { StarIcon } from '@chakra-ui/icons';
import { Avatar, Box, Button, Center, Flex, Heading, Skeleton, Stack, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useHistory } from 'react-router';
import * as RoutePaths from '../../utils/constants/routings';
import { ipfsUrl } from '../../utils/ipfs';
import { addToFavoriteCollection } from '../../utils/requestApi/collection';
import CollectionSkeleton from './skeleton';

export default function CollectionItem({ collection, userAddress, loading }) {
  const history = useHistory();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [favoriteCollection, setFavoriteCollection] = useState(collection.IsExplore);

  const handleClickCollection = () => {
    history.push(`${RoutePaths.COLLECTION}/${collection.Id}`);
  };

  const handleAddToFavoriteCollection = (collectionAddress, explore) => {
    addToFavoriteCollection({ collectionAddress, explore }).then((data) => {
      setFavoriteCollection(!favoriteCollection);
    });
  };

  return (
    <>
      {!collection ? (
        <CollectionSkeleton />
      ) : (
        <Center pt={6}>
          <Box position="relative" maxW={'448px'} w={'full'}>
            {!imageLoaded && <Skeleton h={100} pt={2} />}

            {localStorage.getItem('jwtToken') && (
              <Box position="absolute" top={4} right={0} zIndex="999999">
                <Button
                  _hover={{ bg: 'transparent' }}
                  mr="4px"
                  variant="outline"
                  colorScheme="yellow"
                  color="yellow.400"
                  onClick={(e) => {
                    e.preventDefault();
                    handleAddToFavoriteCollection(collection.Id, favoriteCollection);
                  }}
                >
                  <StarIcon color={favoriteCollection ? 'yellow.400' : '#ccc'} />
                </Button>
              </Box>
            )}
            <Box cursor="pointer" onClick={() => handleClickCollection()}>
              <Box
                loading="lazy"
                bgSize="cover"
                h={100}
                backgroundPosition="center center"
                display={imageLoaded ? 'flex' : 'none'}
                bgImage={encodeURI(ipfsUrl + collection.BackgroundURI.replace('ipfs://', ''))}
              ></Box>
              <Flex position="absolute" bottom={90} w={'full'} justifyContent="center ">
                <Avatar
                  loading="lazy"
                  onLoad={() => setImageLoaded(true)}
                  size="xl"
                  src={encodeURI(ipfsUrl + collection.AvatarURI.replace('ipfs://', ''))}
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
          </Box>
        </Center>
      )}
    </>
  );
}
