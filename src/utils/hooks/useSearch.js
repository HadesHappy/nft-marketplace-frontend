import axios from 'axios';
import { useEffect, useState } from 'react';
import { backendUrl } from '../constants/variables';

const limit = 9;

export function useSearchNFT({ sort, query, pageNumber, onChange }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [tokens, setTokens] = useState([]);
  const [tokenCount, setTokenCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    setTokens([]);
    setTokenCount(0);
    onChange();
  }, [query, sort]);

  useEffect(() => {
    setLoading(true);
    setError(false);
    let cancel;

    // const type = 'nfts';
    // const type = "collections";
    axios({
      method: 'GET',
      url: `${backendUrl}search-nfts/`,
      params: { sort: sort || '', query: query || '', limit: limit, offset: (pageNumber - 1) * limit },
      cancelToken: new axios.CancelToken((c) => (cancel = c)),
    })
      .then((res) => {
        if (res.data.Nfts.length > 0) {
          if (pageNumber <= 1) {
            setTokenCount(res.data.Count);
          }
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
  }, [query, pageNumber, sort]);

  return { loading, tokenCount, error, tokens, hasMore };
}

export function useSearchCollection({ sort, query, pageNumber, onChange }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [collections, setCollections] = useState([]);
  const [collectionCount, setCollectionCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    setCollections([]);
    setCollectionCount(0);
    onChange();
  }, [query, sort]);

  useEffect(() => {
    setLoading(true);
    setError(false);
    let cancel;

    // const type = 'nfts';
    // const type = "collections";
    axios({
      method: 'GET',
      url: `${backendUrl}search-collections/`,
      params: { sort: sort || '', query: query || '', limit: limit, offset: (pageNumber - 1) * limit },
      cancelToken: new axios.CancelToken((c) => (cancel = c)),
    })
      .then((res) => {
        if (res.data.Collections.length > 0) {
          setCollectionCount(res.data.Count);
          setCollections((prevCollections) => {
            return [...new Set([...prevCollections, ...res.data.Collections])];
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

  return { loading, collections, collectionCount, error, hasMore };
}
