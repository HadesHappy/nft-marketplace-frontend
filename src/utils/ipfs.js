const { create } = require('ipfs-http-client');
const axios = require('axios');

export const ipfs = create({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });
export const ipfsUrl = 'https://radrabbit.mypinata.cloud/ipfs/';
export const ipfsUrlOld = 'https://ipfs.io/ipfs/';

export const getMarketpaceData = async (cid) => {
  const marketplaceData = await getFile(cid);

  return {
    name: marketplaceData.name,
    description: marketplaceData.description,
    avatarUrl: marketplaceData.avatarImg,
    backgroundImg: marketplaceData.backgroundImg,
  };
};

export const getFile = async (cid) => {
  try {
    const response = await axios.get(ipfsUrl + cid);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const prepareFileToIpfs = (file, cb) => {
  const reader = new window.FileReader();
  reader.readAsArrayBuffer(file);
  reader.onloadend = async () => {
    await cb(Buffer(reader.result));
  };
};
