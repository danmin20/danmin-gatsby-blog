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
        font-family: 'GmarketSansLight';
        width: 100%;
        height: 100%;
        overflow-y: scroll;
        font-size: 14px;
        a {
          color: #000;
          text-decoration: none;
        }
        .hover-underline {
          display: inline-block;
          position: relative;

          &:after {
            content: '';
            position: absolute;
            width: 100%;
            transform: scaleX(0);
            height: 1px;
            bottom: -1px;
            left: 0;
            background-color: #000;
            transform-origin: bottom right;
            transition: transform 0.25s ease-out;
          }
          &:hover:after {
            transform: scaleX(1);
            transform-origin: bottom left;
          }
        }
      }
    `}
  />
);

export default GlobalStyle;
