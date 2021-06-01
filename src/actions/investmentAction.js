import axios from 'axios';
// import asyncHandler from 'express-async-handler';
// import InvestmentsList from 'views/InvestmentsList';

import {
  INVESTMENT_LIST_REQUEST,
  INVESTMENT_LIST_SUCCESS,
  INVESTMENT_LIST_FAIL,
  INVESTMENT_CREATE_REQUEST,
  INVESTMENT_CREATE_SUCCESS,
  INVESTMENT_CREATE_FAIL,
} from '../constants/investmentConstants';

export const listInvestments = () => async (dispatch) => {
  try {
    dispatch({ type: INVESTMENT_LIST_REQUEST });

    const { data } = await axios(`/api/investments/`);
    dispatch({ type: INVESTMENT_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: INVESTMENT_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const createInvestment = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: INVESTMENT_CREATE_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.post(`/api/investments`, {}, config);

    dispatch({ type: INVESTMENT_CREATE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: INVESTMENT_CREATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
