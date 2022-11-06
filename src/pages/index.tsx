import React from 'react';
import { graphql } from 'gatsby';

import Bio from '../components/bio';
import Layout from '../layout';
import Seo from '../components/seo';
import { AllMarkdownRemark, SiteMetadata } from '../type';
import Introduction from '../components/introduction';
import PostTabs from '../components/postTab';
import PostClass from '../models/post';
import PostColumn from '../components/postColumn';

type BlogIndexProps = {
  data: {
    site: { siteMetadata: SiteMetadata };
    allMarkdownRemark: AllMarkdownRemark;
  };
};

const BlogIndex: React.FC<BlogIndexProps> = ({ data }) => {
  const posts = data.allMarkdownRemark.edges.map(({ node }) => new PostClass(node));
  const featuredPosts = posts.filter((node) => node.categories.findIndex((category) => category === 'featured'));
  const { author, language } = data.site.siteMetadata;

  return (
    <Layout>
      <Seo title='Home' />
      <Bio author={author} />
      <PostColumn posts={featuredPosts} />
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
            date(formatString: "MMMM DD, YYYY")
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
