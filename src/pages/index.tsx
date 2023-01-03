import React from 'react';
import { graphql } from 'gatsby';
import Bio from '../components/bio';
import Layout from '../layout';
import Seo from '../components/seo';
import { AllMarkdownRemark, SiteMetadata } from '../type';
import PostClass from '../models/post';
import FeaturedPostColumn from '../components/featuredPostColumn';
import styled from '@emotion/styled';
import { useViewCount } from '../hooks/useViewCount';
import { MOBILE_MEDIA_QUERY } from '../styles/const';

type BlogIndexProps = {
  data: {
    site: { siteMetadata: SiteMetadata };
    allMarkdownRemark: AllMarkdownRemark;
  };
  location: Location;
};

const BlogIndex: React.FC<BlogIndexProps> = ({ location, data }) => {
  const posts = data.allMarkdownRemark.edges.map(({ node }) => new PostClass(node));
  const featuredPosts = posts.filter((node) => node.categories.find((category) => category === 'featured'));
  const { siteUrl, author } = data.site.siteMetadata;

  const internPosts = featuredPosts.filter((post) => post.categories.find((category) => category === '인턴회고'));
  const livePosts = featuredPosts.filter((post) => post.categories.find((category) => category === '회고'));
  const experiencePosts = featuredPosts.filter((post) => post.categories.find((category) => category === 'Experience'));

  const { viewCount: hitCount } = useViewCount(siteUrl, 'home');

  return (
    <Layout location={location}>
      <Seo title='개발자 단민' />

      <HitCount>
        <div>✨Hits: {hitCount ?? 0}</div>
      </HitCount>
      <Bio author={author} />

      <FeaturedPostColumn title='인턴만 다섯 번을 한 사람이 있다?' posts={internPosts} />
      <FeaturedPostColumn title='LIFE' posts={livePosts} />
      <FeaturedPostColumn title='EXPERIENCE' posts={experiencePosts} />
    </Layout>
  );
};

export default BlogIndex;

export const pageQuery = graphql`
  query {
    allMarkdownRemark(sort: { fields: frontmatter___date, order: DESC }) {
      edges {
        node {
          id
          excerpt(pruneLength: 500, truncate: true)
          frontmatter {
            categories
            title
            emoji
            date(formatString: "YYYY.MM.DD")
          }
          fields {
            slug
          }
        }
      }
    }

    site {
      siteMetadata {
        siteUrl
        language
        author {
          name
          nickname
          bio {
            role
            description
            birth
            residence
            bachelorDegree
          }
          social {
            github
            linkedIn
            resume
            email
          }
        }
      }
    }
  }
`;

const HitCount = styled.div`
  color: ${({ theme }) => theme.color.white100};
  font-size: 12px;
  position: absolute;
  left: 0;
  top: 70px;
  & > div {
    width: fit-content;
    background-color: ${({ theme }) => theme.color.black40};
    padding: 5px 8px;
    padding-top: 6px;
    border-radius: 20px;
  }

  @media ${MOBILE_MEDIA_QUERY} {
    left: 10px;
    top: 40px;
  }
`;
