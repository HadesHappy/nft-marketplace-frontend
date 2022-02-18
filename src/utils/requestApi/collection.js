import axiosInstance from '../axios';

export const getCollectionInfo = async ({ collectionAddress, sort }) => {
  const responce = await axiosInstance.get(`/collection/?address=${collectionAddress}&sort=${sort}`);
  return responce.data;
};

const token = localStorage.getItem('jwtToken');
const config = {
  headers: {
    jwt: token,
  },
};

export const addToFavoriteCollection = async ({ collectionAddress, explore }) => {
  const responce = await axiosInstance.get(
    `/set-explored-collection/?collection=${collectionAddress}&explore=${!explore}`,
    config
  );
  return responce.data;
};

export const loadTopCollections = async () => {
  const responce = await axiosInstance.get(`/explored-collections/`);
  return responce.data;
};
