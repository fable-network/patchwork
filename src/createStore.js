import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';

const rootReducer = combineReducers({});

export default () => {
  const store = createStore(rootReducer, composeWithDevTools(applyMiddleware()));
  return store;
};
