import * as S from './styled';

type ButtonProps = {
  onClick: () => void;
};

const Button: React.FC<ButtonProps> = ({ onClick }) => {
  return (
    <S.Wrapper>
      <S.Button onClick={onClick}>
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
