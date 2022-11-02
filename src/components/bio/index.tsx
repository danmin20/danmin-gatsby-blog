import * as React from 'react';
import { Author } from '@/src/type';
import * as S from './styled';
import ReactRotatingText from 'react-rotating-text';
import SocialButton from '../socialButton';

type BioProps = {
  author: Author;
};

const Bio: React.FC<BioProps> = ({ author }) => {
  const { bio, social, name, nickname } = author;

  return (
    <S.Wrapper>
      <S.IntroWrapper>
        <S.AnimatedCircle />

        <S.Title>
          안녕하세요!
          <br />
          <strong className='description'>
            <ReactRotatingText items={bio.description} />
          </strong>
          <span>를 좋아하는</span>
          <br />
          {bio.role}{' '}
          <strong>
            <ReactRotatingText items={[name, nickname]} />
          </strong>
          입니다.
        </S.Title>
        <S.SocialWrapper>
          <SocialButton name='github' link={social.github} />
          <SocialButton name='linkedIn' link={social.linkedIn} />
          <SocialButton name='resume' link={social.resume} />
          <SocialButton name='email' link={social.email} />
        </S.SocialWrapper>
      </S.IntroWrapper>
    </S.Wrapper>
  );
};

export default Bio;
