import { colors } from '../../../src/styles/const';
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
  background-color: ${colors.gray10};
  border-radius: 6px;
  padding: 15px;

  cursor: pointer;
  transition: 0.3s;

  &:hover {
    background-color: ${colors.gray20};
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
  color: ${colors.gray60};
  margin-bottom: 10px;
`;

export const Title = styled.div`
  font-size: 16px;
  line-height: 150%;
`;
