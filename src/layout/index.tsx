import { graphql, useStaticQuery } from 'gatsby';
import GlobalStyle from '../styles/GlobalStyle';
import * as S from './styled';
import Header from '../components/header';
import Footer from '../components/footer';
import './style.scss';
import { ThemeProvider } from '@emotion/react';
import { darkTheme, lightTheme } from '../styles/const';
import { getValueFromLocalStorage, setValueToLocalStorage } from '../utils/localStorage';
import ThemeToggle from '../components/themeToggle';
import { useEffect, useState } from 'react';

type LayoutProps = {
  location: Location;
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ location, children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>(getValueFromLocalStorage('theme' ?? 'light'));

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
    <S.Wrapper>
      <ThemeProvider theme={theme === 'dark' ? darkTheme : lightTheme}>
        <GlobalStyle />
        <ThemeToggle handleTheme={handleTheme} isDark={theme === 'dark'} />

        <S.ContentWrapper>
          {location && <Header location={location}>{title}</Header>}
          <S.Content>{children}</S.Content>
        </S.ContentWrapper>
        <Footer />
      </ThemeProvider>
    </S.Wrapper>
  );
};

export default Layout;
