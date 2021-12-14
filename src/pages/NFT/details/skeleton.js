import { Box, Flex, Heading, Image, SimpleGrid, Skeleton, SkeletonText, Text } from '@chakra-ui/react';
import React from 'react';
import { useLocation } from 'react-router';

const TokenDetailsSkeleton = ({ imageUrl }) => {
  const location = useLocation();

  return (
    <Box maxWidth="1536px" m="0 auto" padding="60px 40px 80px 40px">
      <SimpleGrid columns={{ md: 'auto', lg: 2 }} columnGap={28} rowGap={10}>
        {location.state && location.state.imageUrl ? (
          <Box maxH="600px" cursor="pointer" borderRadius="4px" justifySelf="center">
            <Image maxH="600px" src={location.state.imageUrl} />
          </Box>
        ) : (
          <Skeleton h="600px" w="600px" borderRadius="4px" justifySelf="center" />
        )}

        <Flex flexDirection="column">
          <Heading color="white" pb="16px">
            <Skeleton height="40px" />
          </Heading>
          <Flex flexWrap="wrap" gridColumnGap={2}>
            <Box bgColor="teal.500" placeSelf="flex-start" borderRadius="6px" pt={1} pb={1} pr={2} pl={2}>
              <Skeleton height="24px" w="160px" />
            </Box>
            <Box bgColor="gray.400" placeSelf="flex-start" borderRadius="6px" pt={1} pb={1} pr={2} pl={2}>
              <Skeleton height="24px" w="100px" />
            </Box>
          </Flex>
          <Text color="gray.500" pt={4}>
            <SkeletonText skeletonHeight="20px" mt="4" noOfLines={4} spacing="3" />
          </Text>
        </Flex>
      </SimpleGrid>
    </Box>
  );
};

export default TokenDetailsSkeleton;
