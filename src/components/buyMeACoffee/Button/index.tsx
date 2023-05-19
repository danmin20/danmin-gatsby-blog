import useDeviceType from '../../../hooks/useDeviceType';
import * as S from './styled';

type Props = {
  isMobile?: boolean;
  onClick: () => void;
};

const Button: React.FC<Props> = ({ isMobile = false, onClick }) => {
  const { isMobile: isMobileDevice } = useDeviceType();

  return (
    <S.Center>
      <S.Circle isMobile={isMobile}>
        <S.Logo isMobile={isMobile}>$</S.Logo>
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
                {isMobileDevice && isMobile ? (
                  <textPath xlinkHref='#circlePath'>
                    Buy Me A
                    Coffee!;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Buy
                    Me A Coffee!
                  </textPath>
                ) : (
                  <textPath xlinkHref='#circlePath'>
                    Buy Me A
                    Coffee!&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    Buy Me A Coffee!
                  </textPath>
                )}
              </text>
            </g>
          </svg>
        </S.Text>
        <S.Button isMobile={isMobile} onClick={onClick}>
          CLICK
        </S.Button>
      </S.Circle>
    </S.Center>
  );
};

export default Button;
