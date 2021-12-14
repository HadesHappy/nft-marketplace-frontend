import { SimpleGrid } from '@chakra-ui/react';
import React from 'react';
import Token from '../../components/Token/index';

const TokensSkeleton = () => {
  return (
    <>
      <SimpleGrid columns={[1, 2, 3]} gridColumnGap={6} gridRowGap={3} pb="0">
        <Token></Token>
        <Token></Token>
        <Token></Token>
        <Token></Token>
        <Token></Token>
        <Token></Token>
      </SimpleGrid>
    </>
  );
};

export default TokensSkeleton;
