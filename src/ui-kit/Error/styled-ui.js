import styled from 'styled-components';
import { ReactComponent as ErrorImage } from '../../assets/images/icons/error.svg';

export const ErrorFormText = styled.div`
  font-size: 12px;
  color: #f92828;
  box-sizing: border-box;
`;

export const ErrorIcon = styled(ErrorImage)`
  padding-right: 10px;
`;

export const WrapError = styled.div`
  display: flex;
  align-items: flex-end;
`;
