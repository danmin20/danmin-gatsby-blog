import React, { useState } from 'react';
import * as S from './styled';
import useLockedBody from '../../hooks/usdLockedBody';
import kakaoIcon from '../../../assets/kakao_icon.svg';
import tossIcon from '../../../assets/toss_icon.svg';
import kakaoQr from '../../../assets/kakao_qr.svg';
import tossQr from '../../../assets/toss_qr.svg';

const BuyMeACoffee: React.FC = () => {
  const [locked, setLocked] = useLockedBody();
  const [isModalOpened, setIsModalOpened] = useState(false);

  const openModal = () => {
    setIsModalOpened(true);
    setLocked(true);
  };

  const closeModal = () => {
    setIsModalOpened(false);
    setLocked(false);
  };

  console.log(`locked,locked'`, locked);

  return (
    <S.Wrapper>
      <S.Center>
        <S.Circle>
          <S.Logo>$</S.Logo>
          <S.Text>
            <svg x='0' y='0' viewBox='0 0 300 300' enable-background='new 0 0 300 300' xmlSpace='preserve'>
              <defs>
                <path
                  id='circlePath'
                  d='
                    M 150, 150
                    m -120, 0
                    a 120,120 0 0,1 240,0
                    a 120,120 0 0,1 -240,0
                    '
                />
              </defs>
              <g>
                <text>
                  <textPath xlinkHref='#circlePath'>
                    Buy Me A
                    Coffee!&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    Buy Me A Coffee!
                  </textPath>
                </text>
              </g>
            </svg>
          </S.Text>
          <S.Button onClick={openModal}>CLICK</S.Button>
        </S.Circle>
      </S.Center>

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
