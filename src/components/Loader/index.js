import { Box, Spinner } from '@chakra-ui/react';
import React from 'react';

const Loading = () => {
  return (
    <Box display="flex" justifyContent="center" pt={2} pb={4}>
      <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="teal.200" size="xl" />
    </Box>
  );
};

export default Loading;
