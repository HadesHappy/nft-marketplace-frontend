import { Box } from '@chakra-ui/react';
import React from 'react';

const OnSale = () => {
  return (
    <Box
      display="flex"
      alignItems="center"
      position="absolute"
      gridColumnGap={1.5}
      top={4}
      right={4}
      bgColor="red.500"
      color="black"
      fontSize={16}
      pr={4}
      pl={4}
      pt={1}
      pb={1}
      borderRadius="6px"
      fontWeight={500}
      zIndex="2"
    >
      {<span>On Sale</span>}
    </Box>
  );
};

export default OnSale;
