import PostClass from '../../../src/models/post';
import PostCard from '../postCard';
import * as S from './styled';

type PostColumnProps = {
  posts: PostClass[];
};

const PostColumn: React.FC<PostColumnProps> = ({ posts }) => {
  return (
    <S.Wrapper>
      {posts.map((post, index) => (
        <PostCard key={index} post={post} />
      ))}
    </S.Wrapper>
  );
};

export default PostColumn;
