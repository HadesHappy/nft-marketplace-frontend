import axiosInstance from '../axios';

export const getCollectionInfo = async ({ collectionAddress, sort }) => {
  const responce = await axiosInstance.get(`/collection/?address=${collectionAddress}&sort=${sort}`);
  return responce.data;
};
