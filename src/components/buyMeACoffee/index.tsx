import React, { useState } from 'react';

import kakaoIcon from '../../../assets/kakao_icon.svg';
import kakaoQr from '../../../assets/kakao_qr.svg';
import tossIcon from '../../../assets/toss_icon.svg';
import tossQr from '../../../assets/toss_qr.svg';
import useLockedBody from '../../hooks/usdLockedBody';
import Button from './Button';
import * as S from './styled';

const BuyMeACoffee: React.FC = () => {
  const [, setLocked] = useLockedBody();
  const [isModalOpened, setIsModalOpened] = useState(false);

  const openModal = () => {
    setIsModalOpened(true);
    setLocked(true);
  };

  const closeModal = () => {
    setIsModalOpened(false);
    setLocked(false);
  };

  return (
    <S.Wrapper>
      <Button onClick={openModal} />
      {isModalOpened && (
        <S.ModalBackground onClick={closeModal}>
          <S.Modal>
            <S.Title>Buy Me A Coffee ☕️</S.Title>
            <S.Content>
              <S.List>
                <div>⓵ 토스 익명송금</div>
                <a href='https://toss.me/danmin'>toss.me/danmin</a>
              </S.List>
              <S.List>
                <div>② 송금 QR</div>
                <S.Qr style={{ width: 30 }}>
                  <div>
                    <img src={kakaoIcon} />
                    <img src={kakaoQr} />
                  </div>
                  <div>
                    <img src={tossIcon} />
                    <img src={tossQr} />
                  </div>
                </S.Qr>
              </S.List>
            </S.Content>
          </S.Modal>
        </S.ModalBackground>
      )}
    </S.Wrapper>
  );
};

export default BuyMeACoffee;