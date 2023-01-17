import { hoverUnderline, MOBILE_MEDIA_QUERY } from '../../../src/styles/const';
import styled from '@emotion/styled';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 24px;
  /* background-color:  */
  cursor: pointer;
  width: 381px;
  height: 317px;
  @media ${MOBILE_MEDIA_QUERY} {
    border-radius: 20px;
    width: 100%;
    height: 277px;
  }
`;

export const ProjectLinkButton = styled.a`
  color: ${({ theme }) => theme.color.black100};
  font-size: 16px;
  ${({ theme }) => hoverUnderline(theme)};
`;

export const ImageSection = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 216px;
  @media ${MOBILE_MEDIA_QUERY} {
    height: 188.74px;
  }
`;

export const StyledImage = styled.img`
  border-radius: 24px 24px 0 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  @media ${MOBILE_MEDIA_QUERY} {
    border-radius: 20px 20px 0 0;
  }
`;

export const Content = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  padding: 25px 18px 28px 19px;
  @media ${MOBILE_MEDIA_QUERY} {
    padding: 21.4px 19.89px 24.02px 20.77px;
  }
`;

export const Title = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const Description = styled.div`
  margin-top: 14px;
  line-height: 100%;
  letter-spacing: -0.01em;
  font-size: 14px;
  font-weight: 500;
  @media ${MOBILE_MEDIA_QUERY} {
    margin-top: 12.83px;
  }
`;

export const TechStack = styled.div``;
