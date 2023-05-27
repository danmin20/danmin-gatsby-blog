import './style.scss';

import { ThemeProvider } from '@emotion/react';
import { graphql, useStaticQuery } from 'gatsby';
import { useEffect, useState } from 'react';

import Footer from '../components/footer';
import Header from '../components/header';
import ThemeToggle from '../components/themeToggle';
import { darkTheme, lightTheme } from '../styles/const';
import GlobalStyle from '../styles/GlobalStyle';
import { getValueFromLocalStorage, setValueToLocalStorage } from '../utils/localStorage';
import * as S from './styled';

type LayoutProps = {
  location: Location;
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ location, children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>(getValueFromLocalStorage('theme') ?? 'light');

  const handleTheme = () => {
    if (theme === 'dark') setTheme('light');
    else setTheme('dark');
  };

  useEffect(() => {
    setValueToLocalStorage('theme', theme);
  }, [theme]);

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
    <ThemeProvider theme={theme === 'dark' ? darkTheme : lightTheme}>
      <GlobalStyle />
      <S.Wrapper>
        <ThemeToggle handleTheme={handleTheme} isDark={theme === 'dark'} />
        <S.ContentWrapper>
          {location && <Header location={location} title={title} />}
          <S.Content>{children}</S.Content>
        </S.ContentWrapper>
        <Footer />
      </S.Wrapper>
    </ThemeProvider>
  );
};

export default Layout;
