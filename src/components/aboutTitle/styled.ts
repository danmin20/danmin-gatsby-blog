import { colors } from '../../../src/styles/const';
import styled from '@emotion/styled';

export const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-bottom: 32px;
  h2 {
    padding-bottom: 5px;
    border-bottom: 2px solid ${colors.black100};
    font-weight: 700;
    font-size: 30px;
  }
`;
