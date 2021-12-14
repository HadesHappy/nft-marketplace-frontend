import { AddIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Checkbox,
  Container,
  Flex,
  Heading,
  SimpleGrid,
  Skeleton,
  SkeletonCircle,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Spacer,
  Stat,
  StatLabel,
  Tab,
  TabList,
  Tabs,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { useToast } from '@chakra-ui/toast';
import { Field, Formik } from 'formik';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { ReactComponent as CloseImg } from '../../../assets/images/icons/close.svg';
import CollectionBoxInfo from '../../../components/Collection/collection';
import AlertMessage from '../../../ui-kit/AlertMessage/index';
import CustomAddonInput from '../../../ui-kit/CustomField/AddonInput';
import CustomFileInput from '../../../ui-kit/CustomField/FileInput';
import CustomTextarea from '../../../ui-kit/CustomField/Textarea';
import DatePickerField from '../../../ui-kit/DatePicker';
import Error from '../../../ui-kit/Error/index';
import CustomInput from '../../../ui-kit/Input/index';
import * as RoutePaths from '../../../utils/constants/routings';
import { AUCTION_PRICE_NFT, FIX_PRICE_NFT, TOKEN_NAME } from '../../../utils/constants/variables';
import UserContext from '../../../utils/contexts/User';
import { createToken } from '../../../utils/contractsApi/token';
import { ipfs, prepareFileToIpfs } from '../../../utils/ipfs';
import { getMarketplaceCollections } from '../../../utils/requestApi/marketplace';
import { isNftAvailable } from '../../../utils/requestApi/token';
import CreateCollectionModal from '../../Collection/create';
import { FormGrid, UploadedCoverImageFullSize } from '../../Marketplaces/styled-ui';
import { StatWrapper } from '../styled-ui';
import { NftSchema } from '../validation';
const nftTypes = [FIX_PRICE_NFT, AUCTION_PRICE_NFT];

const CreateNft = () => {
  let history = useHistory();
  const data = React.useContext(UserContext);
  const [nftImageBuffer, setNftImageBuffer] = useState(null);
  const [formData, setFormData] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [tabIndex, setTabIndex] = useState(0);
  const [error, setError] = useState();
  const [marketplaceCollections, setMarketplaceCollections] = useState([]);
  const { address, updateUserData } = data.account;
  const toast = useToast();
  const [loading, setLoading] = useState(true);

  const textLabels = [
    { price: 'Price', startDate: 'Start of the sale', endDate: 'End of the sale ' },
    { price: 'Starting price', startDate: 'Auction start', endDate: 'Auction end' },
  ];

  const label = textLabels[tabIndex];

  const addCollectionToArray = (collection) => {
    setMarketplaceCollections([...marketplaceCollections, collection]);
  };

  const addData = async (buffer) => {
    const basename = formData.values.nftImage[0].name;
    const ipfsPath = '/nft/' + basename;
    const { cid: assetCid } = await ipfs.add({ path: ipfsPath, content: buffer });
    const { name, description } = formData.values;

    const jsonData = JSON.stringify({
      description,
      external_url: 'https://nft.moonrabbit.com',
      image: `ipfs://${assetCid}/${basename}`,
      name,
    });

    const { cid: metadataCid } = await ipfs.add({ path: '/nft/metadata.json', content: jsonData });
    const metadataURI = metadataCid + '/metadata.json';

    await createToken({
      address,
      tokenURI: metadataURI,
      formData,
      type: nftTypes[tabIndex],
      setError: (e) => {
        setError(e);
        formData.actions.setSubmitting(false);
      },
      cb: (tokenId) => {
        const collectionAddress = formData.values.collectionAddress;
        isNftAvailable({ tokenId, collectionAddress })
          .then((response) => {
            succesTransactionToast();
            updateUserData();
            history.push({
              pathname: `${RoutePaths.NFT}/${collectionAddress}:${tokenId}`,
              state: { imageUrl: null },
            });
          })
          .catch((e: any) => isNftAvailable({ tokenId, collectionAddress }));
      },
    });
  };

  const getCollections = async () => {
    getMarketplaceCollections({ address: data.account.address }).then((collections) => {
      const array = [];

      collections.map((e) =>
        array.push({
          collectionAddress: e.Id,
          imagePath: e.AvatarURI,
          name: e.CollectionName,
          symbol: e.Symbol,
        })
      );
      setMarketplaceCollections(array);
    });
  };

  useEffect(() => {
    if (nftImageBuffer) {
      addData(nftImageBuffer);
    }
  }, [nftImageBuffer]);

  useEffect(() => {
    if (formData !== '' && formData.values.nftImage[0]) {
      prepareFileToIpfs(formData.values.nftImage[0], setNftImageBuffer);
    }
  }, [formData]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const succesTransactionToast = () => {
    toast({
      title: 'The transaction was successful',
      position: 'bottom-right',
      isClosable: true,
      status: 'success',
    });
  };

  const onSubmitHandler = React.useCallback((values, actions) => {
    setFormData({ values, actions });
  }, []);

  useEffect(() => {
    if (data.account.address && data.contract) {
      setLoading(true);
      getCollections();
      setLoading(false);
    }
  }, [data]);

  const initialValues = {
    name: '',
    description: '',
    price: '',
    nftImage: '',
    isPublishNow: true,
    collectionAddress: '',
    startDate: moment().toDate(),
    endDate: moment().add(1, 'h').toDate(),
    royalty: 5,
  };

  return (
    <>
      {error && <AlertMessage type="error" title="Error" message={error} />}
      <Container pt={16} color="gray.500" pb={'90px'}>
        <Heading textAlign="center" color="white">
          NEW NFT
        </Heading>

        <Box maxWidth="588px" margin="0 auto" padding={8} display="flex" justifyContent="center">
          <Box w="384px">
            <Formik
              initialValues={initialValues}
              validationSchema={NftSchema}
              validateOnChange={false}
              onSubmit={onSubmitHandler}
            >
              {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, setFieldValue }) => (
                <FormGrid onSubmit={handleSubmit}>
                  {!values.nftImage[0] ? (
                    <Box>
                      <Field
                        id="nftImage"
                        name="nftImage"
                        component={CustomFileInput}
                        type="text"
                        accept=".png, .jpg, .jpeg, .gif, .webp"
                        label="Upload file"
                      />
                      {errors.nftImage && touched.nftImage && <Error>{errors.nftImage}</Error>}
                    </Box>
                  ) : (
                    <Box>
                      <Text mb={2}> Upload file</Text>
                      <Flex w="full" h="full" pb={6} flexDirection="column" alignContent="center">
                        <Box alignSelf="center" pb={2}>
                          <UploadedCoverImageFullSize src={URL.createObjectURL(values.nftImage[0])} borderRadius={4} />
                        </Box>

                        <Flex color="gray.900" justifyContent="space-between" alignItems="center">
                          <Box color="white" pr={4}>
                            {values.nftImage[0].name}
                          </Box>
                          <CloseImg onClick={() => setFieldValue('nftImage', '')} />
                        </Flex>
                      </Flex>
                    </Box>
                  )}
                  <Box>
                    <Text pb={2}>Choose collection</Text>
                    <Flex flexDirection="row" flexFlow="row wrap" gridGap={6}>
                      <Box minW="110px">
                        <SimpleGrid
                          border={`1px solid ${errors.collectionAddress ? '#E53E3E' : '#718096'}`}
                          textAlign="center"
                          borderRadius="8px"
                          cursor="pointer"
                          p={7}
                          onClick={onOpen}
                        >
                          <Flex
                            h={7}
                            w={7}
                            borderRadius="full"
                            bgColor="#00FFD1"
                            justifyContent="center"
                            alignItems="center"
                            justifySelf="center"
                            background="#262727"
                          >
                            <AddIcon color="teal.200" fontSize={10}></AddIcon>
                          </Flex>
                          <Box color="teal.200" fontWeight={600} pt={1}>
                            Create
                          </Box>
                          <Box fontSize={'xs'} color="gray.400">
                            ERC-721
                          </Box>
                        </SimpleGrid>
                      </Box>
                      {loading ? (
                        <SimpleGrid
                          w="110px"
                          h="132px"
                          border={'1px solid #718096'}
                          textAlign="center"
                          borderRadius="8px"
                          p={7}
                          justifyItems="center"
                          alignItems="center"
                        >
                          <Flex justifyContent="center">
                            <SkeletonCircle size="7" />
                          </Flex>
                          <Box color="teal.200" fontWeight={600} pt={2}>
                            <Skeleton height="14px" w="55px" />
                          </Box>
                          <Box fontSize={'xs'} color="gray.400" pt={1}>
                            <Skeleton height="12px" w="45px" />
                          </Box>
                        </SimpleGrid>
                      ) : (
                        marketplaceCollections &&
                        marketplaceCollections.map((collection) => (
                          <CollectionBoxInfo
                            key={collection.collectionAddress}
                            setFieldValueFunc={(val) => setFieldValue('collectionAddress', val)}
                            selectedCollectionAddress={values.collectionAddress}
                            isSelected={values.collectionAddress === collection.collectionAddress}
                            collectionInfo={collection}
                          />
                        ))
                      )}
                    </Flex>
                    <Box display="none">
                      <Field
                        id="collectionAddress"
                        component={CustomInput}
                        name="collectionAddress"
                        value={values.collectionAddress}
                        autoComplete="off"
                        type="hidden"
                      />
                    </Box>
                    {errors.collectionAddress && touched.collectionAddress && <Error>{errors.collectionAddress}</Error>}{' '}
                  </Box>
                  <Box>
                    <Field
                      id="name"
                      component={CustomInput}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      type="text"
                      name="name"
                      value={values.name}
                      autoComplete="off"
                      label="Title"
                      description={'Maximum of 25 characters'}
                    />
                    {errors.name && touched.name && <Error>{errors.name}</Error>}
                  </Box>

                  <Box>
                    <Field
                      id="description"
                      component={CustomTextarea}
                      type="text"
                      name="description"
                      label="Description"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.description}
                      autoComplete="off"
                      description={'Maximum of 400 characters'}
                    />
                    {errors.description && touched.description && <Error>{errors.description}</Error>}
                  </Box>

                  <Box>
                    <Checkbox
                      colorScheme="teal"
                      color="teal.200"
                      defaultIsChecked={values.isPublishNow}
                      onChange={() => setFieldValue('isPublishNow', !values.isPublishNow)}
                    >
                      Publish now
                    </Checkbox>
                  </Box>

                  {values.isPublishNow && (
                    <>
                      <Tabs variant="solid-rounded" colorScheme="teal" onChange={(index) => setTabIndex(index)}>
                        <TabList>
                          <Tab color="teal.200">Fixed Price</Tab>
                          <Tab color="teal.200">NFT Auction</Tab>
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
                          autoComplete="off"
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
                    </>
                  )}
                  <Box>
                    <Slider
                      aria-label="Royalty"
                      defaultValue={values.royalty}
                      min={0}
                      max={50}
                      step={1}
                      onChange={(val) => setFieldValue('royalty', val)}
                    >
                      <SliderTrack bg="teal.100">
                        <SliderFilledTrack bg="teal.200" />
                      </SliderTrack>
                      <SliderThumb boxSize={6}>
                        <Box color="teal.100" />
                      </SliderThumb>
                    </Slider>
                    <Text>
                      Royalty <b>{values.royalty}%</b>
                    </Text>
                  </Box>

                  {values.isPublishNow && (
                    <Box>
                      <StatWrapper>
                        <Stat>
                          <StatLabel>Your NFT will be on sale until</StatLabel>
                          <Flex alignItems="baseline">
                            <Box color="white" fontSize={'2xl'} fontWeight={600}>
                              {moment(values.endDate).format('MMMM D, YYYY, HH:mm')}
                            </Box>
                          </Flex>
                        </Stat>
                      </StatWrapper>
                    </Box>
                  )}
                  <CreateCollectionModal
                    fieldName="collectionAddress"
                    data={data}
                    isOpen={isOpen}
                    onClose={onClose}
                    size="full"
                    setFieldValue={setFieldValue}
                    addCollectionToArray={(data) => addCollectionToArray(data)}
                  />

                  <Button
                    id="createNFT"
                    type="submit"
                    disabled={isSubmitting}
                    variant="solid-bg"
                    color="black"
                    colorScheme="teal"
                    size="lg"
                    isLoading={isSubmitting}
                    loadingText="Minting... Please wait"
                  >
                    Create NFT
                  </Button>
                </FormGrid>
              )}
            </Formik>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default CreateNft;
