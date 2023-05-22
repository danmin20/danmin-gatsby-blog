import * as S from './styled';

const Button: React.FC<Props> = () => {
  return (
    <S.Wrapper>
      <S.Button>
        <S.Text>
          {'BuyMeACoffee'.split('').map((char, index) => (
            <p key={index}>{char}</p>
          ))}
        </S.Text>
      </S.Button>
    </S.Wrapper>
  );
};

export default Button;
