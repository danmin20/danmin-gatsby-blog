import * as React from 'react';
import { graphql, Link, useStaticQuery } from 'gatsby';
import GlobalStyle from '../styles/GlobalStyle';
import * as S from './styled';

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
          author {
            name
            social {
              github
            }
          }
        }
      }
    }
  `);
  const { title, author } = data.site.siteMetadata;

  return (
    <S.Wrapper>
      <GlobalStyle />
      <header className='global-header'>{title}</header>
      <main>{children}</main>
      <footer>
        © {new Date().getFullYear()}, Built with
        {` `}
        <a href='https://www.gatsbyjs.com'>Gatsby</a>
      </footer>
    </S.Wrapper>
  );
};

export default Layout;
