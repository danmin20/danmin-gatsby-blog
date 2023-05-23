import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';

export const Wrapper = styled.div``;

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
    color: #1b64da;
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
