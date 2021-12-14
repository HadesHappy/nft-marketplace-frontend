import { Link } from 'react-router-dom';
import styled from 'styled-components';

export const ButtonLink = styled(Link)`
  width: 100%;
  height: 100%;
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: center;
  flex: 1;
  font-size: 16px;
  font-family: 'Gotham Pro';

  background-color: #1b39ce;
  border-radius: 5px;

  color: #ffffff;
  line-height: 31px;
  text-align: center;
  cursor: pointer;
  box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.2);

  text-decoration: none;

  &:hover {
    background-color: #1b39be;
  }

  &:disabled {
    background-color: #ccc;
    pointer-events: none;
  }
`;

export const Button = styled.button`
  border: 1px solid transparent;
  width: 100%;
  height: 100%;
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: center;
  flex: 1;
  font-size: 16px;
  font-family: 'Gotham Pro';

  background-color: #1b39ce;
  border-radius: 5px;

  color: #ffffff;
  line-height: 31px;
  text-align: center;
  cursor: pointer;
`;

export const SmallButtonLink = styled(ButtonLink)`
  width: 180px;
  height: 35px;
  flex: none;
`;

export const SmallButton = styled(Button)`
  height: 30px;
  font-size: 14px;
  flex: none;
`;

export const MediumButtonLink = styled(ButtonLink)`
  width: 222px;
  height: 41px;
  flex: none;
`;

export const MediumButton = styled(Button)`
  width: 222px;
`;

export const LargeButtonLink = styled(ButtonLink)`
  width: 398px;
  height: 80px;
  font-size: 20px;
`;

export const LargeButton = styled(Button)`
  width: 100%;
  height: 80px;
  font-size: 20px;
`;

export const ExtraLargeButtonLink = styled(LargeButtonLink)`
  width: 836px;
  height: 70px;
`;

export const ExtraLargeButton = styled(LargeButton)`
  width: 836px;
  height: 70px;
`;

export const ExtraSmallButton = styled(Button)`
  color: ${(props) => (props.active ? '#fff' : '#858585')};
  background-color: ${(props) => (!props.active ? '#fff' : props.theme.btnColor)};
  border: ${(props) => (!props.active ? '1px dashed #c6c6c6' : undefined)};
  line-height: 30px;

  &:disabled {
    border: 1px dashed red;
    background-color: #ffffff;
    color: #858585;
    opacity: 0.5;
  }

  &:hover {
    border: ${(props) => (props.active ? '1px solid transperent' : '1px dashed #858585')};
    color: ${(props) => (props.active ? '#fff' : '#323233')};
    background-color: ${(props) => (props.active ? props.theme.btnHoverColor : '#fff')};
  }
`;
