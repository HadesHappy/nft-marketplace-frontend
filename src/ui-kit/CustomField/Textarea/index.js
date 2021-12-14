import { Box, Text, Textarea } from '@chakra-ui/react';
import { getIn } from 'formik';
import React from 'react';

function CustomTextarea({ field, form, label, description, onBlur, ...props }) {
  const { id } = props;
  const { name, value, ...fieldProps } = field;

  const error = getIn(form.errors, name);
  const isTouched = getIn(form.touched, name);
  const isError = !!error && isTouched;

  return (
    <div>
      <Box>
        <Text htmlFor={id} pb={2} color="gray.500">
          {label}
        </Text>
        <Textarea
          color="white"
          borderColor="gray.500"
          name={name}
          value={value === null ? '' : value}
          {...fieldProps}
          {...props}
          isInvalid={isError}
          onBlur={onBlur}
          resize="none"
        />
        <Text color="gray.500" pt="8px">
          {description}
        </Text>
      </Box>
    </div>
  );
}

export default CustomTextarea;
