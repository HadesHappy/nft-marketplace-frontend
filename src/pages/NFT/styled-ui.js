import styled from 'styled-components';
import device from '../../device';

export const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  grid-column-gap: 40px;
  justify-content: space-between
  grid-row-gap: 10px;
  grid-column: 1/-1;
  align-items: center;
`;

export const TokenWrapperImage = styled.div`
  width: 200px;
`;

export const TokenImage = styled.img`
  height: 300px;
`;
export const TokenDetails = styled.div`
  display: grid;
`;

export const TokenName = styled.div`
  font-size: 20px;
  font-weight: bold;
`;

export const TokenDescription = styled.div`
  padding: 10px 0;
`;

export const StatWrapper = styled.div`
  background: #282828;
  width: 100%;
  border-radius: 12px;
  padding: 24px;
  min-height: 104px;
  display: flex;
  align-items: center;
`;

export const InfoWrapper = styled(StatWrapper)`
  border: none;
  background: rgb(40, 40, 40, 0.87);
  border-width: none;
  box-shadow: 0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06);
  @media ${device.tablet} {
    flex-direction: column;
    text-align: center;
  }
`;

export const InfoCentredWrapper = styled(StatWrapper)`
  justify-content: center;
`;

export const InfoMarketplaceWrapper = styled(InfoWrapper)`
  flex-direction: column;
  align-items: start;
`;
