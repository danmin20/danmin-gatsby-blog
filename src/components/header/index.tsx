import React, { ReactNode } from 'react';
import * as S from './styled';

type HeaderProps = {
  location: Location;
  children: ReactNode;
};

const Header: React.FC<HeaderProps> = ({ location, children }) => {
  const { pathname } = location;

  return (
    <S.Wrapper>
      <S.Header>
        <div>
          <S.MenuLink to='/' isselected='false'>
            {children}
          </S.MenuLink>
        </div>
        <S.Menu>
          <S.MenuLink to='/posts' isselected={(pathname === '/posts').toString()}>
            posts
          </S.MenuLink>
          <S.MenuLink to='/about' isselected={(pathname === '/about').toString()}>
            about
          </S.MenuLink>
        </S.Menu>
      </S.Header>
    </S.Wrapper>
  );
};

export default Header;
