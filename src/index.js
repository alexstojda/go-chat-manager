import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Switch, Route } from 'react-router-dom';
import history from './utils/history';


import reportWebVitals from "./reportWebVitals";
import App from "./App";

document.title = "Chat Manager";

ReactDOM.render(
    <Router history={history}>
        <Switch>
            <Route exact path='/' render={() => <App />} />
        </Switch>
    </Router>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
