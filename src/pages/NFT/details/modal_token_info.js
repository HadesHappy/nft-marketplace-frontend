import { Image } from '@chakra-ui/image';
import { Box, Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay, Skeleton } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useLocation } from 'react-router';

const ModalTokenInfo = ({ isOpen, onClose, tokenInfo }) => {
  const location = useLocation();
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton bgColor="rgba(0, 0, 0, 0.06)" width="40px" height="40px" />
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          <Box maxW="588px" pb="48px" pt="48px" borderRadius="4px">
            <ModalBody>
              {!imageLoaded && location.state && !location.state.imageUrl && (
                <Skeleton h="600px" w="600px" borderRadius="4px" justifySelf="center" />
              )}
              <Image
                display={imageLoaded ? '' : 'none'}
                name={tokenInfo.name}
                onLoad={() => setImageLoaded(true)}
                src={
                  location.state && location.state.imageUrl !== null
                    ? encodeURI(location.state.imageUrl.replace('ipfs:/', ''))
                    : tokenInfo.cachedImageUrl !== ''
                    ? encodeURI(tokenInfo.cachedImageUrl)
                    : encodeURI(tokenInfo.imageUrl.replace('ipfs:/', ''))
                }
                borderRadius="4px"
                pb="40px"
              />
            </ModalBody>
          </Box>
        </Box>
      </ModalContent>
    </Modal>
  );
};

export default ModalTokenInfo;
