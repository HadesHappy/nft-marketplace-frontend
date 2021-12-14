import styled from 'styled-components';
import cancelIcon from './../../../assets/images/icons/cancel.svg';
import { ReactComponent as UploadImg } from './../../../assets/images/icons/upload.svg';

export const FormUploadDocumentIcon = styled(UploadImg)``;

export const UploadContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-width: 1px;
  border-radius: 5px;
  border-style: dashed;
  border-color: ${(props) => (props.isError ? '#E53E3E' : '#858585')};
  color: #858585;
  outline: none;
  transition: border 0.24s ease-in-out;
  min-height: 100px;
`;

export const UploadDocumentText = styled.div`
  padding-top: 8px;
  color: #858585;
`;

export const ThumbsContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: 16;
  padding: 20px;

  &:hover {
    border-color: #858585;
  }
  &:hover ${UploadDocumentText} {
    color: #323233;
  }
`;

export const Thumb = styled.div`
  display: inline-flex;
  border-radius: 2px;
  border: 1px solid #eaeaea;
  margin-bottom: 8px;
  margin-right: 20px;
  padding: 4px;
  box-sizing: border-box;

  img {
    max-width: 300px;
    max-height: 100px;
  }
`;

export const ThumbInner = styled.div`
  display: flex;
  min-width: 0;
  overflow: hidden;
`;

export const ThumbImage = styled.img`
  display: block;
  width: auto;
  height: 100%;
`;

export const DeleteIcon = styled.div`
  background: url(${cancelIcon}) no-repeat;
  width: 20px;
  height: 20px;
  position: absolute;
  right: 20px;
`;

export const ThumbWrapper = styled.div`
  position: relative;
`;

export const Upload = styled.span`
  color: #1b39ce;
  cursor: pointer;
`;

export const WrapInfo = styled.div`
  padding-top: 40px;
`;
