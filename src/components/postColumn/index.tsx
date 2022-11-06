import PostClass from '../../../src/models/post';
import { navigate } from 'gatsby';
import { useCallback } from 'react';
import PostCard from '../postCard';
import * as S from './styled';

type PostColumnProps = {
  posts: PostClass[];
  showMoreButton?: boolean;
  moreUrl?: string;
};

const PostColumn: React.FC<PostColumnProps> = ({ posts, showMoreButton, moreUrl }) => {
  const onMoreButtonClick = useCallback(() => {
    if (moreUrl) navigate(moreUrl);
  }, [moreUrl]);

  return (
    <S.Wrapper>
      {posts.map((post, index) => (
        <PostCard key={index} post={post} />
      ))}
      {showMoreButton && posts.length > 4 && <S.MoreButton onClick={onMoreButtonClick}>More</S.MoreButton>}
    </S.Wrapper>
  );
};

export default PostColumn;
