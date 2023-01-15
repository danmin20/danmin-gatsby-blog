import React from 'react';
import { graphql } from 'gatsby';
import Layout from '../layout';
import Seo from '../components/seo';
import { SiteMetadata } from '../type';
import styled from '@emotion/styled';
import ProjectCard from '../components/projectCard';
import { MOBILE_MEDIA_QUERY } from '../styles/const';

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
      <ProjectCardsWrapper>
        {projects.map((project, index) => (index === 0 ? null : <ProjectCard project={project} />))}
      </ProjectCardsWrapper>
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

const ProjectCardsWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  column-gap: 29px;
  margin-top: 60px;
  row-gap: 64px;
  @media ${MOBILE_MEDIA_QUERY} {
    display: flex;
    flex-direction: column;
    gap: 26px;
    margin-top: 26px;
  }
`;
