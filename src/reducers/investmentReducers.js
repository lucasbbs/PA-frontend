import {
  INVESTMENT_LIST_REQUEST,
  INVESTMENT_LIST_SUCCESS,
  INVESTMENT_LIST_FAIL,
} from '../constants/investmentConstants';

export const investmentListReducer = (state = { investments: [] }, action) => {
  switch (action.type) {
    case INVESTMENT_LIST_REQUEST:
      return { loading: true, investments: [] };
    case INVESTMENT_LIST_SUCCESS:
      return { loading: false, investments: action.payload };
    case INVESTMENT_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
