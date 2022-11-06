export type SiteMetadata = {
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
  about: {
    careers: Career[];
    activities: Activity[];
    projects: Project[];
  };
};

export type Career = {
  date: string;
  kr: string;
  en: string;
  info: string;
};

export type Activity = {
  date: string;
  kr: string;
  en: string;
  info: string;
  link: string;
};

export type Project = {
  title: string;
  description: string;
  techStack: string[];
  thumbnailUrl: string;
  links: {
    post: string;
    github: string;
    googlePlay: string;
    appStore: string;
    demo: string;
  };
};

export type Author = {
  name: string;
  nickname: string;
  bio: {
    role: string;
    description: string[];
    birth: string;
    residence: string;
    bachelorDegree: string;
  };
  social: Social;
};

export type Social = {
  github: string;
  linkedIn: string;
  resume: string;
  email: string;
};

export type Post = {
  id: string;
  excerpt: string;
  html: string;
  frontmatter: Frontmatter;
  fields: Fields;
};

export type AllMarkdownRemark = {
  edges: { node: MarkdownRemark; next: { fields: Fields }; previous: { fields: Fields } }[];
};

export type MarkdownRemark = {
  id: string;
  frontmatter: Frontmatter;
  fields: Fields;
  excerpt: string;
  html: string;
};

export type Frontmatter = {
  title: string;
  author: string;
  date: string;
  emoji: string;
  categories: string;
};

export type Fields = {
  slug: string;
};
