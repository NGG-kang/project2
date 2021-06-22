import React from "react";
import { Route } from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";
import Profile from "./Profile";
import UserProfile from "./UserProfile";
import PostEdit from "./PostEdit";
import LoginRequiredRoute from "utils/LoginRequiredRoute";

function Routes({ match }) {
  return (
    <>
      <Route exact path={match.url + "/login"} component={Login} />
      <Route exact path={match.url + "/signup"} component={Signup} />
      <Route exact path={match.url + "/profile/:id"} component={Profile} />
      <LoginRequiredRoute
        exact
        path={match.url + "/studio"}
        component={UserProfile}
      />
      <LoginRequiredRoute
        exact
        path={match.url + "/studio/:id/edit"}
        component={PostEdit}
      />
    </>
  );
}

export default Routes;
