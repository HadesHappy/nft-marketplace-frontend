import { Flex, Text } from '@chakra-ui/react';
import React from 'react';
import NFTFilter from './filter';

const HeaderTokenList = ({ title, data, handleSort }) => {
  return (
    <Flex justifyContent="space-between" alignItems="center">
      <Text color="white" fontSize="32" fontWeight="bold">
        {title}
      </Text>
      <NFTFilter handleSort={handleSort} />
    </Flex>
  );
};

export default HeaderTokenList;
