import { colors, contentMaxWidth, hoverUnderline } from '../../styles/const';
import styled from '@emotion/styled';
import { Link } from 'gatsby';

export const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  height: 60px;
  position: fixed;
  top: 0;
  left: 0;
  background-color: ${colors.white100};
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

export const MenuLink = styled(Link)<{ isselected: boolean }>`
  font-size: 17px;
  ${hoverUnderline};
  &:after {
    height: 2px;
    bottom: -2px;
    transform: ${({ isselected }) => (isselected ? 'scaleX(1)' : 'scaleX(0)')};
  }
`;
