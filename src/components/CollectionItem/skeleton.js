import { Box, Center, Flex, Skeleton, SkeletonCircle, Stack } from '@chakra-ui/react';
import React from 'react';

const CollectionSkeleton = () => {
  return (
    <Center pt={6}>
      <Box position="relative" maxW={'448px'} w={'full'} cursor="pointer">
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
  );
};

export default CollectionSkeleton;
