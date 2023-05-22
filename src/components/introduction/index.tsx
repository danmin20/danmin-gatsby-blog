import * as React from 'react';

import { Bio } from '@/src/type';

import * as S from './styled';

type IntroductionProps = {
  bio: Bio;
};

const Introduction: React.FC<IntroductionProps> = ({ bio }) => {
  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <S.Wrapper>
      <S.InfoWrapper>
        {Object.entries(bio).map(([key, value]) => (
          <S.Info key={key}>
            <strong>{capitalize(key)}.</strong> {value}
          </S.Info>
        ))}
      </S.InfoWrapper>
    </S.Wrapper>
  );
};

export default Introduction;
