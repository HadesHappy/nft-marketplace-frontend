import axiosInstance from '../axios';

export const getTokenInfo = async ({ collectionAddress, tokenId }) => {
  const responce = await axiosInstance.get(`/nft/?collection=${collectionAddress}&id=${tokenId}`);
  return responce.data;
};

export const isNftAvailable = async ({ tokenId, collectionAddress }) => {
  const responce = await axiosInstance.get(`/is-nft-available/?id=${tokenId}&collection=${collectionAddress}`);
  return responce.data;
};

const token = localStorage.getItem('jwtToken');
const config = {
  headers: {
    jwt: token,
  },
};

export const addToFavoriteNFT = async ({ tokenId, collectionAddress, explore }) => {
  const responce = await axiosInstance.get(
    `/set-explored-nft/?id=${tokenId}&collection=${collectionAddress}&explore=${!explore}`,
    config
  );
  return responce.data;
};

export const loadTopNFTs = async () => {
  const responce = await axiosInstance.get(`/explored-nfts/`);
  return responce.data;
};
