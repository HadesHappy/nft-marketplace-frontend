import { CalendarIcon } from '@chakra-ui/icons';
import { Box } from '@chakra-ui/react';
import React from 'react';

const TokenMarketplaceTimer = ({ timerComponents }) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      position="absolute"
      gridColumnGap={1.5}
      top={4}
      left={4}
      bgColor={timerComponents.length ? 'teal.200' : 'gray.300'}
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
      <CalendarIcon />
      {timerComponents.length ? timerComponents : <span>Finished</span>}
    </Box>
  );
};

export default TokenMarketplaceTimer;
