import * as S from './styled';
import { SunIcon, MoonIcon } from '@radix-ui/react-icons';

type ThemeToggleProps = {
  handleTheme: () => void;
  isDark: boolean;
};

const ThemeToggle: React.FC<ThemeToggleProps> = ({ handleTheme, isDark }) => {
  return (
    <S.Wrapper onClick={handleTheme} isDark={isDark}>
      {isDark ? <SunIcon className='theme-icon' /> : <MoonIcon className='theme-icon' />}
    </S.Wrapper>
  );
};

export default ThemeToggle;
