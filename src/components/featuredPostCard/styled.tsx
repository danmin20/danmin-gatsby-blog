import { colors, contentMaxWidth, MOBILE_MEDIA_QUERY } from '../../../src/styles/const';
import styled from '@emotion/styled';
import { Link } from 'gatsby';

export const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
`;

export const PostCard = styled(Link)`
  display: flex;
  height: 100%;
  width: 100%;
  max-width: ${contentMaxWidth};
  border-radius: 10px;
  margin-bottom: 5px;
  cursor: pointer;
  transition: 0.3s;
  gap: 15px;
  align-items: center;

  &:hover {
    background-color: ${colors.gray10};
  }

  @media ${MOBILE_MEDIA_QUERY} {
    min-height: 50px;
  }
`;

export const Emoji = styled.div`
  font-size: 40px;
  background-color: ${colors.gray10};
  border-radius: 50%;
  padding: 10px;

  @media ${MOBILE_MEDIA_QUERY} {
    font-size: 30px;
  }
`;

export const Title = styled.div`
  font-size: 18px;

  @media ${MOBILE_MEDIA_QUERY} {
    font-size: 15px;
  }
`;

export const Date = styled.div`
  font-size: 13px;
  color: ${colors.gray60};
  font-family: GmarketSansLight;
  margin-top: 3px;

  @media ${MOBILE_MEDIA_QUERY} {
    margin-left: auto;
  }
`;
