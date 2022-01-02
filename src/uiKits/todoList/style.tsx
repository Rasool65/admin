import styled from 'styled-components';
import { customColors } from '../colors/color';

export const StyleTodoList = styled.section`
  display: flex;
  flex-direction: column;
  gap: 24p;
  margin-top: 15px;
`;

export const StyleList = styled.ul`
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
`;

export const ListItem = styled.li`
  display: flex;
  align-items: center;
  padding: 5px 10px;
  border-radius: 5px;
  background: ${customColors.gray_75};
  margin-bottom: 12px;
  justify-content: space-between;
  gap: 20px;
  > img.icon {
    border-radius: 100%;
    width: 35px;
    height: 35px;
  }
  > p.name {
    font-size: 13px;
    color: ${customColors.gray_470};
  }
  > img {
    width: 11px;
    height: 11px;
    cursor: pointer;
  }
`;

export const StyleForm = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 24px;
  max-width: 500px;
  button.add {
    font-weight: bold;
    border-width: 3px;
    margin-top: 27px;
  }
`;

export const StyleResult = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 25px;
  margin-top: 5px;
  padding: 3px 5px;
  border-radius: 5px;
  border: 1px solid ${customColors.gray_80};
  p {
    font-size: 12px;
    color: ${customColors.green_650};
    font-weight: bold;
  }
  img {
    cursor: pointer;
    width: 9px;
    height: 9px;
  }
`;
