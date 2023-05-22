import { MOBILE_MEDIA_QUERY } from '../../../../src/styles/const';
import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';

const shake = keyframes`
  0% {
    transform: translateX(0) rotate(8deg);
  }
  50% {
    transform: translateX(4px) rotate(-3deg);
  }

  100% {
    transform: translateX(0) rotate(6deg);
  }
`;

export const Wrapper = styled.div`
  position: relative;
  width: 230px;
  height: 50px;
  border-radius: 10px;
  @media ${MOBILE_MEDIA_QUERY} {
    width: 160px;
    height: 40px;
  }
`;

export const Button = styled.div`
  cursor: pointer;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  background-color: #3c3d40;
  border-radius: 5px;
  outline: none;
  transition: 0.5s;
  &:hover {
    width: 105%;
    height: 105%;
    div {
      top: 13px;
    }
  }
`;

export const Text = styled.div`
  display: flex;
  position: absolute;
  font-size: 30px;
  text-shadow: 2px 2px black;
  font-family: 'Anton', sans-serif;
  font-weight: 800;
  top: 12px;

  @media ${MOBILE_MEDIA_QUERY} {
    font-size: 20px;
  }

  p {
    &:nth-of-type(1n) {
      transform: rotate(8deg);
      animation: ${shake} 0.5s ease infinite;
      color: #f7ea25;
    }
    &:nth-of-type(2n) {
      transform: rotate(5deg);
      animation: ${shake} 0.5s ease-out infinite reverse;
      color: #fff;
    }
    &:nth-of-type(3n) {
      transform: rotate(-2deg);
      animation: ${shake} 0.5s 0.1s ease infinite;
    }
    &:nth-of-type(4n) {
      transform: rotate(-5deg);
      animation: ${shake} 0.5s ease-in infinite reverse;
    }
  }
`;
