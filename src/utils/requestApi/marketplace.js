import axiosInstance from '../axios';

export const getMarketplaceInfo = async (query = '') => {
  const responce = await axiosInstance.get(`/marketplace/`, { params: { sort: query || '', limit: 6, offset: 1 } });
  return responce.data;
};

export const getMarketplaceCollections = async ({ address }) => {
  const responce = await axiosInstance.get(`/collections-of-user/?address=${address}`);
  return responce.data;
};

export const getSpaceMarketplaces = async () => {
  const responce = await axiosInstance.get('/space-marketplaces/');
  return responce.data;
};

export const whoIs = async ({ address }) => {
  const responce = await axiosInstance.get(`/whois/?address=${address}`);
  return responce.data;
};
