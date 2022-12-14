import * as S from './styled';

type SocialButtonProps = {
  name: string;
  link: string;
};

const SocialButton: React.FC<SocialButtonProps> = ({ name, link }) => {
  return <S.Wrapper href={`${name === 'email' ? `mailto:` : ``}${link}`}>{name}</S.Wrapper>;
};

export default SocialButton;
