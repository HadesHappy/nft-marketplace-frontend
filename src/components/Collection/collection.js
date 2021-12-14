import { Avatar, Box, SimpleGrid } from '@chakra-ui/react';
import React from 'react';
import { ipfsUrl } from '../../utils/ipfs';

const CollectionBoxInfo = ({ collectionInfo, isSelected, setFieldValueFunc }) => {
  const clickButtonFunction = setFieldValueFunc != null;
  return (
    <Box
      w="110px"
      maxH="132px"
      onClick={clickButtonFunction ? () => setFieldValueFunc(collectionInfo.collectionAddress) : null}
      cursor={clickButtonFunction ? 'pointer' : 'default'}
    >
      <SimpleGrid
        border={isSelected ? '1px solid #00FFD1' : '1px solid #718096'}
        textAlign="center"
        borderRadius="8px"
        p={7}
      >
        <Box>
          <Avatar
            h="28px"
            w="28px"
            src={
              collectionInfo.imagePath !== ''
                ? encodeURI(ipfsUrl + collectionInfo.imagePath.replace('ipfs:/', ''))
                : 'https://bit.ly/broken-link'
            }
          />
        </Box>
        <Box color="teal.200" fontWeight={600} pt={1}>
          {collectionInfo.name.length <= 3 ? collectionInfo.name : collectionInfo.name.substr(0, 3) + '...'}
        </Box>
        <Box fontSize={'xs'} color="gray.400">
          {collectionInfo.symbol.length <= 3 ? collectionInfo.symbol : collectionInfo.symbol.substr(0, 3) + '...'}
        </Box>
      </SimpleGrid>
    </Box>
  );
};

export default CollectionBoxInfo;
