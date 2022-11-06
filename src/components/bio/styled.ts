import { colors } from '../../../src/styles/const';
import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';

const blinkingCursor = keyframes`
  0% {
    opacity: 0;
  }

  50% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
`;

const sliderShape = keyframes`
  0%,100%{
    border-radius: 42% 58% 70% 30% / 45% 45% 55% 55%;
    transform: translate3d(0,0,0) rotateZ(0.01deg);
  }
  34%{
    border-radius: 70% 30% 46% 54% / 30% 29% 71% 70%;
    transform:  translate3d(0,5px,0) rotateZ(0.01deg);
  }
  50%{
    transform: translate3d(0,0,0) rotateZ(0.01deg);
  }
  67%{
    border-radius: 100% 60% 60% 100% / 100% 100% 60% 60% ;
    transform: translate3d(0,-3px,0) rotateZ(0.01deg);
  }
`;

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  margin-top: 120px;
  margin-bottom: 80px;
  font-family: GmarketSansLight;

  .react-rotating-text-cursor {
    animation: ${blinkingCursor} 0.8s cubic-bezier(0.68, 0.01, 0.01, 0.99) 0s infinite;
  }
`;

export const IntroWrapper = styled.div`
  white-space: nowrap;
  display: flex;
  justify-content: space-between;
  position: relative;
  font-size: 40px;
  line-height: 1.2;

  strong {
    display: inline-block;
    font-family: GmarketSansMedium;
    .react-rotating-text-cursor {
      font-family: GmarketSansLight;
      font-weight: 100;
      font-size: 40px;
    }
  }

  .react-rotating-text-cursor {
    animation: ${blinkingCursor} 0.8s cubic-bezier(0.68, 0.01, 0.01, 0.99) 0s infinite;
  }
`;

export const Title = styled.p`
  width: 100%;
  .react-rotating-text-cursor {
    font-size: 50px;
    line-height: 35px;
  }
`;

export const SocialWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 5px;
  align-items: flex-end;
`;
