import { Link, graphql, useStaticQuery } from 'gatsby';
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
          <Link className='link' to='/'>
            {children}
          </Link>
        </div>
        <S.Menu>
          <Link className='link' to='/about'>
            about
          </Link>
          <Link className='link' to='/posts'>
            posts
          </Link>
          {/* <PostSearch
                posts={data.allMarkdownRemark.edges.map(({ node }) => new PostClass(node, true))}
              /> */}
        </S.Menu>
      </S.Header>
    </S.Wrapper>
  );
};

export default Header;
