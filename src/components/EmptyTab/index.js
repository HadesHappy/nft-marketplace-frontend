import { Button, chakra, Flex, Text } from '@chakra-ui/react';
import React from 'react';
import UserContext from '../../utils/contexts/User';

const EmptyTab = ({ text, buttonText, onClick }) => {
  const data = React.useContext(UserContext);
  return (
    <Flex
      margin="0 auto"
      width="300px"
      pt={20}
      flexFlow="column wrap"
      gridGap={3}
      justifyContent="center"
      color="gray.400"
      fontWeight="bold"
      textAlign="center"
    >
      <Text fontSize={36}>No items found</Text>
      <chakra.span>{text}</chakra.span>
      {window.ethereum && data.account.address && (
        <Flex justifyContent="center">
          <Button colorScheme="teal" color="black" variant="with-shadow" onClick={onClick}>
            {buttonText}
          </Button>{' '}
        </Flex>
      )}
    </Flex>
  );
};

export default EmptyTab;
