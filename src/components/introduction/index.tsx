import * as React from 'react';
import { Author } from '@/src/type';
import * as S from './styled';
import ReactRotatingText from 'react-rotating-text';
import SocialButton from '../socialButton';

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

      <S.Intro>
        <div>{`Hello, my name is Lee Jeongmin.
        I’m a junior developer who wants to deeply strengthen the front-end.
        
        I’m actively expanding my interest in development regardless of field.`}</div>

        <div>{`“ Do not be a frog in a well. ”
        “ All I know is not everyting. ”`}</div>

        <div>{`Every time, new plans and challenges have been a great stimulus.
        I would like to give myself new tasks and create opportunities to continue to grow.`}</div>
      </S.Intro>
    </S.Wrapper>
  );
};

export default Introduction;
