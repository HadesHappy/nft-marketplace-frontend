import styled from 'styled-components';
import device from '../../device';

export const Heading = styled.h1`
  text-align: center;
  color: green;
`;

export const Content = styled.div`
  overflowy: scroll;
  height: 2500px;
`;

export const Button = styled.div`
  position: fixed;
  width: 100%;
  left: 94%;

  bottom: 60px;
  height: 20px;
  font-size: 3rem;
  z-index: 1;
  cursor: pointer;
  color: white;

  @media ${device.tablet} {
    left: 84%;
  }
`;
