import * as React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import GlobalStyle from '../styles/GlobalStyle';
import * as S from './styled';
import Header from '../components/header';
import Footer from '../components/footer';

import './style.scss';

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
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
      <GlobalStyle />
      <S.ContentWrapper>
        <Header>{title}</Header>
        <S.Content>{children}</S.Content>
      </S.ContentWrapper>
      <Footer />
    </S.Wrapper>
  );
};

export default Layout;
