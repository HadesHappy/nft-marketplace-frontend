import axios from 'axios';
import { useEffect, useState } from 'react';
import { backendUrl } from '../constants/variables';

const limit = 12;

export default function useTokenCollectionList({ query, pageNumber, address }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [tokens, setTokens] = useState([]);
  const [collection, setCollection] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    setTokens([]);
  }, [query]);

  useEffect(() => {
    setLoading(true);
    setError(false);
    let cancel;

    axios({
      method: 'GET',
      url: `${backendUrl}collection/`,
      params: { sort: query || '', address: address, limit: limit, offset: (pageNumber - 1) * limit },
      cancelToken: new axios.CancelToken((c) => (cancel = c)),
    })
      .then((res) => {
        setCollection(res.data.Collection);
        if (res.data.Nfts != null) {
          setCount(res.data.Count);
          setTokens((prevTokens) => {
            return [...new Set([...prevTokens, ...res.data.Nfts])];
          });
          setHasMore(true);
          setLoading(false);
        } else {
          setHasMore(false);
        }
      })
      .catch((e) => {
        if (axios.isCancel(e)) return;
        setError(true);
      });
    return () => cancel();
  }, [query, pageNumber, address]);

  return { loading, error, count, tokens, collection, hasMore };
}
