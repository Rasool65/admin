import styled, { css } from 'styled-components';
import { Layout } from 'antd';

import { customColors } from '../../uiKits/colors/color';
import { CustomSize, MediaQueryStyle } from 'utils/MediaQuery';

const { Header } = Layout;

export const RemoSysHeader = styled(Header)<{ customstyle?: any }>`
  height: 70px;
  line-height: 70px;
  padding: 0;
  width: 100%;
  z-index: 9;
  background-color: whitesmoke;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  position: fixed;
  left: 0;
  box-shadow: 0 1px 4px -1px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  ${(p) => (p.customstyle ? p.customstyle : '')};
`;

export const HeaderLogo = styled.div`
  width: 250px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 1rem;
  background-color: transparent;
  transition: all 0.2s ease;
  > img {
    /* width: 50px; */
    /* height: 50px; */
  }
  ${MediaQueryStyle.md(css`
    justify-content: flex-start;
  `)}
`;

export const HeaderContent = styled.div`
  width: calc(100% - 250px);
  display: flex;
  justify-content: space-between;
  position: relative;
  transition: all 0.2s ease;
`;

export const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  margin-right: 16px;
  color: hsla(0, 0%, 100%, 0.8);
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    color: ${customColors.white};
  }
  svg {
    color: #ea2125;
  }
  ${MediaQueryStyle.md(css`
    margin-right: -118px;
  `)}
`;

export const SearchWrapper = styled.div<{ isFocused?: boolean }>`
  width: 300px;
  height: 40px;
  border-radius: 8px;
  margin-right: 32px;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
  background-color: ${(props) =>
    props.isFocused ? customColors.white : `rgba(255, 255, 255, 0.25)`};
  color: ${(props) =>
    props.isFocused ? customColors.gray_7 : customColors.white};
  padding: 8px;
`;

export const SearchContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  & span.search__icon {
    & svg {
      transform: rotateY(180deg);
      margin-left: 8px;
    }
  }
  & div.ant-select {
    width: 100%;
    & input.ant-select-selection-search-input {
      &::placeholder {
        color: ${customColors.white} !important;
      }
    }
  }
`;

export const HeaderLeft = styled.div`
  width: 250px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row-reverse;
  padding-left: 42px;
  & span.header__avatar {
    width: 40px;
    height: 40px;
    cursor: pointer;
  }
`;

export const Items = styled.div`
  padding: 0px 16px;
  display: flex;
  align-items: center;
  height: 35px;
  color: ${customColors.gray_8};
  transition: all 0.3s ease;
  cursor: pointer;
  & p.item__name {
    font-size: 14px;
    padding-right: 8px;
    &:hover {
      color: ${customColors.blue_6};
    }
  }
  & svg {
    font-size: 16px;
  }
  &:hover {
    color: ${customColors.blue_6};
  }
`;

export const LanguageWrapper = styled.div`
  padding: 8px;
  width: 150px;
`;

export const LanguageItems = styled.div<{ isSelected?: boolean }>`
  width: 100%;
  height: 35px;
  display: flex;
  color: ${customColors.gray_8};
  transition: all 0.3s ease;
  padding: 0px 4px;
  cursor: pointer;
  & div {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    & svg {
      font-size: 16px;
      display: ${(props) => (props.isSelected ? 'block' : 'none')};
      color: ${(props) =>
        props.isSelected ? customColors.green_6 : customColors.gray_8};
    }
  }
  &:hover {
    background-color: ${customColors.gray_3};
  }
`;
