import moment from 'moment';
import Web3 from 'web3';
import { FIX_PRICE_NFT, marketplaceContractAddress } from '../constants/variables';
import { getDuration } from '../helper';
import { getContractAbi } from '../web3Utils';

export const createToken = async ({ address, tokenURI, formData, type, marketplaceAddress, setError, cb }) => {
  const web3 = new Web3(window.ethereum);
  if (web3) {
    const { collectionAddress, startDate, endDate, price, royalty, isPublishNow } = formData.values;
    const marketplaceERC721Contract = new web3.eth.Contract(
      getContractAbi().marketplaceERC721xJson.abi,
      collectionAddress
    );

    if (isPublishNow) {
      const marketplaceContract = new web3.eth.Contract(
        getContractAbi().marketplaceJson.abi,
        marketplaceContractAddress
      );

      const duration = getDuration(startDate, endDate);
      const weiPrice = web3.utils.toWei(price, 'Ether');

      const marketplaceContractMethod =
        type === FIX_PRICE_NFT
          ? marketplaceContract.methods.createNFTWithFixedPrice
          : marketplaceContract.methods.createNFTWithAuction;

      await marketplaceContractMethod(
        collectionAddress,
        tokenURI,
        moment.utc(startDate).unix(),
        duration,
        weiPrice.toString(),
        (Math.pow(10, 16) * royalty).toString()
      )
        .send({ from: address })

        .on('receipt', async (receipt) => {
          cb(parseInt(receipt.events.ListingStarted.returnValues.tokenId));
        })
        .on('error', (error) => setError(error.message));
    } else {
      await marketplaceERC721Contract.methods
        .mint(tokenURI, address, address, (Math.pow(10, 16) * royalty).toString())
        .send({ from: address })

        .on('receipt', async (receipt) => {
          cb(parseInt(receipt.events.Transfer.returnValues.tokenId));
        })
        .on('error', (error) => setError(error.message));
    }
  }
};

export const resellToken = async ({
  address,
  tokenId,
  formData,
  type,
  marketplaceAddress,
  collectionAddress,
  setError,
  cb,
}) => {
  if (window.ethereum) {
    const web3 = new Web3(window.ethereum);
    const { startDate, endDate, price } = formData.values;
    const marketplaceContract = new web3.eth.Contract(getContractAbi().marketplaceJson.abi, marketplaceContractAddress);

    const duration = getDuration(startDate, endDate);
    const weiPrice = web3.utils.toWei(price, 'Ether');

    const marketplaceContractMethod =
      type === FIX_PRICE_NFT ? marketplaceContract.methods.startFixedPrice : marketplaceContract.methods.startAuction;

    await marketplaceContractMethod(
      collectionAddress,
      tokenId.toString(),
      moment.utc(startDate).unix(),
      duration,
      weiPrice.toString()
    )
      .send({ from: address })
      .on('receipt', async (receipt) => {
        cb();
      })
      .on('error', (error) => setError(error.message));
  }
};

export const buyToken = async ({ address, collectionAddress, id, price, setError, cb }) => {
  const web3 = new Web3(window.ethereum);
  if (web3) {
    const weiPrice = web3.utils.toWei(price, 'Ether');
    const marketplaceContract = new web3.eth.Contract(getContractAbi().marketplaceJson.abi, marketplaceContractAddress);

    await marketplaceContract.methods
      .purchase(collectionAddress, id)
      .send({ from: address, value: weiPrice })
      .on('receipt', async (receipt) => {
        cb();
      })
      .on('error', (error) => setError(error.message));
  }
};

export const makeBid = async ({ address, formData, tokenId, collectionAddress, setError }) => {
  const web3 = new Web3(window.ethereum);
  if (web3) {
    const marketplaceContract = new web3.eth.Contract(getContractAbi().marketplaceJson.abi, marketplaceContractAddress);
    const weiBid = web3.utils.toWei(formData.values.bid.toString(), 'Ether');

    await marketplaceContract.methods
      .bid(collectionAddress, tokenId)
      .send({ from: address, value: weiBid })
      .on('error', (error) => setError(error.message));
  }
};

export const claimToken = async ({ address, collectionAddress, tokenId, setError }) => {
  const web3 = new Web3(window.ethereum);
  if (web3) {
    const marketplaceContract = new web3.eth.Contract(getContractAbi().marketplaceJson.abi, marketplaceContractAddress);

    await marketplaceContract.methods
      .claimNFT(collectionAddress, tokenId)
      .send({ from: address })
      .on('error', (error) => setError(error.message));
  }
};

export const getPastBids = async ({ collectionAddress, blockStart, tokenId, cb }) => {
  const web3 = new Web3(window.ethereum);
  if (web3) {
    const marketplaceContract = new web3.eth.Contract(getContractAbi().marketplaceJson.abi, marketplaceContractAddress);

    const filterParams = {
      collection: collectionAddress,
      tokenId: tokenId,
    };

    return await marketplaceContract.getPastEvents('AuctionBid', {
      filter: filterParams,
      fromBlock: blockStart ? blockStart : 0,
      toBlock: 'latest',
    });
  }
};

export const listenBid = async ({ collectionAddress, tokenId, cb }) => {
  const web3 = new Web3(window.ethereum);
  if (web3) {
    const marketplaceContract = new web3.eth.Contract(getContractAbi().marketplaceJson.abi, marketplaceContractAddress);

    const filterParams = {
      collection: collectionAddress,
      tokenId: tokenId,
    };

    await marketplaceContract.events
      .AuctionBid({
        filter: filterParams,
        fromBlock: 'latest',
      })
      .on('data', function (event) {
        cb(event);
      })
      .on('error', console.error);
  }
};

export const returnToken = async ({ address, collectionAddress, tokenId, setError, cb }) => {
  const web3 = new Web3(window.ethereum);
  if (web3) {
    const marketplaceJsonContract = new web3.eth.Contract(
      getContractAbi().marketplaceJson.abi,
      marketplaceContractAddress
    );

    await marketplaceJsonContract.methods
      .returnFromSale(collectionAddress, tokenId)
      .send({ from: address })
      .on('receipt', async (receipt) => {
        cb();
      })
      .on('error', (error) => setError(error.message));
  }
};

export const sendTokenToUser = async ({ fromAddress, toAddress, tokenId, setError, collectionAddress, cb }) => {
  const web3 = new Web3(window.ethereum);
  if (web3) {
    const marketplaceERC721Contract = new web3.eth.Contract(
      getContractAbi().marketplaceERC721xJson.abi,
      collectionAddress
    );
    await marketplaceERC721Contract.methods
      .transferFrom(fromAddress, toAddress, tokenId)
      .send({ from: fromAddress })
      .on('receipt', async (receipt) => {
        cb();
      })
      .on('error', (error) => setError(error.message));
  }
};

export const getOwnerAddress = async ({ collectionAddress, tokenId }) => {
  const web3 = new Web3(window.ethereum);
  if (web3) {
    const marketplaceERC721Contract = new web3.eth.Contract(
      getContractAbi().marketplaceERC721xJson.abi,
      collectionAddress
    );
    const address = await marketplaceERC721Contract.methods.ownerOf(tokenId).call();
    return address;
  }
};

export const stopListing = async ({ collectionAddress, tokenId, address, setError, cb }) => {
  const web3 = new Web3(window.ethereum);
  console.log('collectionAddress, tokenId, address', collectionAddress, tokenId, address);
  if (web3) {
    const marketplaceContract = new web3.eth.Contract(getContractAbi().marketplaceJson.abi, marketplaceContractAddress);

    await marketplaceContract.methods
      .stopListing(collectionAddress, tokenId)
      .send({ from: address })
      .on('receipt', function (receipt) {
        cb();
      })
      .on('error', (error) => setError(error.message));
    return address;
  }
};
