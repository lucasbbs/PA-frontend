import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { investmentListReducer } from './reducers/investmentReducers';

const initialState = {};
const middleware = [thunk];
const reducer = combineReducers({
  investmentList: investmentListReducer,
});
const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
