import { colors, contentMaxWidth, hoverUnderline } from '../../../src/styles/const';
import styled from '@emotion/styled';
import { Link } from 'gatsby';

export const Wrapper = styled.div`
  min-height: 150px;
  width: 100%;
  display: flex;
  justify-content: center;
`;

export const PostCard = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  height: 100%;
  width: 100%;
  max-width: ${contentMaxWidth};
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 15px;
  cursor: pointer;
  transition: 0.3s;
  &:hover {
    background-color: ${colors.gray10};
  }
`;

export const Title = styled.div`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 10px;
  line-height: 1.4; ;
`;

export const Description = styled.p`
  font-size: 13px;
  margin-bottom: 20px;
  line-height: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  font-family: GmarketSansLight;
`;

export const Info = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  width: 100%;
  color: ${colors.gray60};
  font-family: GmarketSansLight;
`;

export const Date = styled.div``;

export const Categories = styled.div`
  display: flex;
`;

export const Category = styled(Link)`
  margin-left: 4px;
  color: ${colors.gray60};
  ${hoverUnderline};
  &:after {
    background-color: ${colors.gray60};
  }
`;
