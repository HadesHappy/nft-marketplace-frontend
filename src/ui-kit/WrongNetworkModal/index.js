import { Modal, ModalBody, ModalContent, ModalHeader, ModalOverlay, Text } from '@chakra-ui/react';
import React from 'react';
import Loading from '../../components/Loader/index';
import { networkName, rpcUrl } from '../../utils/constants/variables';

const WrongNetworkModal = ({ isOpen }) => {
  return (
    <>
      <Modal closeOnOverlayClick={false} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent backgroundColor="rgb(40,40,40)" color="white">
          <ModalHeader>Wrong network</ModalHeader>

          <ModalBody pb={6}>
            <Text fontSize={16}>
              Change network to <strong>"{networkName}"</strong>
            </Text>
            <Loading />
            <strong> Metamask settings:</strong>
            <br />
            Network Name: Moon Rabbit EVM
            <br />
            New RPC URL: {rpcUrl}
            <br />
            Chain ID: 1280
            <br />
            Currency Symbol: AAA
            <br />
            <br />
            If you have issues connecting to wallet, minting or selling NFTs, open your MetaMask{' '}
            <b> Settings >> "Advanced" >> "Reset Account"</b> and try again.
            <br />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default WrongNetworkModal;
