import { colors } from '../../../src/styles/const';
import styled from '@emotion/styled';
import { Link } from 'gatsby';

export const Header = styled.header`
  display: flex;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  padding-bottom: 10px;
  border-bottom: 1px solid ${colors.black100};
  margin-top: 20px;
  margin-bottom: 40px;
  word-break: keep-all;
`;

export const Emoji = styled.div`
  font-size: 78px;
  margin-bottom: 20px;
`;

export const Info = styled.div`
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  line-height: 1.5;
  font-size: 16px;
  font-weight: 500;
  strong {
    font-weight: 600;
  }
`;

export const Categories = styled.div`
  margin-bottom: 5px;
`;

export const Category = styled(Link)`
  margin-right: 4px;
  font-weight: 600;

  &:hover {
    text-decoration: underline;
  }
`;

export const Title = styled.h1`
  font-weight: 600;
  font-size: 32px;
  margin-bottom: 6px;
  line-height: 1.3;
`;

export const Author = styled.div`
  margin-right: 4px;
`;
