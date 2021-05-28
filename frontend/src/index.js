import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './index.css';
import { store } from './store/store';
import { Provider } from 'react-redux'
import { Routes } from './routes/routes.js';

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <Router>
        <Switch>
          <Routes />
        </Switch>
      </Router>
    </React.StrictMode >
  </Provider>,
  document.getElementById('root')
);