import { SimpleGrid } from '@chakra-ui/react';
import React, { useCallback } from 'react';
import { useHistory } from 'react-router';
import * as RoutePaths from '../../utils/constants/routings';
import TokensSkeleton from '../CollectionItem/skeleton';
import EmptyTab from '../EmptyTab/index';
import HeaderTokenList from '../HeaderTokenList/index';
import Token from '../Token/index';

const TokenList = ({
  tokens,
  handleSort,
  loading,
  setPageNumber,
  hasMore,
  address,
  error,
  headerTitle,
  headerVisability,
}) => {
  let history = useHistory();

  const observer = React.useRef();
  const lastTokenElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber((prevPageNumber) => prevPageNumber + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  return (
    <>
      {headerVisability && (
        <HeaderTokenList data={tokens ? tokens : null} title={headerTitle} handleSort={handleSort} />
      )}

      {tokens ? (
        <>
          {tokens && tokens.length > 0 ? (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 2, xl: 3 }} gridColumnGap={6} gridRowGap={3} pb={100}>
              {tokens.map((token, index) => {
                if (tokens.length === index + 1) {
                  return (
                    <div ref={lastTokenElementRef}>
                      <Token key={index} token={token} marketplaceAddress={address} />
                    </div>
                  );
                } else {
                  return <Token key={index} token={token} marketplaceAddress={address} />;
                }
              })}
            </SimpleGrid>
          ) : (
            <EmptyTab
              text="Moon Rabbit finds your lack of NFTs disturbing."
              buttonText="Create NFT"
              onClick={() => history.push(`${RoutePaths.CREATE_NFT}`)}
            />
          )}
        </>
      ) : (
        <TokensSkeleton />
      )}
    </>
  );
};

export default TokenList;
