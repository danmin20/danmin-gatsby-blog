import React, { useMemo } from 'react';
import PostClass from '@/src/models/post';
import * as S from './styled';
import PostColumn from '../postColumn';

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

  const moreUrl = `posts/${tabIndex === 0 ? '' : tabs[tabIndex]}`;

  return (
    <S.Wrapper>
      <S.Tabs>
        {tabs.map((title, index) => (
          <S.Tab key={index} onClick={() => onChange(index)}>
            {title}
          </S.Tab>
        ))}
      </S.Tabs>

      <PostColumn posts={tabPosts.slice(0, 4)} moreUrl={moreUrl} />
    </S.Wrapper>
  );
};

export default PostTabs;
