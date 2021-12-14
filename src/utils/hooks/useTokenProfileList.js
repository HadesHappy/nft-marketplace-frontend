import axios from 'axios';
import { useEffect, useState } from 'react';
import { backendUrl } from '../constants/variables';

const limit = 9;

export default function useTokenProfileList({ query, pageNumber, address, resetPage }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [tokens, setTokens] = useState([]);
  const [count, setCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    setTokens([]);
    resetPage();
    setCount(0);
  }, [query, address]);

  useEffect(() => {
    setLoading(true);
    setError(false);
    let cancel;
    axios({
      method: 'GET',
      url: `${backendUrl}user/`,
      params: { sort: query || '', address: address, limit: limit, offset: (pageNumber - 1) * limit },
      cancelToken: new axios.CancelToken((c) => (cancel = c)),
    })
      .then((res) => {
        if (res.data.Nfts.length > 0) {
          setCount(res.data.Count);
          setTokens((prevTokens) => {
            return [...new Set([...prevTokens, ...res.data.Nfts])];
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
  }, [query, pageNumber, address]);

  return { loading, count, error, tokens, hasMore };
}
