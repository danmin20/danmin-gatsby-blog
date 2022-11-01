import { Author } from '@/src/type';
import React from 'react';

import * as S from './styled';

type FooterProps = {
  author: Author;
};

const Footer: React.FC<FooterProps> = ({ author }) => {
  const {
    name,
    social: { github },
  } = author;

  return (
    <S.Wrapper>
      <S.Footer>
        © {new Date().getFullYear()}
        &nbsp;
        <a href={github}>{name}</a>
        &nbsp;powered by
        <a href={`${github}/danmin-gatsby-blog`}>&nbsp;danmin-gatsby-blog</a>
      </S.Footer>
    </S.Wrapper>
  );
};

export default Footer;
