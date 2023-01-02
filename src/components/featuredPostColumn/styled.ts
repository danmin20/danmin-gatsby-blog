import { colors, MOBILE_MEDIA_QUERY } from '../../../src/styles/const';
import styled from '@emotion/styled';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 20px;
`;

export const Title = styled.div`
  font-size: 20px;
  width: fit-content;
  padding: 10px;
  background-color: ${colors.black40};
  color: ${colors.white100};
  margin-bottom: 25px;

  @media ${MOBILE_MEDIA_QUERY} {
    font-size: 17px;
    padding: 8px 10px;
  }
`;
