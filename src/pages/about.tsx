import { graphql } from 'gatsby';
import React from 'react';

import Bio from '../components/bio';
import Introduction from '../components/introduction';
import Seo from '../components/seo';
import Timestamps from '../components/timestamps';
import Layout from '../layout';
import { SiteMetadata } from '../type';

type AboutProps = {
  data: {
    site: { siteMetadata: SiteMetadata };
  };
  location: Location;
};

const About: React.FC<AboutProps> = ({ location, data }) => {
  const metaData = data.site.siteMetadata;
  const { author, about } = metaData;
  const { careers, activities } = about;

  return (
    <Layout location={location}>
      <Seo title='개발자 단민 | About' />
      <Bio author={author} />
      <Introduction author={author} />
      <Timestamps title='Careers' timestamps={careers} />
      <Timestamps title='Activities' timestamps={activities} />
    </Layout>
  );
};

export default About;

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
            email
            resume
          }
        }

        about {
          careers {
            date
            kr
            en
            info
          }

          activities {
            date
            kr
            en
            info
            link
          }
        }
      }
    }
  }
`;
