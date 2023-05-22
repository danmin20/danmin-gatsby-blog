import styled from '@emotion/styled';
import { Link } from 'gatsby';

import { contentMaxWidth, hoverUnderline, MOBILE_MEDIA_QUERY } from '../../styles/const';

export const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  height: 60px;
  position: fixed;
  top: 0;
  left: 0;
  background-color: ${({ theme }) => theme.color.white100};
  z-index: 100;

  @media ${MOBILE_MEDIA_QUERY} {
    padding: 0 15px;
  }
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: ${contentMaxWidth};
  font-family: GmarketSansBold;
`;

export const Menu = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

export const MenuLink = styled(Link)<{ isselected: string }>`
  font-size: 17px;
  ${({ theme }) => hoverUnderline(theme)};
  &:after {
    height: 2px;
    bottom: -2px;
    transform: ${({ isselected }) => (isselected === 'true' ? 'scaleX(1)' : 'scaleX(0)')};
  }

  &:hover:after {
    @media ${MOBILE_MEDIA_QUERY} {
      transform: ${({ isselected }) => (isselected === 'true' ? 'scaleX(1)' : 'scaleX(0)')};
    }
  }

  @media ${MOBILE_MEDIA_QUERY} {
    font-size: 13px;
  }
`;
