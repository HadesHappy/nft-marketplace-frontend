import { Text } from '@chakra-ui/layout';
import { Button, Flex, Image, Menu, MenuButton, MenuItemOption, MenuList, MenuOptionGroup } from '@chakra-ui/react';
import React from 'react';
import SortSrc from '../../assets/images/icons/sorting_black.png';

const NFTFilter = ({ handleSort }) => {
  return (
    <Menu closeOnSelect={true} size={{ base: 'xs', lg: 'lg' }}>
      <MenuButton as={Button} colorScheme="teal" color="black" variant="with-shadow">
        <Flex alignItems="center">
          <Image w={4} h={4} src={SortSrc} color="black" mr={2}></Image>
          <Text fontSize={'xm'} display={{ base: 'none', md: 'flex' }}>
            {' '}
            Sort & Filter
          </Text>
        </Flex>
      </MenuButton>
      <MenuList minWidth="240px">
        <MenuOptionGroup defaultValue="ALL" title="Sort & Filter" type="radio" onChange={(value) => handleSort(value)}>
          <MenuItemOption value="ALL">All Nfts</MenuItemOption>
          <MenuItemOption value="PRICE_ASC">Price: Low to High</MenuItemOption>
          <MenuItemOption value="PRICE_DESC">Price: High to Low</MenuItemOption>
          <MenuItemOption value="START_ASC">Recently started</MenuItemOption>
          <MenuItemOption value="ENDING_ASC">Auction ending soon</MenuItemOption>
        </MenuOptionGroup>
      </MenuList>
    </Menu>
  );
};

export default NFTFilter;
