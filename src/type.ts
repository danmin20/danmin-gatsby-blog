export interface SiteMetadata {
  title: string;
  author: Author;
  siteUrl: string;
  social: Social;
  language: string;
  comments: {
    utterances: {
      repo: string;
    };
  };
}

export interface Author {
  name: string;
  nickname: string;
  bio: {
    role: string;
    description: string[];
    thumbnail: string;
  };
  social: Social;
}

export interface Social {
  github: string;
  linkedIn: string;
  resume: string;
  email: string;
}

export interface Post {
  id: string;
  excerpt: string;
  html: string;
  frontmatter: Frontmatter;
  fields: Fields;
}

export interface AllMarkdownRemark {
  edges: { node: MarkdownRemark; next: { fields: Fields }; previous: { fields: Fields } }[];
}

export interface MarkdownRemark {
  id: string;
  frontmatter: Frontmatter;
  fields: Fields;
  excerpt: string;
  html: string;
}

export interface Frontmatter {
  title: string;
  author: string;
  date: string;
  emoji: string;
  categories: string;
}

export interface Fields {
  slug: string;
}
