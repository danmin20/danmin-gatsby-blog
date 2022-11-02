import { contentMaxWidth } from '../../../src/styles/const';
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
  height: 100%;
  width: 100%;
  max-width: ${contentMaxWidth};
  border: 1px solid #000;
  border-radius: 6px;
  padding: 15px;
  margin-bottom: 15px;
  cursor: pointer;
  transition: transform 0.2s;
`;

export const Title = styled.div`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 7px;
  line-height: 1.4;
  &:hover {
    text-decoration: underline;
  }
`;

export const Description = styled.p`
  font-size: 13px;
  margin-bottom: 10px;
  line-height: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
`;

export const Info = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: auto;
  font-size: 14px;
`;

export const Date = styled.div``;

export const Categories = styled.div`
  display: flex;
`;

export const Category = styled.div`
  margin-left: 4px;

  &:hover {
    text-decoration: underline;
  }
`;
