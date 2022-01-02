import styled, { css } from 'styled-components';

export const StyleNewMessageCount = styled.span<{ isHidden?: boolean }>`
  color: #ffffff;
  padding: 0.35em 0.6em;
  font-size: 65%;
  margin-left: 5px;
  font-weight: 700;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  vertical-align: baseline;
  border-radius: 50%;
  background-color: #00984a;
  position: absolute;
  right: 15px;
  z-index: 1;
  height: 15px;
  width: 17px;
  top: 12px;
  display: ${(props) => (props.isHidden ? 'none' : 'inline-block')};
`;
