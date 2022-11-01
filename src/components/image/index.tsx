import React, { ImgHTMLAttributes, useMemo } from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import { GatsbyImage, GatsbyImageProps, IGatsbyImageData } from 'gatsby-plugin-image';

type ImageProps = Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  'placeholder' | 'onLoad' | 'src' | 'srcSet' | 'width' | 'height'
> & {
  src: string;
};

type ImageQuery = {
  images: {
    edges: {
      node: {
        relativePath: string;
        extension: string;
        publicURL: string;
        childImageSharp: {
          gatsbyImageData: IGatsbyImageData;
        };
      };
    }[];
  };
};

const Image: React.FC<ImageProps> = ({ src, ...rest }) => {
  const data: ImageQuery = useStaticQuery(graphql`
    query {
      images: allFile(filter: { sourceInstanceName: { eq: "assets" } }) {
        edges {
          node {
            relativePath
            extension
            publicURL
            childImageSharp {
              gatsbyImageData(layout: CONSTRAINED)
            }
          }
        }
      }
    }
  `);

  const match = useMemo(() => data.images.edges.find(({ node }) => src === node.relativePath), [data, src]);

  if (!match) return null;

  const { node: { childImageSharp, publicURL, extension } = {} } = match;

  if (extension === 'svg' || !childImageSharp) {
    return <img src={publicURL} alt={publicURL} {...rest} />;
  }

  return <GatsbyImage image={childImageSharp.gatsbyImageData} alt={publicURL ?? ''} {...rest} />;
};

export default Image;
