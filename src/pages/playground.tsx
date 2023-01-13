import React from 'react';
import { graphql } from 'gatsby';
import Layout from '../layout';
import Seo from '../components/seo';
import { SiteMetadata } from '../type';
import styled from '@emotion/styled';
import ProjectSection from '../components/projectSection';

type AboutPageProps = {
  data: {
    site: { siteMetadata: SiteMetadata };
  };
  location: Location;
};

const AboutPage: React.FC<AboutPageProps> = ({ location, data }) => {
  const metaData = data.site.siteMetadata;
  const { about } = metaData;
  const { projects } = about;

  return (
    <Layout location={location}>
      <Seo title='개발자 단민 | Playground' />
      <Title>Enjoying making fun things</Title>
      <ProjectSection projects={projects} />
    </Layout>
  );
};

export default AboutPage;

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        about {
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

const Title = styled.div``;
