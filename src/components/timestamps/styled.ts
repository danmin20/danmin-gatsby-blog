import { colors } from '../../../src/styles/const';
import styled from '@emotion/styled';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-top: 50px;
  font-family: GmarketSansLight;
  white-space: nowrap;
`;

export const Content = styled.div`
  width: 100%;
  padding: 0 10px;
`;

export const Timestamp = styled.div`
  display: flex;
  justify-items: center;

  width: 100%;
  margin-left: 5px;
  padding: 10px 0;
  border-left: 1px solid ${colors.gray40};

  &:first-child {
    padding-top: 7px;
  }

  &:last-child {
    padding-bottom: 7px;
  }

  &::before {
    position: relative;
    left: -1px;
    content: '';
    align-self: center;
    width: 5px;
    height: 5px;
    background-color: ${colors.white100};
    border-radius: 5px;
    transform: translatex(-50%);
    border: 1px solid ${colors.gray40};
  }
`;

export const Date = styled.div`
  margin-left: 5px;
  margin-right: 5px;
  width: 200px;
  color: ${colors.gray80};
  align-self: center;
`;

export const Title = styled.div`
  display: flex;
  line-height: 16px;
  a {
    margin-left: 5px;
  }
`;

export const TitleEn = styled.div`
  font-family: GmarketSansMedium;
  font-size: 16px;
`;

export const TitleKr = styled.div`
  font-size: 13px;
  margin-left: 5px;
`;

export const Info = styled.div`
  margin-top: 5px;
`;
