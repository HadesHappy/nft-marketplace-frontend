import { Box, Stat, StatLabel, StatNumber } from '@chakra-ui/react';
import React from 'react';
import { StatWrapper } from '../../pages/NFT/styled-ui';

const TokenDetailTimer = ({ isSellingStart, timerComponents }) => {
  return (
    <Box>
      <StatWrapper>
        <Stat>
          <StatLabel color="gray.500">{isSellingStart ? 'Time remaining' : ' Listing starts in'}</StatLabel>
          <StatNumber fontSize={24} fontWeight={600} lineHeight="32px" color="white">
            {timerComponents.length ? timerComponents : !isSellingStart ? <span>Finished</span> : ''}
          </StatNumber>
        </Stat>
      </StatWrapper>
    </Box>
  );
};

export default TokenDetailTimer;
