import path from 'path';
import { createFilePath } from 'gatsby-source-filesystem';
import type { Actions, GatsbyNode } from 'gatsby';
import { AllMarkdownRemark, MarkdownRemark } from './src/type';

export const onCreateWebpackConfig: GatsbyNode['onCreateWebpackConfig'] = ({ getConfig, actions }) => {
  const output = getConfig().output || {};

  actions.setWebpackConfig({
    output,
    resolve: {
      alias: {
        components: path.resolve(__dirname, 'src/components'),
        utils: path.resolve(__dirname, 'src/utils'),
        hooks: path.resolve(__dirname, 'src/hooks'),
      },
    },
  });
};

type CreatePagesFuncProps = {
  createPage: Actions['createPage'];
  edges: AllMarkdownRemark['edges'];
};

const createBlogPages = ({ createPage, edges }: CreatePagesFuncProps) => {
  // Define a template for blog post
  const blogPost = path.resolve(`./src/templates/blog-post.js`);

  edges.forEach(({ node, next, prev }) => {
    createPage({
      path: node.fields.slug,
      component: blogPost,
      context: {
        // additional data can be passed via context
        slug: node.fields.slug,
        nextSlug: next?.fields.slug ?? '',
        prevSlug: prev?.fields.slug ?? '',
      },
    });
  });
};

const createPostsPages = ({ createPage, edges }: CreatePagesFuncProps) => {
  // Define a template for blog post
  const blogPost = path.resolve(`./src/templates/blog-post.js`);
  const categorySet = new Set(['All']);

  edges.forEach(({ node }) => {
    const postCategories = node.frontmatter.categories.split(' ');
    postCategories.forEach((category) => categorySet.add(category));
  });

  const categories = [...categorySet];

  createPage({
    path: `/posts`,
    component: blogPost,
    context: { currentCategory: 'All', edges, categories },
  });

  categories.forEach((currentCategory) => {
    createPage({
      path: `/posts/${currentCategory}`,
      component: blogPost,
      context: {
        currentCategory,
        categories,
        edges: edges.filter(({ node }) => node.frontmatter.categories.includes(currentCategory)),
      },
    });
  });
};

export const createPages: GatsbyNode['createPages'] = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions;

  // Get all markdown blog posts sorted by date
  const result: {
    errors?: any;
    data?: {
      allMarkdownRemark: AllMarkdownRemark;
    };
  } = await graphql(`
    {
      allMarkdownRemark(sort: { order: DESC, fields: [frontmatter___date] }, limit: 1000) {
        edges {
          node {
            id
            excerpt(pruneLength: 500, truncate: true)
            fields {
              slug
            }
            frontmatter {
              categories
              title
              date(formatString: "MMMM DD, YYYY")
            }
          }
          next {
            fields {
              slug
            }
          }
          prev {
            fields {
              slug
            }
          }
        }
      }
    }
  `);

  if (result.errors || !result.data) {
    reporter.panicOnBuild(`There was an error loading your blog posts`, result.errors);
    return;
  }

  createBlogPages({ createPage, edges: result.data.allMarkdownRemark.edges });
  createPostsPages({ createPage, edges: result.data.allMarkdownRemark.edges });
};

export const onCreateNode: GatsbyNode['onCreateNode'] = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode });

    createNodeField({
      name: `slug`,
      node,
      value,
    });
  }
};