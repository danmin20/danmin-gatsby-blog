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

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  margin-top: 120px;
  margin-bottom: 120px;
  font-weight: 100;
  font-size: 32px;
  line-height: 1.2;
  .react-rotating-text-cursor {
    animation: ${blinkingCursor} 0.8s cubic-bezier(0.68, 0.01, 0.01, 0.99) 0s infinite;
  }
`;

export const IntroWrapper = styled.div`
  width: 300px;
  white-space: nowrap;

  strong {
    display: inline-block;
    font-weight: 600;
    .react-rotating-text-cursor {
      font-weight: 100;
    }
  }

  .react-rotating-text-cursor {
    animation: ${blinkingCursor} 0.8s cubic-bezier(0.68, 0.01, 0.01, 0.99) 0s infinite;
  }
`;

export const Title = styled.p`
  width: 100%;
  .react-rotating-text-cursor {
    font-size: 35px;
    line-height: 35px;
  }
`;

export const SocialWrapper = styled.div`
  margin-top: 20px;
  display: flex;
  gap: 5px;
`;

export const ImgWrapper = styled.div``;
