import React from 'react';
import { graphql } from 'gatsby';
import Layout from '../layout';
import Seo from '../components/seo';
import Bio from '../components/bio';
import { SiteMetadata } from '../type';
import Introduction from '../components/introduction';
import Timestamps from '../components/timestamps';

type AboutPageProps = {
  data: {
    site: { siteMetadata: SiteMetadata };
  };
  location: Location;
};

const AboutPage: React.FC<AboutPageProps> = ({ location, data }) => {
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

export default AboutPage;

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        language
        author {
          name
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

          projects {
            title
            description
            techStack
            thumbnailUrl
            links {
              post
              github
              demo
              googlePlay
              appStore
            }
          }
        }
      }
    }
  }
`;
