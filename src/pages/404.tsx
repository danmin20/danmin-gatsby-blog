import * as React from 'react';
import { graphql } from 'gatsby';

import Layout from '../layout';
import Seo from '../components/seo';
import { SiteMetadata } from '../type';

type NotFoundPageProps = {
  data: {
    site: { siteMetadata: SiteMetadata };
  };
  location: Location;
};

const NotFoundPage: React.FC<NotFoundPageProps> = ({ location, data }) => {
  const siteTitle = data.site.siteMetadata.title;

  return (
    <Layout location={location}>
      <h1>404: Not Found</h1>
      <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
    </Layout>
  );
};

export const Head = () => <Seo title='404: Not Found' />;

export default NotFoundPage;

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`;
