import PostClass from '@/src/models/post';
import React from 'react';
import * as S from './styled';

type PostCardProps = {
  post: PostClass;
};

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { id, slug, title, excerpt, date, categories } = post;

  return (
    <S.Wrapper>
      <S.PostCard key={id} to={slug}>
        <S.Title className='title'>{title}</S.Title>
        <S.Description dangerouslySetInnerHTML={{ __html: excerpt }} />
        <S.Info>
          <S.Date>{date}</S.Date>
          <S.Categories>
            {categories.map((category) => {
              if (category !== 'featured')
                return (
                  <S.Category to={`/posts/${category}`} key={category}>
                    {category}
                  </S.Category>
                );
            })}
          </S.Categories>
        </S.Info>
      </S.PostCard>
    </S.Wrapper>
  );
};

export default PostCard;
