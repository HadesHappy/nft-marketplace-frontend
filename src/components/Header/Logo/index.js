import React from 'react';
import { useHistory } from 'react-router-dom';
import LogoSrc from '../../../assets/images/logo.png';
import { Container, LogoStyled } from './styled-ui';

const Logo = () => {
  const history = useHistory();
  return (
    <Container onClick={() => history.push('/')}>
      <LogoStyled src={LogoSrc} alt="" />
    </Container>
  );
};

export default Logo;
