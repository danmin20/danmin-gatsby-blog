import { contentMaxWidth } from '../../styles/const';
import styled from '@emotion/styled';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-self: flex-start;
  top: 0px;
  width: 100%;
`;

export const Tabs = styled.div`
  display: flex;
  justify-content: center;
  height: 40px;
  width: 100%;
  max-width: ${contentMaxWidth} + 40px;
  margin-bottom: 12px;
`;

export const Tab = styled.div`
  height: 40px;
  min-height: auto;
  min-width: auto;
  padding: 10px 12px;
  font-weight: 500;
  font-size: 17px;
  transition: all 200ms ease;

  :hover {
    transition: all 200ms ease;
  }
`;
