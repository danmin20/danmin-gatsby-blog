import styled from '@emotion/styled';
import { Link } from 'gatsby';

export const Wrapper = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: 49.3% 49.3%;
  column-gap: 1.4%;
`;

export const PostCard = styled(Link)`
  display: flex;
  flex-direction: column;
  width: 100%;
  border: 1px solid #000;
  border-radius: 6px;
  padding: 15px;

  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    .title {
      text-decoration: underline;
    }
  }

  &.prev {
    margin-right: auto;
  }

  &.next {
    margin-left: auto;
  }
`;

export const Direction = styled.div`
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 5px;
`;

export const Title = styled.div`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 7px;
  line-height: 1.4;
`;
