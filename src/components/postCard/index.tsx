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
        <S.Title>{title}</S.Title>
        <S.Description dangerouslySetInnerHTML={{ __html: excerpt }} />
        <S.Info>
          <S.Date className='date'>{date}</S.Date>
          <S.Categories className='categories'>
            {categories.map((category) => (
              <S.Category className='category' key={category}>
                {category}
              </S.Category>
            ))}
          </S.Categories>
        </S.Info>
      </S.PostCard>
    </S.Wrapper>
  );
};

export default PostCard;
