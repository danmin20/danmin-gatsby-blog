import { colors, contentMaxWidth, hoverUnderline, MOBILE_MEDIA_QUERY } from '../../styles/const';
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

export const Tab = styled.div<{ isselected: string }>`
  font-size: 17px;
  cursor: pointer;
  ${hoverUnderline};
  line-height: 50px;
  color: ${({ isselected }) => (isselected === 'true' ? colors.black100 : colors.gray60)};
`;
