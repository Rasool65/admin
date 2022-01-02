import styled from 'styled-components';
import { Steps } from 'antd';

const { Step } = Steps;

export const StepWidget = styled(Step)`
  & span.ant-steps-finish-icon {
    & svg {
      font-size: 16px;
    }
  }
`;
