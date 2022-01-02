import styled, { css } from 'styled-components';
import { customColors } from 'uiKits/colors/color';
import { CustomSize, MediaQueryStyle } from 'utils/MediaQuery';

export const StyledCardContainer = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(4, minmax(200px, 1fr));
  grid-gap: 24px;
`;

export const StyledCard = styled.div`
  box-shadow: rgb(69 90 100 / 8%) 0px 1px 20px 0px;
  background-color: #ffffff;
  border-radius: 4px;
  ${MediaQueryStyle.customMaxWidth(
    CustomSize.mobilexs,
    css`
      min-width: 227px;
    `
  )}
`;

export const StyledCardTitle = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  height: 60px;
  & p {
    font-size: 16px;
    position: relative;
    padding-right: 16px;
    &::before {
      content: '';
      height: 100%;
      width: 4px;
      background-color: ${customColors.red_650};
      position: absolute;
      right: 0px;
      display: block;
    }
  }
`;
export const StyleCardBody = styled.div<{ customStyle?: any }>`
  width: 100%;
  padding: 24px 16px 0px 0px;
  height: 80px;
  & span {
    padding-left: 4px;
  }
  ${(p) => (p.customStyle ? p.customStyle : '')};
`;

export const HDivider = styled.div<{ customStyle?: any }>`
  height: 2px;
  width: 100%;
  border-radius: 1px;
  background-color: ${customColors.gray_120};
  ${(props) => (props.customStyle ? props.customStyle : '')};
`;

export const StyledInfoContainer = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, minmax(580px, 1fr));
  grid-gap: 24px;
  margin-top: 24px;
  ${MediaQueryStyle.md(css`
    padding-right: 28px;
    grid-template-columns: repeat(1, minmax(100%, 1fr));
  `)}
  ${MediaQueryStyle.customMaxWidth(
    CustomSize.mobilexs,
    css`
      padding-right: 86px;
    `
  )}
`;

export const StyledCardsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  margin: 24px 24px;
  ${MediaQueryStyle.customMaxWidth(
    CustomSize.mobilexs,
    css`
      padding-right: 62px;
    `
  )}
`;

export const CardInfo = styled.div<{ borderColor?: string }>`
  width: 30%;
  min-width: 300px;
  margin-bottom: 10px;
  padding: 25px 40px;
  box-shadow: rgb(69 90 100 / 8%) 0px 1px 20px 0px;
  background-color: #ffffff;
  border-radius: 5px;
  border-right: ${(props) =>
    props.borderColor
      ? `7px solid ` + props.borderColor
      : `7px solid ` + customColors.red_650};
  svg {
    fill: ${(props) =>
      props.borderColor ? props.borderColor : customColors.red_650};
  }
  ${MediaQueryStyle.customMaxWidth(
    CustomSize.mobilexs,
    css`
      min-width: 100px;
      width: 97%;
    `
  )}
`;

export const CardHeader = styled.div`
  margin-bottom: 8px;
  svg {
    width: 2.2em;
    height: 2.2em;
  }
`;

export const CardContent = styled.div`
  margin-bottom: 8px;
  p {
    font-weight: 14px;
    font-weight: bold;
    color: #797777;
  }
`;

export const CardFooter = styled.div`
  p {
    font-weight: 13.5px;
    font-weight: bold;
    color: #908f8f;
  }
`;
