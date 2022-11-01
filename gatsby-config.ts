import type { GatsbyConfig } from 'gatsby';
import siteMetadata from './gatsby-site-meta-data';

const config: GatsbyConfig = {
  siteMetadata,
  plugins: [
    `gatsby-plugin-typescript`,
    `gatsby-plugin-emotion`,
    `gatsby-plugin-image`,
    `gatsby-plugin-sitemap`,
    {
      resolve: 'gatsby-plugin-robots-txt',
      options: {
        host: 'https://jeong-min.com/',
        sitemap: 'https://jeong-min.com/sitemap.xml',
        policy: [{ userAgent: '*', allow: '/' }],
      },
    },
    // {
    //   resolve: `gatsby-plugin-google-analytics`,
    //   options: {
    //     trackingId: siteMetadata.ga,
    //     head: true,
    //     anonymize: true,
    //   },
    // },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/blog`,
        name: `blog`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 630,
            },
          },
          {
            resolve: `gatsby-remark-responsive-iframe`,
            options: {
              wrapperStyle: `margin-bottom: 1.0725rem`,
            },
          },
          `gatsby-remark-prismjs`,
          `gatsby-remark-copy-linked-files`,
          `gatsby-remark-smartypants`,
        ],
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: siteMetadata.title,
        short_name: siteMetadata.title,
        description: siteMetadata.description,
        start_url: `/`,
        lang: `en`,
        display: `standalone`,
        icon: `static/favicon.ico`,
      },
    },
    {
      resolve: `gatsby-remark-prismjs`,
      options: {
        classPrefix: 'language-',
        inlineCodeMarker: null,
        aliases: {},
        showLineNumbers: false,
        noInlineHighlight: false,
        languageExtensions: [
          {
            language: 'superscript',
            extend: 'javascript',
            definition: {
              superscript_types: /(SuperType)/,
            },
            insertBefore: {
              function: {
                superscript_keywords: /(superif|superelse)/,
              },
            },
          },
        ],
        prompt: {
          user: 'root',
          host: 'localhost',
          global: false,
        },
        escapeEntities: {},
      },
    },
  ],
};

export default config;
