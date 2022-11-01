import { contentMaxWidth } from '../../styles/const';
import styled from '@emotion/styled';

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

  .link {
    font-weight: 700;
    font-size: 17px;
  }
`;

export const Menu = styled.div`
  display: flex;
  align-items: center;

  .link {
    margin-right: 10px;
  }
`;
