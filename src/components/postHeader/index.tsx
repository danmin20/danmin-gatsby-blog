import PostClass from '@/src/models/post';
import React from 'react';
import * as S from './styled';

type PostHeaderProps = {
  post: PostClass;
  viewCount: number;
};

const PostHeader: React.FC<PostHeaderProps> = ({ post, viewCount }) => {
  return (
    <S.Header>
      {post.emoji && <S.Emoji>{post.emoji}</S.Emoji>}
      <S.Info>
        <S.Categories>
          {post.categories.map((category) => (
            <S.Category key={category} to={`/posts/${category}`}>
              {category}
            </S.Category>
          ))}
        </S.Categories>
      </S.Info>

      <S.Title>{post.title}</S.Title>
      <S.Info>
        <S.Author>
          posted by <strong>{post.author}</strong>,
        </S.Author>{' '}
        {post.date}
        {viewCount && ` · ${viewCount} views`}
      </S.Info>
    </S.Header>
  );
};
export default PostHeader;
