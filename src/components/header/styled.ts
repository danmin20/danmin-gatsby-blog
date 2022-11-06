import { contentMaxWidth, hoverUnderline } from '../../styles/const';
import styled from '@emotion/styled';
import { Link } from 'gatsby';

export const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  height: 60px;
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

export const MenuLink = styled(Link)`
  font-size: 17px;
  ${hoverUnderline};
  &:after {
    height: 2px;
    bottom: -2px;
  }
`;
