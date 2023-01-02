import PostClass from '../../../src/models/post';
import FeaturedPostCard from '../featuredPostCard';
import * as S from './styled';

type FeaturedPostColumnProps = {
  title: string;
  posts: PostClass[];
};

const FeaturedPostColumn: React.FC<FeaturedPostColumnProps> = ({ title, posts }) => {
  return (
    <S.Wrapper>
      <S.Title>{title}</S.Title>
      {posts.map((post, index) => (
        <FeaturedPostCard key={index} post={post} />
      ))}
    </S.Wrapper>
  );
};

export default FeaturedPostColumn;
