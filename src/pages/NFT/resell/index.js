import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Input,
  Skeleton,
  Spacer,
  Stat,
  StatLabel,
  Tab,
  TabList,
  Tabs,
  Text,
  Textarea,
} from '@chakra-ui/react';
import { useToast } from '@chakra-ui/toast';
import { Field, Formik } from 'formik';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useHistory } from 'react-router-dom';
import Web3 from 'web3';
import CollectionBoxInfo from '../../../components/Collection/collection';
import AlertMessage from '../../../ui-kit/AlertMessage/index';
import CustomAddonInput from '../../../ui-kit/CustomField/AddonInput';
import DatePickerField from '../../../ui-kit/DatePicker';
import Error from '../../../ui-kit/Error/index';
import * as RoutePaths from '../../../utils/constants/routings';
import {
  AUCTION_PRICE_NFT,
  FIX_PRICE_NFT,
  marketplaceContractAddress,
  TOKEN_NAME,
} from '../../../utils/constants/variables';
import UserContext from '../../../utils/contexts/User';
import { checkAllowanceNft } from '../../../utils/contractsApi/collection';
import { resellToken } from '../../../utils/contractsApi/token';
import { ipfsUrl } from '../../../utils/ipfs';
import { getTokenInfo } from '../../../utils/requestApi/token';
import { getContractAbi } from '../../../utils/web3Utils';
import { FormGrid, UploadedCoverImageFullSize, UploadedCoverWrapper } from '../../Marketplaces/styled-ui';
import { StatWrapper } from '../styled-ui';
import { NftResellSchema } from '../validation';

const nftTypes = [FIX_PRICE_NFT, AUCTION_PRICE_NFT];

const NftResell = () => {
  let history = useHistory();
  const { id } = useParams();
  const data = React.useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState('');
  const [tabIndex, setTabIndex] = useState(0);
  const [allowanceNft, setAllowanceNft] = useState(false);
  const [marketplaceAddress, setMarketplaceAddress] = useState(null);
  const [error, setError] = useState();
  const toast = useToast();
  const { updateUserData } = data.account;
  const [tokenInfo, setTokenInfo] = useState({
    name: '',
    description: '',
    collectionAddress: '',
    imagePath: '',
    cachedImage: '',
    listingStatus: '',
    creator: '',
    spaceOwner: '',
    owner: '',
    ListingStatus: '',
    listingInfo: {
      duration: '',
      lastBid: '',
      lastBidder: '',
      minimalBid: '',
      timeStart: '',
    },
  });

  const queryParams = id.split(':');
  const collectionAddress = queryParams[0];
  const tokenId = queryParams[1];

  const textLabels = [
    { price: 'Price', startDate: 'Sale start', endDate: 'Sale end ' },
    { price: 'Starting price', startDate: 'Auction start', endDate: 'Auction end' },
  ];

  const label = textLabels[tabIndex];

  const handleResellToken = async () => {
    await resellToken({
      collectionAddress,
      address: data.account.address,
      tokenId,
      formData,
      type: nftTypes[tabIndex],
      marketplaceAddress,
      setError: (e) => {
        setError(e);
        formData.actions.setSubmitting(false);
      },
      cb,
    });
  };

  const succesTransactionToast = () => {
    toast({
      title: 'The transaction was successful',
      position: 'bottom-right',
      isClosable: true,
      status: 'success',
    });
  };

  const cb = () => {
    succesTransactionToast();
    updateUserData();
    history.push({
      pathname: `${RoutePaths.NFT}/${collectionAddress}:${tokenId}`,
      state: {
        imageUrl: tokenInfo.cachedImage
          ? encodeURI(tokenInfo.cachedImage)
          : encodeURI(`${ipfsUrl}${tokenInfo.ImageURI.replace('ipfs://', '')}`),
      },
    });
  };

  useEffect(() => {
    if (formData !== '') {
      handleResellToken();
    }
  }, [formData]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const onSubmitHandler = React.useCallback((values, actions) => {
    setFormData({ values, actions });
  }, []);

  useEffect(() => {
    if (data.account.address && data.contract) {
      getTokenInfo({ collectionAddress, tokenId }).then((result) => {
        const {
          Name,
          Description,
          CollectionId,
          ImageURI,
          SpaceAddress,
          SpaceOwner,
          ListingStatus,
          CreatorAddress,
          CachedImage,
          Owner,
        } = result;
        const { AvatarURI, Name: CollectionName, Symbol } = result.Collection;
        setMarketplaceAddress(SpaceAddress);
        setTokenInfo({
          name: Name,
          spaceOwner: SpaceOwner,
          listingStatus: ListingStatus,
          description: Description,
          collectionAddress: CollectionId,
          imageUrl: ipfsUrl + ImageURI,
          creator: CreatorAddress,
          cachedImage: CachedImage,
          owner: Owner,
          collectionInfo: {
            imagePath: AvatarURI,
            name: CollectionName,
            symbol: Symbol,
          },
        });
      });
    }
  }, [data]);

  const approveNft = async () => {
    if (data.account.address) {
      setLoading(true);
      const web3 = new Web3(window.ethereum);
      const marketplaceERC721Contract = new web3.eth.Contract(
        getContractAbi().marketplaceERC721xJson.abi,
        collectionAddress
      );

      await marketplaceERC721Contract.methods
        .approve(marketplaceContractAddress, tokenId)
        .send({ from: data.account.address })

        .on('receipt', function (receipt) {
          setAllowanceNft(true);
          succesTransactionToast();
          setLoading(false);
        })
        .on('error', (error) => {
          setError(error.message);
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    if (data.account.address) {
      checkAllowanceNft({
        userAddress: data.account.address,
        collectionAddress,
        tokenId,
        cb: setAllowanceNft,
      });
    }
  }, [data.account.address]);

  const initialValues = {
    price: '',
    startDate: moment().toDate(),
    endDate: moment().add(1, 'h').toDate(),
    stake: '',
  };

  return (
    <>
      {error && <AlertMessage type="error" title="Error" message={error} />}
      <Container pt={16}>
        <Heading textAlign="center" color="white">
          SELL NFT
        </Heading>

        <Box maxWidth="588px" margin="0 auto" padding={8} display="flex" justifyContent="center" pb={'90px'}>
          <Box w="384px">
            <Formik
              initialValues={initialValues}
              validationSchema={NftResellSchema}
              validateOnChange={false}
              onSubmit={onSubmitHandler}
            >
              {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, setFieldValue }) => (
                <FormGrid onSubmit={handleSubmit}>
                  <Box w="full">
                    {tokenInfo.imageUrl || tokenInfo.cachedImage ? (
                      <UploadedCoverWrapper>
                        <UploadedCoverImageFullSize
                          src={
                            tokenInfo.cachedImage
                              ? encodeURI(tokenInfo.cachedImage)
                              : encodeURI(tokenInfo.imageUrl.replace('ipfs://', ''))
                          }
                        />
                      </UploadedCoverWrapper>
                    ) : (
                      <Skeleton h={400} />
                    )}
                  </Box>
                  <Box>
                    <Text mb="8px" color="gray.500">
                      Name
                    </Text>
                    <Input color="white" isDisabled isReadOnly value={tokenInfo.name} />
                  </Box>
                  <Box>
                    <Text mb="8px" color="gray.500">
                      Description
                    </Text>
                    <Textarea color="white" isDisabled isReadOnly value={tokenInfo.description} resize="none" />
                  </Box>
                  <Box>
                    <Text mb="8px" color="gray.500">
                      Collection
                    </Text>
                    {tokenInfo.collectionInfo && <CollectionBoxInfo collectionInfo={tokenInfo.collectionInfo} />}
                  </Box>
                  <Tabs variant="soft-rounded" colorScheme="teal" onChange={(index) => setTabIndex(index)}>
                    <TabList>
                      <Tab>Fixed Price</Tab>
                      <Tab>NFT Auction</Tab>
                    </TabList>
                  </Tabs>
                  <Box>
                    <Field
                      id="price"
                      component={CustomAddonInput}
                      type="text"
                      name="price"
                      label={label.price}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.price}
                      addon={TOKEN_NAME}
                    />
                    {errors.price && touched.price && <Error>{errors.price}</Error>}
                  </Box>
                  <Flex>
                    <Box w="184px">
                      <Field
                        id="startDate"
                        component={DatePickerField}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        setFieldValue={setFieldValue}
                        type="text"
                        name="startDate"
                        value={values.startDate}
                        autoComplete="off"
                        label={label.startDate}
                      />
                      {errors.startDate && touched.startDate && <Error>{errors.startDate}</Error>}
                    </Box>
                    <Spacer />
                    <Box width="184px">
                      <Field
                        id="endDate"
                        component={DatePickerField}
                        onChange={handleChange}
                        setFieldValue={setFieldValue}
                        onBlur={handleBlur}
                        type="text"
                        name="endDate"
                        value={values.endDate}
                        autoComplete="off"
                        label={label.endDate}
                      />
                      {errors.endDate && touched.endDate && <Error>{errors.endDate}</Error>}
                    </Box>
                  </Flex>

                  <Box>
                    <StatWrapper>
                      <Stat>
                        <StatLabel color="gray.500">Your NFT will be listed until</StatLabel>
                        <Flex alignItems="baseline">
                          <Box color="white" fontSize={'2xl'} fontWeight={600}>
                            {moment(values.endDate).format('MMMM D, YYYY, HH:mm')}
                          </Box>
                        </Flex>
                      </Stat>
                    </StatWrapper>
                  </Box>

                  {!allowanceNft && tokenInfo.owner !== marketplaceContractAddress ? (
                    <Button
                      variant="solid"
                      bg="teal.200"
                      size="lg"
                      colorScheme="teal.200"
                      color="black"
                      isLoading={loading}
                      loadingText="Approving NFT"
                      onClick={() => approveNft()}
                    >
                      Approve NFT
                    </Button>
                  ) : (
                    <Button
                      id="createNFT"
                      type="submit"
                      color="black"
                      disabled={isSubmitting}
                      variant="solid"
                      bg="teal.200"
                      size="lg"
                      colorScheme="teal.200"
                      isLoading={isSubmitting}
                      loadingText="Submitting"
                    >
                      Sell NFT
                    </Button>
                  )}
                </FormGrid>
              )}
            </Formik>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default NftResell;
