import { CloseIcon, SearchIcon } from '@chakra-ui/icons';
import { Input, InputGroup, InputLeftElement, InputRightElement } from '@chakra-ui/react';
import queryString from 'query-string';
import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import * as RoutePaths from '../../utils/constants/routings';
import { whoIs } from '../../utils/requestApi/marketplace';

const SearchField = () => {
  let location = useLocation();
  const history = useHistory();
  const [query, setQuery] = useState('');

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      const query = event.target.value;
      if (query.includes('0x')) {
        whoIs({ address: query })
          .then((result) => {
            switch (result) {
              case 'collection':
                history.push(`${RoutePaths.COLLECTION}/${query}`);
                break;
              case 'marketplace':
                history.push({
                  pathname: `${RoutePaths.HOME}`,
                  state: {
                    tab: 'nfts',
                    page: 'home',
                  },
                });
                break;
              case 'user':
                history.push({
                  pathname: `${RoutePaths.PROFILE_PAGE}/${query}`,
                  state: {
                    tab: 'nfts',
                    page: 'home',
                  },
                });
                break;
              default:
                break;
            }
          })
          .catch((e) => history.push(`${RoutePaths.SEARCH_PAGE}/?query=${query}`));
      } else {
        history.push(`${RoutePaths.SEARCH_PAGE}/?query=${query}`);
      }
    }
  };

  const handleOnChange = (event) => {
    setQuery(event.target.value);
  };

  useEffect(() => {
    setQuery(queryString.parse(location.search).query);
  }, []);

  return (
    <InputGroup>
      <InputLeftElement pointerEvents="none" children={<SearchIcon color="gray.500" />} />
      <Input
        onKeyPress={handleKeyPress}
        onChange={handleOnChange}
        value={query}
        border="none"
        bgColor="#282828"
        placeholder="Search for Moon Rabbit NFTs. What would you like to collect today?"
      />
      {query && query.length >= 1 && (
        <InputRightElement
          cursor="pointer"
          children={<CloseIcon w={3} h={3} color="teal.200" />}
          onClick={() => setQuery('')}
        />
      )}
    </InputGroup>
  );
};

export default SearchField;
