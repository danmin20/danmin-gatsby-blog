import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';

const slide = keyframes`
  0% {
    transform: translateX(10px)
  }
  50% {
    transform: translateX(-10px)
  }
  100% {
    transform: translateX(10px)
  }
`;

const rotate = keyframes`
  from { 
    transform: rotate(0); 
  }
  to { 
    transform: rotate(360deg); 
  }
`;

export const Center = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  filter: drop-shadow(0.25em 0.7em 0.95em rgba(0, 0, 0, 0.5));
`;

export const Circle = styled.div<{ isMobile: boolean }>`
  position: relative;
  width: ${({ isMobile }) => (isMobile ? 100 : 150)}px;
  height: ${({ isMobile }) => (isMobile ? 100 : 150)}px;
  color: #fff;
  background: #2c2d2e;
  border-radius: 50%;
  border: 1px solid;
`;

export const Logo = styled.div<{ isMobile: boolean }>`
  font-size: ${({ isMobile }) => (isMobile ? 70 : 100)}px;
  line-height: ${({ isMobile }) => (isMobile ? 110 : 150)}px;
  vertical-align: middle;
`;

export const Button = styled.div<{ isMobile: boolean }>`
  position: absolute;
  bottom: 20px;
  left: 0px;
  right: 0;
  padding: 6px;
  font-weight: bold;
  text-transform: uppercase;
  background: #2c2d2e;
  border: 1px solid;
  animation: ${slide} 1.4s ease-in-out infinite;
  border-radius: 5px;
  cursor: pointer;
  rotate: calc(-5deg);
  &:hover {
    color: #2c2d2e;
    background: #fff;
    border-color: #fff;
  }
  font-size: ${({ isMobile }) => (isMobile ? 14 : 18)}px;
`;

export const Text = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  font-weight: bold;
  text-transform: uppercase;
  animation: ${rotate} 14s linear infinite;
  fill: #fff;
  font-size: 24px;
`;
