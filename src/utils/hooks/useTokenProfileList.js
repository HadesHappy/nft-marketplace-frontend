import axios from 'axios';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { backendUrl } from '../constants/variables';

const limit = 9;

export default function useTokenProfileList({ query, pageNumber, address, resetPage, nftType, handleTab }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [tokens, setTokens] = useState([]);
  const [count, setCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setTokens([]);
    if (location.state && location.state.page && location.state.page === 'home') {
      handleTab('profile-nfts');
    }
  }, [query, nftType, address, location.state]);

  useEffect(() => {
    setLoading(true);
    setError(false);
    let cancel;

    let nftTypeUrl = nftType === 'profile-collections' ? `collections-of-user-new/` : 'user/';

    axios({
      method: 'GET',
      url: `${backendUrl}${nftTypeUrl}`,
      params: { sort: query || '', address: address, limit: limit, offset: (pageNumber - 1) * limit },
      cancelToken: new axios.CancelToken((c) => (cancel = c)),
    })
      .then((res) => {
        if (nftType !== 'profile-collections') {
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
        } else {
          if (res.data.Collections.length > 0) {
            setTokens((prevTokens) => {
              return [...new Set([...prevTokens, ...res.data.Collections])];
            });
            setHasMore(true);
          } else {
            setHasMore(false);
          }
          setLoading(false);
        }
      })
      .catch((e) => {
        if (axios.isCancel(e)) return;
        setError(true);
      });
    return () => cancel();
  }, [query, pageNumber, address, nftType, location.state]);

  return { loading, count, error, tokens, hasMore, setTokens };
}
