import * as React from 'react';
import ReactRotatingText from 'react-rotating-text';

import { Author } from '@/src/type';

import BuyMeACoffee from '../buyMeACoffee';
import Image from '../Image';
import * as S from './styled';

type BioProps = {
  author: Author;
};

const Bio: React.FC<BioProps> = ({ author }) => {
  const { stack, social, name, nickname } = author;

  return (
    <S.Wrapper>
      <S.IntroWrapper>
        <S.Title>
          안녕하세요!
          <br />
          <strong>
            <ReactRotatingText items={stack} />
          </strong>
          <span>를 좋아하는</span>
          <br />
          개발자{' '}
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
                <S.SocialButton key={index} target='_blank' href={social[link as keyof typeof social]}>
                  {link}
                </S.SocialButton>
              ),
          )}
        </S.SocialWrapper>
      </S.IntroWrapper>

      <S.BuyMeACoffeeWrapper>
        <BuyMeACoffee />
      </S.BuyMeACoffeeWrapper>
    </S.Wrapper>
  );
};

export default Bio;
