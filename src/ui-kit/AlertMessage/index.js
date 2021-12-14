import { Alert, AlertDescription, AlertIcon, AlertTitle } from '@chakra-ui/alert';
import { CloseButton } from '@chakra-ui/close-button';
import { Box } from '@chakra-ui/layout';
import React, { useState } from 'react';
import ReactDOM from 'react-dom';

// types: "info" | "warning" | "success" | "error"
const AlertMessage = ({ type, title, message }) => {
  const [isOpen, setOpen] = useState(true);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <Box position="absolute" top={84} right={4} w="580px">
      <Alert status={type}>
        <AlertIcon />
        <Box flex="1">
          <AlertTitle>{title}</AlertTitle>
          <AlertDescription display="block">{message}</AlertDescription>
        </Box>
        <CloseButton position="absolute" right="8px" top="8px" onClick={() => setOpen(false)} />
      </Alert>
    </Box>,
    document.body
  );
};

export default AlertMessage;
