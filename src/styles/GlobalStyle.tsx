import React from 'react';
import { css, Global } from '@emotion/react';

const GlobalStyle: React.FC = () => (
  <Global
    styles={css`
      * {
        box-sizing: border-box;
        appearance: none;
      }
      html {
        font-family: 'montserrat';
        width: 100%;
        height: 100%;
        overflow-y: scroll;
        font-size: 14px;
        a {
          color: #000;
          text-decoration: none;
        }
      }
    `}
  />
);

export default GlobalStyle;
