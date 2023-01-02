import React from 'react';
import { graphql } from 'gatsby';
import Bio from '../components/bio';
import Layout from '../layout';
import Seo from '../components/seo';
import { AllMarkdownRemark, SiteMetadata } from '../type';
import PostClass from '../models/post';
import PostColumn from '../components/postColumn';
import FeaturedPostColumn from '../components/featuredPostColumn';

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
  const { author } = data.site.siteMetadata;

  const internPosts = featuredPosts.filter((post) => post.categories.find((category) => category === '인턴회고'));
  const livePosts = featuredPosts.filter((post) => post.categories.find((category) => category === '회고'));
  const experiencePosts = featuredPosts.filter((post) => post.categories.find((category) => category === 'Experience'));

  return (
    <Layout location={location}>
      <Seo title='개발자 단민' />
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
