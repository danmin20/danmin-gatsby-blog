import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import kakaoIcon from '../../../assets/kakao_icon.svg';
import kakaoQr from '../../../assets/kakao_qr.svg';
import tossIcon from '../../../assets/toss_icon.svg';
import tossQr from '../../../assets/toss_qr.svg';
import * as S from './styled';

const BuyMeACoffee: React.FC = () => {
  const [isModalOpened, setIsModalOpened] = useState(false);

  const html = document.querySelector('html');

  const openModal = () => {
    setIsModalOpened(true);
    html?.classList.add('scroll-locked');
  };

  const closeModal = () => {
    setIsModalOpened(false);
    html?.classList.remove('scroll-locked');
  };

  return (
    <>
      <S.Button onClick={openModal}>
        <S.Text>
          {'BuyMeACoffee'.split('').map((char, index) => (
            <p key={index}>{char}</p>
          ))}
        </S.Text>
      </S.Button>

      {isModalOpened &&
        createPortal(
          <S.ModalBackground onClick={closeModal}>
            <S.Modal>
              <S.Title>Buy Me A Coffee ☕️</S.Title>
            </S.Modal>
          </S.ModalBackground>,
          document.body,
        )}
    </>
  );
};

export default BuyMeACoffee;
