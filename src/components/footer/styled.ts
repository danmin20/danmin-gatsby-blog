import styled from '@emotion/styled';
import { contentMaxWidth } from '../../styles/const';

export const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 62px;
  margin-top: auto;
  position: fixed;
  bottom: 0;
  z-index: -1;
  background-color: #f8f9fa;
  font-family: GmarketSansLight;
`;

export const Footer = styled.p`
  text-align: center;
  width: 100%;
  max-width: ${contentMaxWidth};

  .link {
    font-weight: 700;
    font-size: 20px;
    margin-right: 20px;
  }

  a {
    color: #3a95ff;
  }
`;
