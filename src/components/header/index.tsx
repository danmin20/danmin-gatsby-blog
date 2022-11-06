import React, { ReactNode } from 'react';
import * as S from './styled';
// import PostSearch from '../post-search';

type HeaderProps = {
  children: ReactNode;
};

const Header: React.FC<HeaderProps> = ({ children }) => {
  //   const { data } = useStaticQuery(
  //     graphql`
  //       query {
  //         allMarkdownRemark(sort: { fields: frontmatter___date, order: DESC }) {
  //           edges {
  //             node {
  //               frontmatter {
  //                 title
  //                 categories
  //               }
  //               fields {
  //                 slug
  //               }
  //             }
  //           }
  //         }
  //       }
  //     `,
  //   );

  return (
    <S.Wrapper>
      <S.Header>
        <div>
          <S.MenuLink to='/'>{children}</S.MenuLink>
        </div>
        <S.Menu>
          <S.MenuLink to='/about'>about</S.MenuLink>
          <S.MenuLink to='/posts'>posts</S.MenuLink>
          {/* <PostSearch
                posts={data.allMarkdownRemark.edges.map(({ node }) => new PostClass(node, true))}
              /> */}
        </S.Menu>
      </S.Header>
    </S.Wrapper>
  );
};

export default Header;
