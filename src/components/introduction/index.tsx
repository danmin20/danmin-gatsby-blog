import * as React from 'react';
import { Author } from '@/src/type';
import * as S from './styled';

type IntroductionProps = {
  author: Author;
};

const Introduction: React.FC<IntroductionProps> = ({ author }) => {
  const { birth, residence, bachelorDegree } = author.bio;

  return (
    <S.Wrapper>
      <S.InfoWrapper>
        <S.Info>
          <strong>Birth.</strong> {birth}
        </S.Info>
        <S.Info>
          <strong>Residence.</strong> {residence}
        </S.Info>
        <S.Info>
          <strong>Bachelor Degree.</strong> {bachelorDegree}
        </S.Info>
      </S.InfoWrapper>
    </S.Wrapper>
  );
};

export default Introduction;
