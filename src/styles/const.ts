import { css } from '@emotion/react';

export const contentMaxWidth = '720px';

const MOBILE_MAX_WIDTH = 768;
export const MOBILE_MEDIA_QUERY = `screen and (max-width: ${MOBILE_MAX_WIDTH}px)`;

export const colors = {
  black100: '#0F1010',
  black80: '#1C1D1E',
  black60: '#2C2D2E',
  black40: '#3C3D40',
  red100: '#BD372F',
  gray100: '#606265',
  gray80: '#808388',
  gray60: '#989BA0',
  gray40: '#C0C5C9',
  gray30: '#CED1D2',
  gray20: '#EEEFF1',
  gray10: '#F7F8FA',
  white: '#FCFCFC',
  white100: '#FFFFFF',
};

export const hoverUnderline = css`
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
    background-color: ${colors.black100};
    transform-origin: bottom right;
    transition: transform 0.25s ease-out;
  }
  &:hover:after {
    transform: scaleX(1);
    transform-origin: bottom left;
    @media ${MOBILE_MEDIA_QUERY} {
      transform: scaleX(0);
    }
  }
`;
