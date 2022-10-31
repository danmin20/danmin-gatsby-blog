import React from 'react';
import { css, Global } from '@emotion/react';

const GlobalStyle: React.FC = () => (
  <Global
    styles={css`
      background-color: red;
    `}
  />
);

export default GlobalStyle;
