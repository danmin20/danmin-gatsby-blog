import React, { useMemo, useCallback } from 'react';
import { navigate } from 'gatsby';
import * as S from './styled';

import Layout from '../../layout';
import Seo from '../../components/seo';
import PostClass from '../../models/post';
import { AllMarkdownRemark } from '../../type';
import PostTabs from '../../../src/components/postsTab';

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

  const onTabIndexChange = (value: number) => {
    if (value === 0) return navigate(`/posts`);
    navigate(`/posts/${categories[value]}`);
  };

  return (
    <Layout>
      <Seo title='Posts' />
      <S.CategoryWrapper>
        <S.CategoryTitle>{categories[currentTabIndex]}</S.CategoryTitle>
        <S.CategorySubtitle>{`${posts.length} post${posts.length < 2 ? '' : 's'}`}</S.CategorySubtitle>
      </S.CategoryWrapper>
      <PostTabs posts={posts} onChange={onTabIndexChange} tabs={categories} tabIndex={currentTabIndex} />
    </Layout>
  );
};

export default PostsTemplate;
