import React from 'react';
import { graphql } from 'gatsby';

import Bio from '../components/bio';
import Layout from '../layout';
import Seo from '../components/seo';
import { AllMarkdownRemark, SiteMetadata } from '../type';
import Introduction from '../components/introduction';

type BlogIndexProps = {
  data: {
    site: { siteMetadata: SiteMetadata };
    allMarkdownRemark: AllMarkdownRemark;
  };
};

const BlogIndex: React.FC<BlogIndexProps> = ({ data }) => {
  const { author } = data.site.siteMetadata;

  return (
    <Layout>
      <Seo title='Home' />
      <Bio author={author} />
      <Introduction author={author} />
    </Layout>
  );
};

export default BlogIndex;

export const pageQuery = graphql`
  query {
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
