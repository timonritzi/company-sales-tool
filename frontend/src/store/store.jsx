import { createStore } from 'redux';
import reducers from './reducer/reducer'
import { applyMiddleware } from "redux";
import thunk from 'redux-thunk';

export const store = createStore(reducers, applyMiddleware(thunk))