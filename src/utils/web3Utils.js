import Web3 from 'web3';
import marketplaceERC721xJsonDev from '../abis/dev/ERC721Marketplace.json';
import marketplaceJsonDev from '../abis/dev/Marketplace.json';
import { marketplaceContractAddress } from './constants/variables';

export const initWeb3 = async () => {
  if (window.ethereum) {
    return new Web3(window.ethereum);
  } else {
    return new Web3('https://evm.moonrabbit.com');
  }
};

export const getActiveAccount = async () => {
  const web3 = window.ethereum;
  if (web3) {
    const web3 = new Web3(window.ethereum);
    const accounts = await web3.eth.getAccounts();
    return accounts[0] ?? null;
  }
  return null;
};

export const getEthBalance = async (address) => {
  const web3 = window.ethereum;
  if (web3) {
    const web3 = new Web3(window.ethereum);
    const amount = await web3.eth.getBalance(address);
    return parseFloat(parseFloat(web3.utils.fromWei(amount)).toFixed(3).slice(0, -1)) ?? 0;
  }
  return null;
};

export const getContractAbi = () => {
  return process.env.NODE_ENV === 'development'
    ? {
        marketplaceJson: marketplaceJsonDev,
        marketplaceERC721xJson: marketplaceERC721xJsonDev,
      }
    : {
        marketplaceJson: marketplaceJsonDev,
        marketplaceERC721xJson: marketplaceERC721xJsonDev,
      };
};

export const createContract = () => {
  if (window.ethereum) {
    const web3 = new Web3(window.ethereum);
    return new web3.eth.Contract(getContractAbi().marketplaceJson.abi, marketplaceContractAddress);
  } else {
    const web3 = new Web3('https://evm.moonrabbit.com');
    return new web3.eth.Contract(getContractAbi().marketplaceJson.abi, marketplaceContractAddress);
  }
};

export const metamaskEnabled = async () => {
  if (window.ethereum) {
    await window.ethereum.enable();
  }
};
