import Web3 from 'web3';
import { marketplaceContractAddress } from '../constants/variables';
import { getContractAbi } from '../web3Utils';

export const createCollection = async ({ address, name, symbol, collectionURI, setError, cb }) => {
  const web3 = window.ethereum;

  if (web3) {
    const web3 = new Web3(window.ethereum);
    const marketplaceContract = new web3.eth.Contract(getContractAbi().marketplaceJson.abi, marketplaceContractAddress);

    await marketplaceContract.methods
      .createCollection(collectionURI, name, symbol)
      .send({ from: address })

      .on('receipt', function (receipt) {
        cb(receipt.events.CollectionCreated.returnValues[0]);
      })
      .on('error', (error) => setError(error.message));
  } else {
    window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
  }
};

export const checkAllowanceNft = async ({ collectionAddress, tokenId, cb }) => {
  const web3 = new Web3(window.ethereum);
  if (web3) {
    const marketplaceContract = new web3.eth.Contract(getContractAbi().marketplaceERC721xJson.abi, collectionAddress);
    await marketplaceContract.methods
      .getApproved(tokenId)
      .call()
      .then((address) => {
        cb(address === marketplaceContractAddress);
      })
      .catch((e: any) => console.error(e));
  } else {
    window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
  }
};
