import { useViewCount } from '../../../src/hooks/useViewCount';
import * as S from './styled';

type HitCountProps = {
  siteUrl: string;
};

const HitCount = ({ siteUrl }: HitCountProps) => {
  const { viewCount: hitCount } = useViewCount(siteUrl, 'home');

  return (
    <S.Wrapper>
      <div>✨Hits: {hitCount ?? 0}</div>
    </S.Wrapper>
  );
};

export default HitCount;
