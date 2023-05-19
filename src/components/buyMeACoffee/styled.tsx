import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';

export const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 15px;
  transition: 0.3s;
`;

export const Center = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  filter: drop-shadow(0.25em 0.7em 0.95em rgba(0, 0, 0, 0.5));
`;

export const Circle = styled.div`
  position: relative;
  width: 150px;
  height: 150px;
  color: #fff;
  background: #2c2d2e;
  border-radius: 50%;
  border: 1px solid;
`;

export const Logo = styled.div`
  font-size: 100px;
  line-height: 150px;
  vertical-align: middle;
`;

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

export const Button = styled.div`
  position: absolute;
  bottom: 20px;
  left: 10px;
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
`;

export const Text = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  font-size: 24px;
  font-weight: bold;
  text-transform: uppercase;
  animation: ${rotate} 14s linear infinite;
  fill: #fff;
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export const ModalBackground = styled.div`
  width: 100%;
  height: 100vh;
  background-color: ${({ theme }) => theme.color.white100}, 0.4;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  overflow: hidden;
  animation: ${fadeIn} 0.5s ease both;
  backdrop-filter: blur(5px);
`;

export const Modal = styled.div`
  background-color: ${({ theme }) => theme.color.white100};
  border-radius: 15px;
  box-shadow: 0 5px 30px 0 rgb(0 0 0 / 0.2);
  animation: ${fadeIn} 0.5s ease both;
`;

export const Title = styled.div`
  width: 100%;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  padding: 30px;
`;

export const Content = styled.div`
  padding: 30px 40px;
  padding-top: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 210px;

  & > a {
    text-decoration: underline;
  }

  & > div:first-child {
    font-weight: bold;
  }
`;

export const Qr = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;

  & > div {
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;

    & > img:first-child {
      width: 30px;
    }
    & > img:last-child {
      width: 100px;
    }
  }
`;
