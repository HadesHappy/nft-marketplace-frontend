import { Container } from '@chakra-ui/layout';
import React from 'react';
import { useHistory } from 'react-router-dom';
import LogoSrc from '../../../assets/images/logo.png';
import * as RoutePaths from '../../../utils/constants/routings';
import { LogoStyled } from './styled-ui';

const Logo = () => {
  const history = useHistory();
  return (
    // <Link to="/" as={ReachLink}>
    //   <LogoStyled src={LogoSrc} alt="" />
    // </Link>
    <Container
      onClick={() =>
        history.push({
          pathname: `${RoutePaths.HOME}`,
          state: {
            tab: 'nfts',
            page: 'home',
          },
        })
      }
    >
      <LogoStyled src={LogoSrc} alt="" />
    </Container>
  );
};

export default Logo;
