import { Box } from '@chakra-ui/layout';
import React from 'react';
import { CenterWrap } from '../../ui-kit/Preloader/styled-ui';

const NoMatch = () => (
  <CenterWrap>
    <Box pt={20}>404, Страница не найдена</Box>
  </CenterWrap>
);

export default NoMatch;
