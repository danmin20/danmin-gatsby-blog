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
        &nbsp;powered by danmin
      </S.Footer>
    </S.Wrapper>
  );
};

export default Footer;
