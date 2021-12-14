import { SimpleGrid, Skeleton } from '@chakra-ui/react';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/tabs';
import React from 'react';
import Token from '../../components/Token/index';

const TokensSkeleton = () => {
  return (
    <Tabs isLazy colorScheme="teal.200" color="white">
      <TabList>
        <Tab color="teal.200">
          <Skeleton height="20px" />
        </Tab>
      </TabList>

      <TabPanels>
        <TabPanel p={0}>
          <SimpleGrid columns={[1, 2, 3]} gridColumnGap={6} gridRowGap={3} pb="0">
            <Token></Token>
            <Token></Token>
            <Token></Token>
          </SimpleGrid>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default TokensSkeleton;
