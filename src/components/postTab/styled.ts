import { contentMaxWidth, hoverUnderline, MOBILE_MEDIA_QUERY } from '../../styles/const';
import styled from '@emotion/styled';
import { Theme } from '@emotion/react';

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
  width: 100%;
  max-width: ${contentMaxWidth} + 40px;
  margin-bottom: 12px;
  gap: 24px;
  overflow-x: scroll;
  @media ${MOBILE_MEDIA_QUERY} {
    justify-content: flex-start;
  }
  padding: 0 15px;
`;

export const Tab = styled.div<any>`
  font-size: 17px;
  cursor: pointer;
  ${({ theme }) => hoverUnderline(theme)};
  line-height: 50px;
  color: ${({ isselected, theme }) => (isselected === 'true' ? theme.color.black100 : theme.color.gray60)};
`;
