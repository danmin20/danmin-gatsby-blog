import * as React from 'react';
import PropTypes from 'prop-types';
import { useStaticQuery, graphql } from 'gatsby';
import { Helmet } from 'react-helmet';

type SeoProps = {
  description?: string;
  title: string;
  children?: React.ReactNode;
};

const Seo: React.FC<SeoProps> = ({ description, title, children }) => {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
            author {
              name
            }
            ogImage
          }
        }
      }
    `,
  );

  const metaDescription = description || site.siteMetadata.description;
  return (
    <Helmet
      htmlAttributes={{ lang: 'en' }}
      title={title}
      defaultTitle={site.siteMetadata.title}
      meta={[
        {
          property: `og:title`,
          content: title,
        },
        {
          property: `og:site_title`,
          content: title,
        },
        {
          name: `description`,
          content: metaDescription,
        },
        {
          property: `og:description`,
          content: metaDescription,
        },
        {
          property: 'og:author',
          content: site.siteMetadata.author.name,
        },
        {
          property: 'og:image',
          content: site.siteMetadata.ogImage,
        },

        {
          property: `og:type`,
          content: `website`,
        },
      ]}
    />
  );
};

Seo.defaultProps = {
  description: ``,
};

Seo.propTypes = {
  description: PropTypes.string as React.Validator<string>,
  title: PropTypes.string.isRequired,
};

export default Seo;
