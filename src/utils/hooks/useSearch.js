import axios from 'axios';
import { useEffect, useState } from 'react';
import { backendUrl } from '../constants/variables';

const limit = 9;

export default function useSearch({ sort, query, pageNumber, onChange }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [tokens, setTokens] = useState([]);
  const [collections, setCollections] = useState([]);
  const [tokenCount, setTokenCount] = useState(0);
  const [collectionCount, setCollectionCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    setTokens([]);
    setCollections([]);
    setTokenCount(0);
    setCollectionCount(0);
    onChange();
  }, [query, sort]);

  useEffect(() => {
    setLoading(true);
    setError(false);
    let cancel;
    axios({
      method: 'GET',
      url: `${backendUrl}search/`,
      params: { sort: sort || '', query: query || '', limit: limit, offset: (pageNumber - 1) * limit },
      cancelToken: new axios.CancelToken((c) => (cancel = c)),
    })
      .then((res) => {
        if (res.data.Nfts.Nfts.length > 0 || res.data.Collections.Collections.length > 0) {
          if (pageNumber <= 1) {
            setTokenCount(res.data.Nfts.Count);
          }

          setCollectionCount(res.data.Collections.Count);
          setTokens((prevTokens) => {
            return [...new Set([...prevTokens, ...res.data.Nfts.Nfts])];
          });
          setCollections((prevCollections) => {
            return [...new Set([...prevCollections, ...res.data.Collections.Collections])];
          });

          setHasMore(true);
        } else {
          setHasMore(false);
        }
        setLoading(false);
      })
      .catch((e) => {
        if (axios.isCancel(e)) return;
        setError(true);
      });
    return () => cancel();
  }, [query, pageNumber, sort]);

  return { loading, collections, tokenCount, collectionCount, error, tokens, hasMore };
}
