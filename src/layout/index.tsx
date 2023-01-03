import * as React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import GlobalStyle from '../styles/GlobalStyle';
import * as S from './styled';
import Header from '../components/header';
import Footer from '../components/footer';

import './style.scss';
import { ThemeProvider } from '@emotion/react';
import styled from '@emotion/styled';
import { darkTheme, lightTheme } from '../styles/const';
import { getValueFromLocalStorage, setValueToLocalStorage } from '../utils/localStorage';

type LayoutProps = {
  location: Location;
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ location, children }) => {
  const storedTheme: 'light' | 'dark' = getValueFromLocalStorage('theme') ?? 'light';

  const [theme, setTheme] = React.useState(storedTheme);

  const handleTheme = () => {
    if (storedTheme === 'light') {
      setTheme('dark');
      setValueToLocalStorage('theme', 'dark');
    } else {
      setTheme('light');
      setValueToLocalStorage('theme', 'light');
    }
  };

  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `);
  const { title } = data.site.siteMetadata;

  return (
    <S.Wrapper>
      <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
        <GlobalStyle />
        <ThemeToggle onClick={handleTheme} isDark={theme === 'dark'}>
          {theme === 'dark' ? 'LIGHT MODE' : 'DARK MODE'}
        </ThemeToggle>

        <S.ContentWrapper>
          {location && <Header location={location}>{title}</Header>}
          <S.Content>{children}</S.Content>
        </S.ContentWrapper>
        <Footer />
      </ThemeProvider>
    </S.Wrapper>
  );
};

const ThemeToggle = styled.div<{ isDark: boolean }>`
  cursor: pointer;
  font-size: 1.5rem;
  position: fixed;
  z-index: 1000;
  top: 0;
  right: 0;
  background-color: red;
  transition: 0.3s;
  &:hover {
    transition: 0.3s;
    color: ${({ theme }) => theme.color.black100};
  }
`;

export default Layout;
