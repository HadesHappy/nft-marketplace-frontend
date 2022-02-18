import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';
import { Field, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { ReactComponent as CloseImg } from '../../assets/images/icons/close.svg';
import AlertMessage from '../../ui-kit/AlertMessage/index';
import CustomFileInput from '../../ui-kit/CustomField/FileInput';
import CustomTextarea from '../../ui-kit/CustomField/Textarea';
import Error from '../../ui-kit/Error/index';
import CustomInput from '../../ui-kit/Input/index';
import { createCollection } from '../../utils/contractsApi/collection';
import { getFile, ipfs, readFileAsync } from '../../utils/ipfs';
import { FormGrid, UploadedCoverImageFullSize } from '../Marketplaces/styled-ui';
import CollectionSchema from './validation';

const CreateCollectionModal = ({ data, isOpen, onClose, fieldName, setFieldValue, addCollectionToArray }) => {
  const [error, setError] = useState();

  const [formData, setFormData] = useState('');

  const create = async () => {
    const avatarImgName = formData.values.collectionImage[0].name.replace(/[^a-zA-Z0-9.]+/g, '');
    const bgImgName = formData.values.collectionBgImage[0].name.replace(/[^a-zA-Z0-9.]+/g, '');

    let contenAvatarBuffer = await readFileAsync(formData.values.collectionImage[0]);
    let contenBgBuffer = await readFileAsync(formData.values.collectionBgImage[0]);

    const { cid: assetAvatarCid } = await ipfs.add({ path: '/nft/' + avatarImgName, content: contenAvatarBuffer });
    const { cid: assetBgCid } = await ipfs.add({ path: '/nft/' + bgImgName, content: contenBgBuffer });

    const { collectionName, collectionDescription, symbol } = formData.values;
    const jsonData = JSON.stringify({
      name: collectionName,
      description: collectionDescription,
      avatarImage: `ipfs://${assetAvatarCid}/${avatarImgName}`,
      bgImage: `ipfs://${assetBgCid}/${bgImgName}`,
      symbol,
    });
    const { cid: metadataCid } = await ipfs.add({ path: '/nft/metadata.json', content: jsonData });
    const metadataURI = metadataCid + '/metadata.json';

    await createCollection({
      address: data.account.address,
      name: collectionName,
      symbol,
      collectionURI: metadataURI,
      setError: (e) => {
        setError(e);
        formData.actions.setSubmitting(false);
      },
      cb: (collectionAddress) => {
        cb(collectionAddress, metadataURI);
      },
    });
  };

  const cb = (collectionAddress, metadataURI) => {
    getFile(metadataURI).then((result) => {
      const { collectionName, symbol } = formData.values;
      setFieldValue(fieldName, collectionAddress);
      addCollectionToArray({
        collectionAddress,
        name: collectionName,
        symbol,
        imagePath: result.avatarImage,
      });
      onClose();
    });
  };

  useEffect(() => {
    if (formData !== '') create();
  }, [formData]);

  const initialValues = {
    collectionName: '',
    collectionDescription: '',
    collectionImage: '',
    collectionBgImage: '',
    symbol: '',
    shortUrl: '',
  };

  const onSubmitHandler = React.useCallback((values, actions) => {
    setFormData({ values, actions });
  }, []);

  return (
    <>
      {error && <AlertMessage type="error" title="Error" message={error} />}
      <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false} size="full">
        <ModalOverlay background="#282828" boxShadow="lg" />
        <ModalContent boxShadow="none" backgroundColor="#282828">
          <ModalCloseButton border="1px solid #718096" color="teal.200" colorScheme="white" width={10} height={10} />
          <Box display="flex" justifyContent="center" alignItems="center" backgroundColor="#282828">
            <ModalBody>
              <Formik
                initialValues={initialValues}
                validationSchema={CollectionSchema}
                validateOnChange={false}
                onSubmit={onSubmitHandler}
              >
                {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, setFieldValue }) => (
                  <>
                    <Container pt={16} pb="100px">
                      <Heading color="white" textAlign="center">
                        New Collection
                      </Heading>
                      <Box
                        maxWidth="588px"
                        margin="0 auto"
                        padding={8}
                        display="flex"
                        justifyContent="center"
                        maxHeight="100vh"
                      >
                        <Box w="384px">
                          <FormGrid onSubmit={handleSubmit}>
                            {!values.collectionBgImage[0] ? (
                              <>
                                <Box>
                                  <Field
                                    id="collectionBgImage"
                                    name="collectionBgImage"
                                    component={CustomFileInput}
                                    type="text"
                                    accept=".png, .jpg, .jpeg, .gif, .webp"
                                    label="Upload background"
                                    actionText="Click to upload background image"
                                    maxFiles="1"
                                    labelTypes="JPG, JPEG, PNG, GIF, WEBP. Max 100mb."
                                  />
                                  {errors.collectionBgImage && touched.collectionBgImage && (
                                    <Error>{errors.collectionBgImage}</Error>
                                  )}
                                </Box>
                              </>
                            ) : (
                              <Box>
                                <Text mb={2} color="gray.500">
                                  {' '}
                                  Upload background
                                </Text>
                                <Flex w="full" h="full" pb={6} flexDirection="column" alignContent="center">
                                  <Box alignSelf="center" pb={2}>
                                    <UploadedCoverImageFullSize
                                      src={URL.createObjectURL(values.collectionBgImage[0])}
                                      borderRadius={4}
                                    />
                                  </Box>

                                  <Flex justifyContent="space-between" alignItems="center">
                                    <Box pr={4} color="white">
                                      {values.collectionBgImage[0].name}
                                    </Box>
                                    <CloseImg onClick={() => setFieldValue('collectionBgImage', '')} />
                                  </Flex>
                                </Flex>
                              </Box>
                            )}
                            {!values.collectionImage[0] ? (
                              <>
                                <Box>
                                  <Field
                                    id="collectionImage"
                                    name="collectionImage"
                                    component={CustomFileInput}
                                    type="text"
                                    accept=".png, .jpg, .jpeg, .gif, .webp"
                                    label="Upload avatar"
                                    labelTypes="JPG, JPEG, PNG, GIF, WEBP. Max 100mb."
                                    actionText="Click to upload avatar"
                                    maxFiles="1"
                                  />
                                  {errors.collectionImage && touched.collectionImage && (
                                    <Error>{errors.collectionImage}</Error>
                                  )}
                                </Box>
                              </>
                            ) : (
                              <Box>
                                <Text mb={2} color="gray.500">
                                  {' '}
                                  Upload avatar
                                </Text>
                                <Flex w="full" h="full" pb={6} flexDirection="column" alignContent="center">
                                  <Box alignSelf="center" pb={2}>
                                    <UploadedCoverImageFullSize
                                      src={URL.createObjectURL(values.collectionImage[0])}
                                      borderRadius={4}
                                    />
                                  </Box>

                                  <Flex color="gray.900" justifyContent="space-between" alignItems="center">
                                    <Box pr={4} color="white">
                                      {values.collectionImage[0].name}
                                    </Box>
                                    <CloseImg onClick={() => setFieldValue('collectionImage', '')} />
                                  </Flex>
                                </Flex>
                              </Box>
                            )}

                            <Box>
                              <Field
                                id="collectionName"
                                component={CustomInput}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                type="text"
                                name="collectionName"
                                value={values.collectionName}
                                autoComplete="off"
                                label="Display name"
                              />
                              {errors.collectionName && touched.collectionName && (
                                <Error>{errors.collectionName}</Error>
                              )}
                            </Box>

                            <Box>
                              <Field
                                id="symbol"
                                component={CustomInput}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                type="text"
                                name="symbol"
                                value={values.symbol}
                                autoComplete="off"
                                label="Symbol"
                                description={'Token name cannot be changed in future'}
                              />
                              {errors.symbol && touched.symbol && <Error>{errors.symbol}</Error>}
                            </Box>

                            <Box>
                              <Field
                                id="collectionDescription"
                                component={CustomTextarea}
                                type="text"
                                name="collectionDescription"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.collectionDescription}
                                autoComplete="off"
                                label="Description"
                                description={'Maximum of 150 characters'}
                              />
                              {errors.collectionDescription && touched.collectionDescription && (
                                <Error>{errors.collectionDescription}</Error>
                              )}
                            </Box>

                            <Button
                              id="createCollection"
                              type="submit"
                              disabled={isSubmitting}
                              variant="solid"
                              bg="teal.200"
                              size="lg"
                              colorScheme="black"
                              color="black"
                              isLoading={isSubmitting}
                              loadingText="Submitting"
                              mb={20}
                            >
                              Create collection
                            </Button>
                          </FormGrid>
                        </Box>
                      </Box>
                    </Container>
                  </>
                )}
              </Formik>
            </ModalBody>
          </Box>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreateCollectionModal;
