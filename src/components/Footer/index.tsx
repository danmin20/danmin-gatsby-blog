import React from 'react';

import * as S from './styled';

const Footer: React.FC = () => {
  return (
    <S.Wrapper>
      <S.Footer>
        © Powered by <S.Link href='https://github.com/danmin20'>danmin</S.Link>
      </S.Footer>
    </S.Wrapper>
  );
};

export default Footer;
