import styled from '@emotion/styled';

export const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 15px;
  transition: 0.3s;
`;

export const Button = styled.div`
  cursor: pointer;
  padding: 10px 20px;
  background-color: ${({ theme }) => theme.color.black100};
  color: ${({ theme }) => theme.color.white100};
`;

export const ModalBackground = styled.div`
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  overflow: hidden;
`;

export const Modal = styled.div`
  background-color: #fff;
  border-radius: 15px;
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
