import { Box, Text } from '@chakra-ui/layout';
import React from 'react';

const Footer = () => {
  return (
    <>
      <footer>
        <Box bg={'#191D1C'} color={'white'} minH={'74px'}>
          <Text p={'24px 25px'} fontSize={'14px'}>
            {' '}
            Moon Rabbit AngoZaibatsu LLC © 2021. All Rights Reserved. This is not an investment solicitation or
            offering. USofA citizens, residents and legal entities are fully excluded.
          </Text>
        </Box>
      </footer>
    </>
  );
};

export default Footer;
