import { Box, Input, Text } from '@chakra-ui/react';
import { getIn } from 'formik';
import PropTypes from 'prop-types';
import React from 'react';

const CustomInput = ({ field, form, label, description, onBlur, ...props }) => {
  const handleBlur = (event) => {
    const {
      target: { value },
    } = event;

    if (value !== '' && !!onBlur) {
      onBlur(event);
    }
  };

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

      <Input
        borderColor="gray.500"
        color="white"
        name={name}
        value={value === null ? '' : value}
        {...fieldProps}
        {...props}
        isInvalid={isError}
        onBlur={handleBlur}
      />
      {description && (
        <Text color="gray.500" pt={2}>
          {description}
        </Text>
      )}
    </Box>
  );
};

CustomInput.propTypes = {
  readOnly: PropTypes.bool,
  autoFocus: PropTypes.bool,
  field: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
  form: PropTypes.shape({}).isRequired,
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  description: PropTypes.string,
  type: PropTypes.string.isRequired,
};

CustomInput.defaultProps = {
  readOnly: false,
  autoFocus: false,
};

export default CustomInput;
