import { hoverUnderline } from '../../../src/styles/const';
import styled from '@emotion/styled';

export const Wrapper = styled.a`
  color: ${({ theme }) => theme.color.white100};
  font-size: 16px;
  ${({ theme }) => hoverUnderline(theme)};
`;
