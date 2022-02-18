import { SimpleGrid } from '@chakra-ui/react';
import React from 'react';
import { useHistory } from 'react-router';
import * as RoutePaths from '../../utils/constants/routings';
import CollectionItem from '../CollectionItem';
import EmptyTab from '../EmptyTab/index';

const CollectionList = ({ collections, loading, hasMore, setPageNumber }) => {
  let history = useHistory();

  const observer = React.useRef();
  const lastTokenElementRef = React.useCallback(
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
      {collections && collections.length > 0 ? (
        <SimpleGrid columns={[1, 2, 3]} gridColumnGap={6} gridRowGap={3} pb="0">
          {collections.map((collection, index) => {
            if (collections.length === index + 1) {
              return (
                <div ref={lastTokenElementRef}>
                  <CollectionItem key={index} collection={collection} loading={loading}></CollectionItem>
                </div>
              );
            } else {
              return <CollectionItem key={index} collection={collection} loading={loading}></CollectionItem>;
            }
          })}
        </SimpleGrid>
      ) : (
        <EmptyTab
          text={`Moon Rabbit finds your lack of NFTs disturbing.`}
          buttonText="Browse marketplace"
          onClick={() =>
            history.push({
              pathname: `${RoutePaths.HOME}`,
              state: {
                tab: 'nfts',
                page: 'home',
              },
            })
          }
        />
      )}
    </>
  );
};

export default CollectionList;
