import * as React from 'react';
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

type LayoutProps = {
  location: Location;
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ location, children }) => {
  const storedTheme: string = getValueFromLocalStorage('theme');

  const [isDark, setIsDark] = React.useState(storedTheme === 'light');

  React.useEffect(() => {
    setValueToLocalStorage('theme', isDark ? 'light' : 'dark');
  }, [isDark]);

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
      <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
        <GlobalStyle />
        <ThemeToggle handleTheme={() => setIsDark((isDark) => !isDark)} isDark={isDark} />

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
