import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import Root from "pages";
import "antd/dist/antd.css";

import "./index.css";
import { AppProvider } from "store";

ReactDOM.render(
  <BrowserRouter>
    <AppProvider>
      <Root />
    </AppProvider>
  </BrowserRouter>,
  document.getElementById("root")
);
