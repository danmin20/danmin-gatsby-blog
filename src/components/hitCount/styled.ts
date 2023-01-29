import { MOBILE_MEDIA_QUERY } from '../../../src/styles/const';
import styled from '@emotion/styled';

export const Wrapper = styled.div`
  color: ${({ theme }) => theme.color.white100};
  font-size: 12px;
  position: absolute;
  left: 0;
  top: 70px;
  & > div {
    width: fit-content;
    background-color: ${({ theme }) => theme.color.black40};
    padding: 5px 8px;
    padding-top: 6px;
    border-radius: 20px;
  }

  @media ${MOBILE_MEDIA_QUERY} {
    left: 10px;
    top: 40px;
  }
`;
