import { css } from 'styled-components';

export const MediaQueryStyle = {
  xs: (cssCustomStyle: any) => css`
    @media screen and (max-width: 639px) {
      ${cssCustomStyle}
    }
  `,
  sm: (cssCustomStyle: any) => css`
    @media screen and (max-width: 959px) {
      ${cssCustomStyle}
    }
  `,
  md: (cssCustomStyle: any) => css`
    @media screen and (max-width: 1199px) {
      ${cssCustomStyle}
    }
  `,
  lg: (cssCustomStyle: any) => css`
    @media screen and (max-width: 1599px) {
      ${cssCustomStyle}
    }
  `,
  xl: (cssCustomStyle: any) => css`
    @media screen and (min-width: 1600px) {
      ${cssCustomStyle}
    }
  `,
  customMaxWidth: (maxWidth: number, cssCustomStyle: any) => css`
    @media screen and (max-width: ${maxWidth}px) {
      ${cssCustomStyle}
    }
  `,
  customMinWidth: (minWidth: number, cssCustomStyle: any) => css`
    @media screen and (min-width: ${minWidth}px) {
      ${cssCustomStyle}
    }
  `,
  customBetweenWidth: (
    minWidth: number,
    maxWidth: number,
    cssCustomStyle: any
  ) => css`
    @media screen and (min-width: ${minWidth}px) and (max-width: ${maxWidth}px) {
      ${cssCustomStyle}
    }
  `,
};

export const MediaQuerySizes = {
  xs: () => 640,
  sm: () => 960,
  md: () => 1200,
  lg: () => 1600,
  xl: () => 1601,
};

export const CustomSize = {
  mobile: 959,
  mobilexs: 320,
  xs: 450,
  sm: 675,
  md: 895,
  lg: 1400,
  xl: 1600,
};
