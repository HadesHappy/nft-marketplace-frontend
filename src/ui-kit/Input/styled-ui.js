import styled from 'styled-components';

export const Input = styled.input`
  border: 1px solid transparent;
  height: 40px;

  padding: 0px 20px;
  border-radius: 5px;
  background-color: #f1f3f5;
  color: #323233;
  font-family: 'Gotham Pro';
  font-size: 16px;
  line-height: 20px;
  border: 1px solid ${(props) => (props.error ? '#F92828' : 'transporent')};

  &::-webkit-input-placeholder {
    color: #dcdcdc;
    transition: opacity 250ms ease-in-out;
  }
`;
