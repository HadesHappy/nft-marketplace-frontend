import axiosInstance from '../axios';

export const getTokenInfo = async ({ collectionAddress, tokenId }) => {
  const responce = await axiosInstance.get(`/nft/?collection=${collectionAddress}&id=${tokenId}`);
  return responce.data;
};

export const isNftAvailable = async ({ tokenId, collectionAddress }) => {
  const responce = await axiosInstance.get(`/is-nft-available/?id=${tokenId}&collection=${collectionAddress}`);
  return responce.data;
};
