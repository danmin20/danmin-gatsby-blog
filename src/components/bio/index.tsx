import * as React from 'react';
import { Author } from '@/src/type';
import ReactRotatingText from 'react-rotating-text';
import * as S from './styled';
import Image from '../Image';

type BioProps = {
  author: Author;
};

const Bio: React.FC<BioProps> = ({ author }) => {
  const { bio, social, name, nickname } = author;

  return (
    <S.Wrapper>
      <S.IntroWrapper>
        <S.Title>
          안녕하세요!
          <br />
          <strong>
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
        <Image alt='thumbnail' src='thumbnail.png' />
        <S.SocialWrapper>
          {Object.keys(social).map(
            (link, index) =>
              social[link as keyof typeof social] && (
                <S.SocialButton
                  key={index}
                  target='_blank'
                  href={`${link === 'email' ? `mailto:` : ``}${social[link as keyof typeof social]}`}
                >
                  {link}
                </S.SocialButton>
              ),
          )}
        </S.SocialWrapper>
      </S.IntroWrapper>
    </S.Wrapper>
  );
};

export default Bio;
