import { Box } from '@chakra-ui/layout';
import { chakra, SimpleGrid } from '@chakra-ui/react';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/tabs';
import queryString from 'query-string';
import React from 'react';
import { useHistory, useLocation } from 'react-router';
import SearchCollectionsTab from './collections';
import SearchNftTab from './nfts';

const SearchPage = () => {
  let history = useHistory();
  let location = useLocation();
  // const [pageNumber, setPageNumber] = useState(1);
  // const [query, setQuery] = useState('');
  const [tabIndex, setTabIndex] = React.useState(0);
  const [collectionsCount, setCollectionsCount] = React.useState(0);
  const [tokensCount, setTokensCount] = React.useState(0);

  // const onChange = () => {
  //   setQuery(queryString.parse(location.search).query);
  //   setPageNumber(1);
  // };
  // const { tokens, tokenCount, hasMore, loading, error } = useSearchNFT({
  //   query: queryString.parse(location.search).query,
  //   pageNumber,
  //   onChange,
  //   type: tabIndex === 0 ? 'nfts' : 'collections',
  // });

  // const handleSortMenu = async (value) => {
  //   setQuery(value);
  //   setPageNumber(1);
  // };

  // const observer = React.useRef();
  // const lastTokenElementRef = React.useCallback(
  //   (node) => {
  //     if (loading) return;
  //     if (observer.current) observer.current.disconnect();
  //     observer.current = new IntersectionObserver((entries) => {
  //       if (entries[0].isIntersecting && hasMore) {
  //         setPageNumber((prevPageNumber) => prevPageNumber + 1);
  //       }
  //     });
  //     if (node) observer.current.observe(node);
  //   },
  //   [loading, hasMore]
  // );

  return (
    <>
      <Box maxWidth="1536px" m={(0, 'auto')} pt={12} padding="80px 40px 121px 40px">
        <Box color="white" fontSize={36} fontWeight="bold" pb={8}>
          Search results for <chakra.span color="teal.200">{queryString.parse(location.search).query} </chakra.span>
        </Box>
        <Box>
          <Tabs index={tabIndex} onChange={(index) => setTabIndex(index)} colorScheme="teal" color="teal.200">
            <TabList>
              <Tab>Nfts ({`${tokensCount}`})</Tab>
              <Tab>Collections ({`${collectionsCount}`})</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <Box minH={'300px'} maxW="1536" margin="0 auto" pr={10} pl={10} pb={150}>
                  <SearchNftTab setTokensCount={setTokensCount} />
                </Box>
              </TabPanel>
              <TabPanel>
                <SearchCollectionsTab setCollectionsCount={setCollectionsCount} />
              </TabPanel>
              <TabPanel>
                <SimpleGrid columns={[1, 2, 3]} gridColumnGap={6} gridRowGap={3} pb="0"></SimpleGrid>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Box>
    </>
  );
};

export default SearchPage;
