import styled from 'styled-components';
import device from '../../device';

export const FormGrid = styled.form`
  display: grid;
  grid-template-columns: 1fr;
  grid-column-gap: 40px;
  grid-row-gap: 24px;
  grid-column: 1/-1;
  @media ${device.tablet} {
    grid-template-columns: none;
  }
`;

export const FormGridSwap = styled(FormGrid)`
  grid-row-gap: 16px;
  grid-auto-flow: dense;
`;

export const UploadedAvatarImage = styled.img`
  height: 120px;
`;

export const UploadedCoverImage = styled.img`
  width: 100%;
  height: 280px;
  background-size: cover;
  object-fit: cover;
  object-position: 0 0;
`;

export const UploadedCoverImageFullSize = styled(UploadedCoverImage)`
  width: 100%;
  height: 100%;
  border-radius: 6px;
`;

export const UploadedCoverWrapper = styled.div`
  object-fit: cover;
`;

export const Title = styled.div`
  font-weight: 800;
  font-size: 24px;
  color: white;

  @media ${device.mobileM} {
    padding-top: 5px;
    font-size: 14px;
  }
`;

export const Description = styled.div`
  @media ${device.tablet} {
    font-size: 8px;
  }
`;
