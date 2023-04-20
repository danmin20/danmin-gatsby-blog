import React from 'react';
import { css, Global, Theme } from '@emotion/react';

const style = (theme: Theme) => css`
  * {
    box-sizing: border-box;
    appearance: none;
  }
  html {
    font-family: 'GmarketSansMedium';
    width: 100%;
    height: 100%;
    overflow-y: scroll;
    font-size: 14px;
    color: ${theme.color.black100};
    background-color: ${theme.color.gray10};

    a {
      color: ${theme.color.black100};
      text-decoration: none;
    }
  }

  body {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  ::-webkit-scrollbar {
    display: none;
  }
`;

const GlobalStyle: React.FC = () => <Global styles={(theme) => style(theme)} />;

export default GlobalStyle;
