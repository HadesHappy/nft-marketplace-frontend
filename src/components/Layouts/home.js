import { Box } from '@chakra-ui/layout';
import PropTypes from 'prop-types';
import React from 'react';
import ScrollButton from '../../ui-kit/ScrollButton';
import Footer from '../Footer/index';
import Header from '../Header';

const HomeLayout = ({ children }) => (
  <>
    <Box>
      <Header />
      <Box w="100%">{children}</Box>
      <Footer />
      <ScrollButton />
    </Box>
  </>
);

HomeLayout.propTypes = { children: PropTypes.node.isRequired };

export default HomeLayout;
