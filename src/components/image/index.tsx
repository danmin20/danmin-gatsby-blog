import React, { useMemo } from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import { GatsbyImage, IGatsbyImageData } from 'gatsby-plugin-image';

type ImageProps = {
  src: string;
};

type ImageNodeType = {
  relativePath: string;
  extension: string;
  publicURL: string;
  childImageSharp: {
    gatsbyImageData: IGatsbyImageData;
  };
};

const Image: React.FC<ImageProps> = ({ src, ...rest }) => {
  const data = useStaticQuery(graphql`
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

  const match = useMemo<{ node: ImageNodeType }>(
    () => data.images.edges.find(({ node }: { node: ImageNodeType }) => src === node.relativePath),
    [data, src],
  );

  if (!match) return null;

  const { node } = match;

  if (node.extension === 'svg' || !node.childImageSharp) {
    return <img src={node.publicURL} alt={node.publicURL} {...rest} />;
  }

  return <GatsbyImage image={node.childImageSharp.gatsbyImageData} alt={node.publicURL} {...rest} />;
};

export default Image;
