import styled from 'styled-components';

export const CalenderContainer = styled.div`
  width: 100%;
  position: relative;
  & div.calendarContainer {
    position: absolute;
    transform: translateY(-41%);
    z-index: 1;
  }
  & span.clean__calender {
    position: absolute;
    left: 10px;
    top: 13px;
    cursor: pointer;
  }
`;
