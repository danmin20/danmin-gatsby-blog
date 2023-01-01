import { colors, MOBILE_MEDIA_QUERY } from '../../../src/styles/const';
import styled from '@emotion/styled';

export const Wrapper = styled.div`
  .search-input-wrapper {
    /* display: none; */
    align-items: center;
    width: 180px;
    margin-top: 3px;

    @media ${MOBILE_MEDIA_QUERY} {
      display: flex;
    }
  }

  .search-icon {
    margin-right: 2px;
  }

  .search-input {
    width: 100%;
    height: 100%;

    .MuiAutocomplete-inputRoot {
      padding-right: 0 !important;
    }

    .MuiInputBase-input {
      font-family: $font-family;
      font-size: 16px;
      font-weight: 500;
      padding-bottom: 2px !important;
    }

    .MuiInput-underline:before {
      border-bottom-color: ${colors.black100};
      border-bottom-width: 1px;
    }

    .MuiInput-underline:after {
      border-bottom-color: ${colors.black100};
    }
  }
`;
