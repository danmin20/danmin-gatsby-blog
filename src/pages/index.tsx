import React, { useCallback, useState } from 'react';
import { graphql } from 'gatsby';

import Bio from '../components/bio';
import Layout from '../layout';
import Seo from '../components/seo';
import { AllMarkdownRemark, SiteMetadata } from '../type';
import PostClass from '../models/post';
import { getUniqueCategories } from '../utils/helpers';

type BlogIndexProps = {
  data: {
    site: { siteMetadata: SiteMetadata };
    allMarkdownRemark: AllMarkdownRemark;
  };
};

const BlogIndex: React.FC<BlogIndexProps> = ({ data }) => {
  const posts = data.allMarkdownRemark.edges.map(({ node }) => new PostClass(node));
  const { author, language } = data.site.siteMetadata;
  const categories = ['All', ...getUniqueCategories(posts)];
  const featuredTabIndex = categories.findIndex((category) => category === 'featured');
  const [tabIndex, setTabIndex] = useState(featuredTabIndex === -1 ? 0 : featuredTabIndex);
  const onTabIndexChange = useCallback((_e: void, value: number) => setTabIndex(value), []);

  return (
    <Layout>
      <Seo title='Home' />
      <Bio author={author} />
      {/* <PostTabs posts={posts} onChange={onTabIndexChange} tabs={categories} tabIndex={tabIndex} showMoreButton /> */}
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
          bio {
            role
            description
            thumbnail
          }
          social {
            github
            linkedIn
            email
          }
        }
      }
    }
  }
`;
