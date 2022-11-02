import React, { useMemo, useCallback } from 'react';
import { navigate } from 'gatsby';

import Layout from '../layout';
import Seo from '../components/seo';
import Post from '../models/post';
import PostClass from '../models/post';
import { AllMarkdownRemark } from '../type';

type PostsTemplateProps = {
  pageContext: {
    currentCategory: string;
    categories: string[];
    edges: AllMarkdownRemark['edges'];
  };
};

const PostsTemplate: React.FC<PostsTemplateProps> = ({ pageContext }) => {
  const { edges, currentCategory } = pageContext;
  const { categories } = pageContext;
  const currentTabIndex = useMemo(
    () => categories.findIndex((category) => category === currentCategory),
    [categories, currentCategory],
  );
  const posts = edges.map(({ node }) => new PostClass(node));

  // const onTabIndexChange = useCallback(
  //   (e, value) => {
  //     if (value === 0) return navigate(`/posts`);
  //     navigate(`/posts/${categories[value]}`);
  //   },
  //   [categories],
  // );

  return (
    <Layout>
      <Seo title='Posts' />
      {/* <CategoryPageHeader title={categories[currentTabIndex]} subtitle={`${posts.length} posts`} />
      <PostTabs
        tabIndex={currentTabIndex}
        onChange={onTabIndexChange}
        tabs={categories}
        posts={posts}
      /> */}
    </Layout>
  );
};

export default PostsTemplate;
