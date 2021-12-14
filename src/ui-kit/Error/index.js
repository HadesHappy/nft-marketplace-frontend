import PropTypes from 'prop-types';
import React from 'react';
import { ErrorFormText, ErrorIcon, WrapError } from './styled-ui';

const Error = ({ children, icon }) => {
  return (
    <WrapError>
      {icon && <ErrorIcon />}
      <ErrorFormText>{children}</ErrorFormText>
    </WrapError>
  );
};

export default Error;

Error.propTypes = {
  children: PropTypes.string.isRequired,
};
