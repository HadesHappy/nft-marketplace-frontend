import { Button } from '@chakra-ui/button';
import { Flex } from '@chakra-ui/layout';
import { Field, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import Error from '../../../ui-kit/Error';
import CustomInput from '../../../ui-kit/Input/index';
import { sendTokenToUser } from '../../../utils/contractsApi/token';

const TransferToken = ({
  fromAddress,
  setError,
  succesTransactionToast,
  getTokenInfoData,
  tokenId,
  collectionAddress,
}) => {
  const [formData, setFormData] = useState('');

  const sendToken = async () => {
    await sendTokenToUser({
      fromAddress,
      toAddress: formData.values.toAddress,
      tokenId,
      collectionAddress,
      setError: (e) => {
        setError(e);
        formData.actions.setSubmitting(false);
      },
      cb: () => {
        formData.actions.setSubmitting(false);
        setTimeout(() => getTokenInfoData(), 2000);
        succesTransactionToast();
      },
    });
  };

  useEffect(() => {
    if (formData !== '') {
      sendToken();
    }
  }, [formData]);

  const onSubmitHandler = React.useCallback((values, actions) => {
    setFormData({ values, actions });
  }, []);

  return (
    <div>
      <Flex pt={2} pb={2}>
        <Formik
          enableReinitialize
          initialValues={{ toAddress: '' }}
          validateOnBlur={false}
          validateOnChange={false}
          validate={(values) => {
            const errors = {};
            if (!values.toAddress) {
              errors.toAddress = 'Required';
            }

            return errors;
          }}
          onSubmit={onSubmitHandler}
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, setFieldValue }) => (
            <>
              <Form onSubmit={handleSubmit}>
                <Flex>
                  <Flex>
                    <Field
                      id="toAddress"
                      component={CustomInput}
                      onChange={handleChange}
                      placeholder="Enter wallet number"
                      onBlur={handleBlur}
                      type="text"
                      name="toAddress"
                      value={values.toAddress}
                      autoComplete="off"
                      label="Gift NFT"
                    />
                    {errors.toAddress && touched.toAddress && errors.toAddress && <Error>{errors.toAddress}</Error>}
                  </Flex>
                  <Flex flexFlow="wrap-reverse">
                    <Button
                      ml={4}
                      type="submit"
                      disabled={isSubmitting}
                      variant="solid"
                      bg="teal.200"
                      size="md"
                      color="black"
                      colorScheme="teal.200"
                      isLoading={isSubmitting}
                      loadingText="Submitting"
                    >
                      Send this NFT
                    </Button>
                  </Flex>
                </Flex>
              </Form>
            </>
          )}
        </Formik>
      </Flex>
    </div>
  );
};

export default TransferToken;
