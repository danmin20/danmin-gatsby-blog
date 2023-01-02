import { colors, MOBILE_MEDIA_QUERY } from '../../../src/styles/const';
import styled from '@emotion/styled';

export const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-bottom: 32px;
  h2 {
    font-family: GmarketSansMedium;
    padding-bottom: 5px;
    font-size: 30px;

    @media ${MOBILE_MEDIA_QUERY} {
      font-size: 20px;
    }
  }
`;
