import { Box, Button, Input, InputGroup, InputRightAddon, Text } from '@chakra-ui/react';
import { getIn } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';

const CustomAddonInput = ({ field, form, label, addon, onBlur, maxFunc, ...props }) => {
  const { id } = props;
  const { name, value, ...fieldProps } = field;

  const error = getIn(form.errors, name);
  const isTouched = getIn(form.touched, name);
  const isError = !!error && isTouched;

  return (
    <Box>
      {label && (
        <Text htmlFor={id} pb={2} color="gray.500">
          {label}
        </Text>
      )}

      <InputGroup>
        <Input
          borderColor="gray.500"
          color="white"
          outline="none"
          focusBorderColor="gray"
          name={name}
          value={value === null ? '' : value}
          {...fieldProps}
          {...props}
          isInvalid={isError}
          borderRight="none"
        />
        {maxFunc && (
          <Button
            outline="none"
            backgroundColor="transparent"
            _hover={{ bg: 'transparent' }}
            borderRadius="unset"
            borderTop="1px solid #e2e8f0"
            borderBottom="1px solid #e2e8f0"
            _focus={{ outline: 'none' }}
            _active={{
              bg: 'transparent',
            }}
            color="teal.200"
            fontSize={14}
            fontWeight={400}
            textDecoration="underline"
            onClick={maxFunc}
          >
            Max
          </Button>
        )}

        <InputRightAddon
          color="white"
          focusBorderColor="#718096"
          backgroundColor="#494C4B"
          children={addon}
          border="1px solid"
          borderColor={!isError ? '#718096' : '#e2e8f0'}
        />
      </InputGroup>
    </Box>
  );
};

CustomAddonInput.propTypes = {
  readOnly: PropTypes.bool,
  autoFocus: PropTypes.bool,
  field: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
  form: PropTypes.shape({}).isRequired,
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  type: PropTypes.string.isRequired,
};

CustomAddonInput.defaultProps = {
  readOnly: false,
  autoFocus: false,
};

export default CustomAddonInput;
