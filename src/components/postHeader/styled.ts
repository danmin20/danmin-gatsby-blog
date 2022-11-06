import { colors, hoverUnderline } from '../../../src/styles/const';
import styled from '@emotion/styled';
import { Link } from 'gatsby';

export const Header = styled.header`
  display: flex;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  padding-bottom: 40px;
  border-bottom: 1px solid ${colors.gray20};
  margin: 40px 0;
  word-break: keep-all;
`;

export const Emoji = styled.div`
  font-size: 78px;
  margin-bottom: 20px;
`;

export const Info = styled.div`
  display: flex;
  font-size: 15px;
  color: ${colors.gray80};
  font-family: GmarketSansLight;
`;

export const Categories = styled.div`
  margin-bottom: 5px;
  font-size: 15px;
`;

export const Category = styled(Link)`
  margin-right: 4px;
  color: ${colors.gray60};
  ${hoverUnderline};
  &:after {
    background-color: ${colors.gray60};
  }
`;

export const Title = styled.h1`
  font-size: 32px;
  margin-bottom: 6px;
  line-height: 1.3;
`;
