import {
  Box,
  Button,
  chakra,
  Flex,
  Heading,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Text,
  useDisclosure
} from '@chakra-ui/react';
import { useToast } from '@chakra-ui/toast';
import { Field, Form, Formik } from 'formik';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useHistory, useParams } from 'react-router';
import Web3 from 'web3';
import { ReactComponent as ConnectImg } from '../../../assets/images/icons/connect.svg';
import AlertMessage from '../../../ui-kit/AlertMessage/index';
import CustomAddonInput from '../../../ui-kit/CustomField/AddonInput/index';
import DateTimer from '../../../ui-kit/DateTimer';
import Error from '../../../ui-kit/Error/index';
import * as RoutePaths from '../../../utils/constants/routings';
import {
  AUCTION_TYPE,
  CREATOR,
  FIX_TYPE,
  marketplaceContractAddress,
  minStep,
  nullAddress,
  rpcUrl,
  TokenSaleStatus,
  TOKEN_NAME
} from '../../../utils/constants/variables';
import UserContext from '../../../utils/contexts/User';
import {
  buyToken,
  claimToken,
  getNFTClaimed,
  getNFTOwners,
  getOwnerAddress,
  getPastBids,
  listenBid,
  makeBid,
  returnToken,
  stopListing
} from '../../../utils/contractsApi/token';
import { shortAddress } from '../../../utils/helper';
import { ipfsUrl } from '../../../utils/ipfs';
import { getTokenInfo } from '../../../utils/requestApi/token';
import { metamaskEnabled } from '../../../utils/web3Utils';
import { StatWrapper } from '../styled-ui';
import NFTHistory from './history';
import ModalTokenInfo from './modal_token_info';
import NFT from './nft';
import TokenDetailsSkeleton from './skeleton';
import TransferToken from './transfer';
import BidSchema from './validation';

const NftDetails = () => {
  let history = useHistory();
  const { address } = useParams();
  const data = React.useContext(UserContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [stopListingLoading, setStopListingLoading] = useState(false);

  const [formData, setFormData] = useState('');
  const [error, setError] = useState();
  const toast = useToast();
  const [minimalBid, setMinimalBid] = useState(0);
  const [tokenInfo, setTokenInfo] = useState({
    name: '',
    marketplaceName: '',
    description: '',
    collectionAddress: '',
    imagePath: '',
    cachedImageUrl: '',
    listingStatus: '',
    claimer: '',
    owner: '',
    action: '',
    royalties: '',
    isExternal: '',
    minimalBid: '',
    listingInfo: {
      creator: '',
      duration: '',
      lastBid: '',
      lastBidder: '',
      timeStart: '',
    },
  });

  const [pastEvents, setPastEvents] = useState([]);
  const [ownerAddress, setOwnerAddress] = useState('');
  const [NFTOwners, setNFTOwners] = useState([]);
  const [isStartSelling, setStartSelling] = useState(false);
  const [highestBid, setHighestBid] = useState(0);
  const queryParams = address.split(':');
  const collectionAddress = queryParams[0];
  const tokenId = queryParams[1];
  const web3 = new Web3(rpcUrl);

  const handleBuyToken = async () => {
    setLoading(true);
    await buyToken({
      address: data.account.address,
      id: tokenId,
      collectionAddress,
      price: minimalBid,
      setError: (e) => {
        setError(e);
        setLoading(false);
      },
      cb: () => {
        setTimeout(() => getTokenInfoData(), 2000);
        succesTransactionToast();
      },
    });
    setLoading(false);
  };

  const cb = () => {
    history.push(`${RoutePaths.PROFILE}`);
  };

  const sendBidRequest = async () => {
    await makeBid({
      address: data.account.address,
      formData,
      tokenId,
      collectionAddress,
      setError: (e) => {
        setError(e);
        formData.actions.setSubmitting(false);
      },
      cb,
    });

    formData.actions.setSubmitting(false);
    setHighestBid(formData.values.bid);
    succesTransactionToast();
    getTokenInfoData();
    setMinimalBid(minStep + web3.utils.fromWei(minimalBid.toString()));
  };

  useEffect(() => {
    if (formData !== '') {
      sendBidRequest();
    }
  }, [formData]);

  const getTokenInfoData = () =>
    getTokenInfo({ collectionAddress, tokenId }).then((result) => {
      const {
        Collection,
        CreatorAddress,
        Duration,
        ListingType,
        MinimalBid,
        Owner,
        BlockStart,
        IsListedByOwner,
        LastBid,
        LastBidder,
        TimeStart,
        Name,
        Description,
        CollectionId,
        ImageURI,
        CachedImage,
        Claimer,
        Action,
        Royalties,
        IsExternal,
        ListingStatus,
        OriginSpaceName,
        AnimationURI,
        CachedAnimationImage,
      } = result;
      setHighestBid(web3.utils.fromWei(LastBid));
      if (window.ethereum) {
        getEvents(BlockStart);
      }

      setTokenInfo({
        name: Name,
        blockStart: BlockStart,
        marketplaceName: OriginSpaceName,
        description: Description,
        collectionAddress: CollectionId,
        imageUrl: CachedImage ? CachedImage : ipfsUrl + ImageURI.replace('ipfs://', ''),
        cachedImageUrl: CachedImage,
        listingStatus: ListingStatus,
        collectionName: Collection.Name,
        claimer: Claimer,
        animationURI: AnimationURI,
        cachedAnimationImage: CachedAnimationImage,
        action: Action,
        owner: Owner,
        minimalBid: MinimalBid,
        royalties: Royalties,
        isListedByOwner: IsListedByOwner,
        isExternal: IsExternal,
        listingInfo: {
          listingType: ListingType,
          creator: CreatorAddress,
          duration: Duration,
          lastBid: LastBid,
          lastBidder: LastBidder,
          timeStart: TimeStart,
        },
      });

      setMinimalBid(
        ListingType !== AUCTION_TYPE
          ? web3.utils.fromWei(MinimalBid, 'ether')
          : LastBid > 0
          ? parseInt(minStep) + parseInt(web3.utils.fromWei(LastBid))
          : parseInt(minStep) + parseInt(web3.utils.fromWei(MinimalBid))
      );
      getNFTOwnersList(CollectionId, CreatorAddress);
    });

  const getTransactionDate = async (blockNumber) => {
    const time = await web3.eth.getBlock(blockNumber);
    return time;
  };

  const getNFTOwnersList = async (collectionAddress, creator) => {
    let owners = [];

    if (creator !== nullAddress && creator !== '') {
      owners.push({
        address: creator,
        amount: '',
        blockNumber: '',
        type: CREATOR,
        timestamp: '',
      });
    }

    const nftOwners = await getNFTOwners({
      collectionAddress: collectionAddress,
      tokenId,
      setError: (e) => {
        setError(e);
      },
    });

    const clamedNFTList = await getNFTClaimed({
      collectionAddress: collectionAddress,
      tokenId,
      setError: (e) => {
        setError(e);
      },
    });

    await Promise.all(
      nftOwners.map(async (item) => {
        const transactionInfo = await getTransactionDate(item.blockNumber);
        owners.push({
          address: item.returnValues.newOwner,
          amount: web3.utils.fromWei(item.returnValues.payed),
          blockNumber: item.blockNumber,
          type: FIX_TYPE,
          timestamp: moment.unix(transactionInfo.timestamp).format('MM.DD.YYYY HH:mm'),
        });
      })
    );

    await Promise.all(
      clamedNFTList.map(async (item) => {
        const transactionInfo = await getTransactionDate(item.blockNumber);
        owners.push({
          address: item.returnValues.newOwner,
          amount: web3.utils.fromWei(item.returnValues.payed),
          blockNumber: item.blockNumber,
          type: AUCTION_TYPE,
          timestamp: moment.unix(transactionInfo.timestamp).format('MM.DD.YYYY HH:mm'),
        });
      })
    );

    setNFTOwners(owners);
  };

  useEffect(() => {
    if (data.contract) {
      setLoading(true);
      getTokenInfoData();
      setStartSelling(moment().unix() > tokenInfo.listingInfo.timeStart);
      setLoading(false);
    }
  }, [data]);

  const onSubmitHandler = React.useCallback((values, actions) => {
    setFormData({ values, actions });
  }, []);

  const handleClickCollection = () => {
    history.push(`${RoutePaths.COLLECTION}/${collectionAddress}`);
  };

  const handleStopListing = async () => {
    setStopListingLoading(true);
    await stopListing({
      collectionAddress: tokenInfo.collectionAddress,
      address: data.account.address,
      tokenId,
      setError: (e) => {
        setError(e);
        setStopListingLoading(false);
      },
      cb: (tokenId) => {
        getTokenInfoData();
      },
    });
    setStopListingLoading(false);
  };

  const handleReturnNft = async () => {
    setLoading(true);
    await returnToken({
      address: data.account.address,
      collectionAddress,
      tokenId,
      setError: (e) => {
        setError(e);
        setLoading(false);
      },
      cb: getTokenInfoData,
    });
    setLoading(false);
  };

  const handleClaimNft = async () => {
    setLoading(true);
    await claimToken({
      address: data.account.address,
      collectionAddress,
      tokenId,
      setError,
    });
    setLoading(false);
    getTokenInfoData();
    succesTransactionToast();
  };

  const handleResellNft = async () => {
    history.push(`${RoutePaths.RESELL}/${collectionAddress}:${tokenId}`);
  };

  const succesTransactionToast = () => {
    toast({
      title: 'The transaction was successful',
      position: 'bottom-right',
      isClosable: true,
      status: 'success',
    });
  };

  const getOwner = async () => {
    const result = await getOwnerAddress({ collectionAddress, tokenId });
    setOwnerAddress(result);
  };

  useEffect(() => {
    if (window.ethereum) {
      getOwner();
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const getEvents = (blockStart) => {
    getPastBids({ blockStart, collectionAddress, tokenId }).then((pastEventsArr) => {
      setPastEvents(pastEventsArr);
      listenBid({
        collectionAddress,
        tokenId,
        cb: (event) => {
          setPastEvents([...pastEventsArr, event]);
          setMinimalBid(web3.utils.fromWei((parseInt(event.returnValues.amount) + parseInt(minStep)).toString()));
          setHighestBid(minimalBid);
        },
      });
    });
  };

  return (
    <>
      {error && <AlertMessage type="error" title="Error" message={error} />}
      {tokenInfo.collectionAddress ? (
        <>
          <Helmet>
            <title>{tokenInfo.name + ' Moon Rabbit NFT Marketplace'}</title>
            <meta name="description" content={tokenInfo.description} />
            <meta property="og:title" content={tokenInfo.name + ' Moon Rabbit NFT Marketplace'} />
            <meta property="og:description" content={tokenInfo.description} />
          </Helmet>
          <Box maxWidth="1536px" m="0 auto" padding="60px 40px 180px 40px">
            <SimpleGrid
              columns={{ md: 'auto', lg: 2 }}
              columnGap={28}
              rowGap={10}
              // display={{ base: 'block', lg: imageLoaded ? 'grid' : 'none' }}
            >
              <NFT onOpen={onOpen} tokenInfo={tokenInfo} />
              <Flex flexDirection="column">
                <Heading color="white" pb="16px" pt={{ base: 4, lg: 0 }}>
                  {tokenInfo.name}
                </Heading>
                <Flex flexWrap="wrap" gridColumnGap={2}>
                  <Box bgColor="teal.200" placeSelf="flex-start" borderRadius="6px" pt={1} pb={1} pr={2} pl={2} mb={2}>
                    <chakra.span
                      cursor="pointer"
                      size="md"
                      color="black"
                      fontWeight={500}
                      onClick={() => handleClickCollection()}
                    >
                      From {!tokenInfo.isExternal ? `"${tokenInfo.collectionName}"` : 'external'} collection
                    </chakra.span>
                  </Box>
                  {tokenInfo.royalties && (
                    <Box bgColor="gray.400" placeSelf="flex-start" borderRadius="6px" pt={1} pb={1} pr={2} pl={2}>
                      <chakra.span
                        cursor="pointer"
                        size="md"
                        color="white"
                        fontWeight={500}
                        onClick={() => handleClickCollection()}
                      >
                        Royalties {web3.utils.fromWei((parseInt(tokenInfo.royalties) * 100).toString())}%
                      </chakra.span>
                    </Box>
                  )}
                </Flex>
                {(ownerAddress || tokenInfo.listingInfo.creator) && (
                  <Text
                    fontSize={16}
                    fontWeight="bold"
                    color="gray.500"
                    pt={4}
                    cursor="pointer"
                    onClick={() =>
                      history.push({
                        pathname: `${RoutePaths.PROFILE_PAGE}/${
                          tokenInfo.owner === marketplaceContractAddress
                            ? tokenInfo.listingInfo.creator
                            : tokenInfo.owner
                        }`,
                        state: {
                          tab: 'nfts',
                          page: 'home',
                        },
                      })
                    }
                  >
                    Owner:{' '}
                    {tokenInfo.owner === marketplaceContractAddress
                      ? shortAddress(tokenInfo.listingInfo.creator)
                      : shortAddress(tokenInfo.owner)}
                  </Text>
                )}

                <Text color="gray.500" pt={2}>
                  {' '}
                  {tokenInfo.description}
                </Text>
                {tokenInfo.listingStatus !== TokenSaleStatus.USER_PROFILE && (
                  <>
                    <Flex pt={6} flexWrap="wrap">
                      {tokenInfo.listingInfo.listingType === AUCTION_TYPE &&
                        tokenInfo.listingStatus !== TokenSaleStatus.STORAGE && (
                          <Box flex={{ base: 1, sm: 1, md: 1 }} minWidth="230px" pb={6} pr={{ base: 0, lg: 6 }}>
                            <StatWrapper>
                              <Stat>
                                <StatLabel color="gray.500">Highest bid</StatLabel>
                                <StatNumber fontSize={24} fontWeight={800} lineHeight="32px">
                                  <Text color="white">
                                    {highestBid} {TOKEN_NAME}{' '}
                                  </Text>
                                </StatNumber>
                              </Stat>
                            </StatWrapper>
                          </Box>
                        )}

                      <Box flex={{ base: 1, sm: 1, md: 1 }} minWidth="270px" pb={6}>
                        <DateTimer
                          startDate={tokenInfo.listingInfo.timeStart}
                          endDate={parseInt(tokenInfo.listingInfo.timeStart) + parseInt(tokenInfo.listingInfo.duration)}
                          cb={getTokenInfoData}
                        />
                      </Box>
                    </Flex>
                  </>
                )}

                {tokenInfo.listingInfo.listingType === FIX_TYPE &&
                  (tokenInfo.listingStatus === TokenSaleStatus.SALE ||
                    tokenInfo.listingStatus === TokenSaleStatus.SECONDARY_MARKET) && (
                    <Flex
                      alignItems={{ base: 'start', lg: 'center' }}
                      flexFlow={{ base: 'column wrap', lg: 'row wrap' }}
                    >
                      {moment() > moment(moment.unix(tokenInfo.listingInfo.timeStart).toDate()) && (
                        <>
                          {window.ethereum ? (
                            <Button
                              variant="with-shadow"
                              colorScheme="teal"
                              color="black"
                              size="lg"
                              onClick={() => handleBuyToken()}
                              isLoading={loading}
                              loadingText={'Buying...'}
                              mr={2}
                            >
                              Buy for {minimalBid} {TOKEN_NAME}
                            </Button>
                          ) : (
                            <Text fontSize={20} color="white">
                              Buy for{' '}
                              <strong>
                                {minimalBid} {TOKEN_NAME}
                              </strong>
                            </Text>
                          )}
                        </>
                      )}

                      {tokenInfo.listingInfo.creator === data.account.address && tokenInfo.listingInfo.lastBid === '0' && (
                        <Button
                          variant="solid"
                          bg="red.500"
                          colorScheme="red"
                          size="lg"
                          isLoading={stopListingLoading}
                          disabled={stopListingLoading}
                          loadingText=" Stopping..."
                          onClick={() => handleStopListing()}
                          mt={{ base: 2, lg: 0 }}
                        >
                          Stop Listing
                        </Button>
                      )}
                    </Flex>
                  )}
                {tokenInfo.listingStatus === TokenSaleStatus.STORAGE && tokenInfo.minimalBid !== '' && (
                  <Text color="gray.900" fontSize="24px" fontWeight="800">
                    {tokenInfo.listingInfo.lastBidder !== nullAddress
                      ? `Selling for ${minimalBid} ${TOKEN_NAME}`
                      : ' Not selling'}
                  </Text>
                )}

                {window.ethereum &&
                  tokenInfo.listingInfo.listingType === AUCTION_TYPE &&
                  (tokenInfo.listingStatus === TokenSaleStatus.SALE ||
                    tokenInfo.listingStatus === TokenSaleStatus.SECONDARY_MARKET) && (
                    <Flex pt={2} pb={2}>
                      {data.account.address ? (
                        <Formik
                          enableReinitialize
                          validationSchema={BidSchema}
                          initialValues={{ bid: minimalBid }}
                          validate={(values) => {
                            const errors = {};
                            if (!values.bid) {
                              errors.bid = 'Required';
                            }

                            return errors;
                          }}
                          onSubmit={onSubmitHandler}
                        >
                          {({
                            values,
                            errors,
                            touched,
                            handleChange,
                            handleBlur,
                            handleSubmit,
                            isSubmitting,
                            setFieldValue,
                          }) => (
                            <>
                              <Form onSubmit={handleSubmit}>
                                <Flex>
                                  {moment() > moment(moment.unix(tokenInfo.listingInfo.timeStart).toDate()) && (
                                    <>
                                      <Flex flexDirection="column">
                                        <Flex flexDirection="row">
                                          <Field
                                            id="bid"
                                            component={CustomAddonInput}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            type="text"
                                            name="bid"
                                            value={values.bid}
                                            autoComplete="off"
                                            addon={TOKEN_NAME}
                                            minW={{ base: '100px', lg: '235px' }}
                                            w={{ base: '80px' }}
                                          />

                                          <Button
                                            ml={4}
                                            mr={4}
                                            type="submit"
                                            disabled={isSubmitting || !isStartSelling}
                                            colorScheme="teal"
                                            color="black"
                                            variant="solid-bg"
                                            size="md"
                                            isLoading={isSubmitting}
                                            loadingText="Submitting"
                                          >
                                            Place a Bid
                                          </Button>
                                        </Flex>
                                        <Box>
                                          {errors.bid && touched.bid && errors.bid && <Error>{errors.bid}</Error>}
                                        </Box>
                                      </Flex>
                                    </>
                                  )}

                                  {tokenInfo.listingInfo.creator === data.account.address &&
                                    tokenInfo.listingInfo.lastBid === '0' && (
                                      <Button
                                        variant="solid"
                                        bg="red.500"
                                        colorScheme="red"
                                        size="md"
                                        isLoading={stopListingLoading}
                                        disabled={stopListingLoading}
                                        loadingText="Stopping..."
                                        onClick={() => handleStopListing()}
                                      >
                                        Stop Listing
                                      </Button>
                                    )}
                                </Flex>
                              </Form>
                            </>
                          )}
                        </Formik>
                      ) : (
                        <Box>
                          <Button
                            leftIcon={<ConnectImg />}
                            variant="outline"
                            colorScheme="black"
                            color="teal.200"
                            onClick={metamaskEnabled}
                          >
                            Connect to wallet
                          </Button>
                        </Box>
                      )}
                    </Flex>
                  )}

                {tokenInfo.listingStatus === TokenSaleStatus.USER_PROFILE && (
                  <>
                    {data.account.address !== tokenInfo.claimer &&
                      data.account.address !== tokenInfo.owner &&
                      tokenInfo.action !== 'return' &&
                      tokenInfo.minimalBid !== '0' && (
                        <Text color="white" fontSize="24px" fontWeight="800" pt="24px">
                          Sold{' '}
                          {tokenInfo.listingInfo.lastBid !== '0' &&
                            `for ${web3.utils.fromWei(tokenInfo.listingInfo.lastBid)} ${TOKEN_NAME}`}
                        </Text>
                      )}

                    {tokenInfo.owner === data.account.address && (
                      <Flex pt={4}>
                        <Button
                          colorScheme="teal"
                          color="black"
                          variant="solid-bg"
                          size="lg"
                          onClick={() => handleResellNft()}
                        >
                          Sell
                        </Button>
                      </Flex>
                    )}

                    {tokenInfo.claimer === data.account.address && tokenInfo.action === 'claim' && (
                      <Flex pt={4}>
                        <Button
                          colorScheme="teal"
                          color="black"
                          variant="solid-bg"
                          size="lg"
                          isLoading={loading}
                          loadingText="Claiming..."
                          onClick={() => handleClaimNft()}
                        >
                          Claim NFT
                        </Button>
                      </Flex>
                    )}

                    {tokenInfo.claimer === data.account.address && tokenInfo.action === 'return' && (
                      <>
                        <Flex>
                          <Flex pt={4} pr={4}>
                            <Button
                              colorScheme="teal"
                              color="black"
                              variant="solid-bg"
                              isLoading={loading}
                              loadingText="Returning"
                              size="lg"
                              onClick={handleReturnNft}
                            >
                              Return NFT
                            </Button>
                          </Flex>
                          <Flex pt={4}>
                            <Button
                              colorScheme="teal"
                              color="black"
                              variant="solid-bg"
                              size="lg"
                              onClick={() => handleResellNft()}
                            >
                              Sell
                            </Button>
                          </Flex>
                        </Flex>
                      </>
                    )}
                  </>
                )}

                {tokenInfo.owner === data.account.address && (
                  <Flex pt={4}>
                    <TransferToken
                      setError={setError}
                      succesTransactionToast={succesTransactionToast}
                      getTokenInfoData={getTokenInfoData}
                      tokenId={tokenId}
                      fromAddress={data.account.address}
                      collectionAddress={collectionAddress}
                    />
                  </Flex>
                )}

                {tokenInfo.listingStatus === TokenSaleStatus.STORAGE &&
                  tokenInfo.listingInfo.creator === data.account.address &&
                  tokenInfo.isListedByOwner && (
                    <Flex pt={4}>
                      <Button
                        colorScheme="teal"
                        color="black"
                        variant="solid-bg"
                        size="lg"
                        onClick={() => handleResellNft()}
                      >
                        Sell
                      </Button>
                    </Flex>
                  )}

                <NFTHistory
                  NFTOwners={NFTOwners}
                  data={data}
                  pastEvents={pastEvents}
                  tokenInfo={tokenInfo}
                ></NFTHistory>
              </Flex>
            </SimpleGrid>
          </Box>

          <ModalTokenInfo isOpen={isOpen} onClose={onClose} tokenInfo={tokenInfo} />
        </>
      ) : (
        <TokenDetailsSkeleton />
      )}
    </>
  );
};

export default NftDetails;
