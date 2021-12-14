import styled from 'styled-components';

const Preloader = styled.div`
  width: 20px;
  height: 20px;
  position: relative;
  animation: loader08-ub06eb63b 1s ease infinite;
  left: 13px;
  top: -20px;

  @keyframes loader08-ub06eb63b {
    0%,
    100% {
      box-shadow: -13px 20px 0 #1b39ce, 13px 20px 0 rgba(0, 82, 236, 0.2), 13px 46px 0 rgba(0, 82, 236, 0.2),
        -13px 46px 0 rgba(0, 82, 236, 0.2);
    }
    25% {
      box-shadow: -13px 20px 0 rgba(0, 82, 236, 0.2), 13px 20px 0 #1b39ce, 13px 46px 0 rgba(0, 82, 236, 0.2),
        -13px 46px 0 rgba(0, 82, 236, 0.2);
    }
    50% {
      box-shadow: -13px 20px 0 rgba(0, 82, 236, 0.2), 13px 20px 0 rgba(0, 82, 236, 0.2), 13px 46px 0 #1b39ce,
        -13px 46px 0 rgba(0, 82, 236, 0.2);
    }
    75% {
      box-shadow: -13px 20px 0 rgba(0, 82, 236, 0.2), 13px 20px 0 rgba(0, 82, 236, 0.2),
        13px 46px 0 rgba(0, 82, 236, 0.2), -13px 46px 0 #1b39ce;
    }
  }
`;

export const Wrap = styled.div`
  margin: 0 auto;
  width: 46px;
  height: 46px;
`;

export const FullPreloader = styled(Preloader)``;

export const CenterWrap = styled.div`
  display: flex;
  justify-content: center;
`;

export default Preloader;
