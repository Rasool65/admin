import styled from 'styled-components';

export const StyleTagContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const StyleTags = styled.div`
  display: flex;
  align-items: center;
  margin-top: 8px;
  & span.ant-tag {
    margin-left: 8px;
    margin-bottom: 8px;
  }
`;
