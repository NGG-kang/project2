import React from "react";
import { Route } from "react-router-dom";
import Home from "./Home";
import AccountsRouters from "./accounts";
import PostDetail from "./PostDetail";
import PostSearch from "./PostSearch";
import LoginRequiredRoute from "utils/LoginRequiredRoute";

function root() {
  return (
    <>
      <Route exact path="/" component={Home} />
      <Route exact path={`/post/:id`} component={PostDetail} />
      <Route exact path={`/search`} component={PostSearch} />
      <Route path="/accounts" component={AccountsRouters} />
    </>
  );
}
export default root;
