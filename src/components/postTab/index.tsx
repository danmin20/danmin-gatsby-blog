import React, { useMemo } from 'react';

import PostClass from '@/src/models/post';

import PostCard from '../postCard';
import * as S from './styled';

type PostTabsProps = {
  tabIndex: number;
  onChange: (value: number) => void;
  tabs: string[];
  posts: PostClass[];
};

const PostTabs: React.FC<PostTabsProps> = ({ tabIndex, onChange, tabs, posts }) => {
  const tabPosts = useMemo(() => {
    if (tabs[tabIndex] === 'All') return posts;
    return posts.filter((post) => post.categories.includes(tabs[tabIndex]));
  }, [posts, tabs, tabIndex]);

  return (
    <S.Wrapper>
      <S.Tabs>
        {tabs.map((title, index) => (
          <S.Tab key={index} isSelected={tabIndex === index ? 'true' : 'false'} onClick={() => onChange(index)}>
            {title}
          </S.Tab>
        ))}
      </S.Tabs>

      <S.PostCardsWrapper>
        {tabPosts.map((post, index) => (
          <PostCard key={index} post={post} />
        ))}
      </S.PostCardsWrapper>
    </S.Wrapper>
  );
};

export default PostTabs;
