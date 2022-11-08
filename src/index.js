import "bootstrap/dist/css/bootstrap.css";

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import history from "./utils/history";

import reportWebVitals from "./reportWebVitals";
import App from "./App";

document.title = "Chat Manager";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Router history={history}>
    <Routes>
      <Route exact path="/" element={<App />} />
    </Routes>
  </Router>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
