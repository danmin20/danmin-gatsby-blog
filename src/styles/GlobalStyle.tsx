import React from 'react';
import { css, Global } from '@emotion/react';
import { colors } from './const';

const GlobalStyle: React.FC = () => (
  <Global
    styles={css`
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
        color: ${colors.black100};

        a {
          color: #000;
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
    `}
  />
);

export default GlobalStyle;
