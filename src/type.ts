export interface SiteSiteMetadata {
  title: string;
  author: Author;
  siteUrl: string;
  social: Social;
}

export interface Author {
  name: string;
  summary: string;
}

export interface Social {
  twitter: string;
}

export interface MarkdownRemark extends Node {
  id: string;
  frontmatter: Frontmatter;
  fields: Fields;
  excerpt: string;
}

export interface Frontmatter {
  title: string;
  description: string;
  date: string;
}

export interface Fields {
  slug: string;
}
