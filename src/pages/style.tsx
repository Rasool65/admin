import styled, { css } from 'styled-components';
import { customColors } from 'uiKits/colors/color';
import { ColorMode } from './widget-type';

export const Wrapper = styled.div`
  width: 100%;
  height: ${window.innerHeight};
  display: flex;
  flex-direction: column;
`;

export const BodyWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
`;

export const Img = styled.div<{ src?: any; customStyle?: any }>`
  background-image: url(${(p) => p.src});
  background-position: 50% 50%;
  background-size: cover;
  background-repeat: no-repeat;
  ${(p) => (p.customStyle ? p.customStyle : '')};
`;

export const StatusMode = styled.div<{
  colorType?: string;
  customWidth?: string;
}>`
  width: max-content;
  padding: 16px;
  height: 24px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 8px;
  ${({ colorType }) => {
    if (ColorMode.GREEN === colorType) {
      return css`
        background-color: ${customColors.green_150};
      `;
    }
    if (ColorMode.PINK === colorType) {
      return css`
        background-color: ${customColors.orange_150};
      `;
    }
    if (ColorMode.YELLOW === colorType) {
      return css`
        background-color: ${customColors.yellow_150};
      `;
    }
    if (ColorMode.PURPLE === colorType) {
      return css`
        background-color: ${customColors.perpule_100};
      `;
    }
    if (ColorMode.GRAY === colorType) {
      return css`
        background-color: ${customColors.gray_320};
      `;
    }
    if (ColorMode.RED === colorType) {
      return css`
        background-color: ${customColors.red_70};
      `;
    }
    if (ColorMode.LIGHT_GREEN === colorType) {
      return css`
        background-color: ${customColors.green_120};
      `;
    }
    if (ColorMode.ORANGE === colorType) {
      return css`
        background-color: ${customColors.orange_150};
      `;
    }
    if (ColorMode.BLUE === colorType) {
      return css`
        background-color: ${customColors.primary_100};
      `;
    }
  }}
  & span {
    font-size: 12px;
    ${({ colorType }) => {
      if (ColorMode.GREEN === colorType) {
        return css`
          color: ${customColors.green_500};
        `;
      }
      if (ColorMode.YELLOW === colorType) {
        return css`
          color: ${customColors.yellow_900};
        `;
      }
      if (ColorMode.PURPLE === colorType) {
        return css`
          color: ${customColors.perpule_700};
        `;
      }
      if (ColorMode.PINK === colorType) {
        return css`
          color: ${customColors.orange_850};
        `;
      }
      if (ColorMode.GRAY === colorType) {
        return css`
          color: ${customColors.gray_700};
        `;
      }
      if (ColorMode.RED === colorType) {
        return css`
          color: ${customColors.red_250};
        `;
      }
      if (ColorMode.LIGHT_GREEN === colorType) {
        return css`
          color: ${customColors.green_550};
        `;
      }
      if (ColorMode.ORANGE === colorType) {
        return css`
          color: ${customColors.orange_700};
        `;
      }
      if (ColorMode.BLUE === colorType) {
        return css`
          color: ${customColors.primary_200};
        `;
      }
    }}
  }
`;
