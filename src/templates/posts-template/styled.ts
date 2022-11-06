import { colors } from '../../../src/styles/const';
import styled from '@emotion/styled';

export const CategoryWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 30px;
  margin-bottom: 30px;
`;

export const CategoryTitle = styled.div`
  width: fit-content;
  padding-bottom: 7px;
  margin-bottom: 15px;
  font-size: 30px;
  text-align: center;
  border-bottom: 2px solid ${colors.black100};
`;

export const CategorySubtitle = styled.div`
  padding-bottom: 10px;
  font-size: 20px;
  font-weight: 500;
  text-align: center;
  font-family: GmarketSansLight;
`;
