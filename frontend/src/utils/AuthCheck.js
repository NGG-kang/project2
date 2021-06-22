import React from "react";
import { useAppContext } from "store";
import { Route, Redirect } from "react-router-dom";

export default function AuthCheck({ component: Component, ...kwargs }) {
  const {
    store: { isAuthenticated },
  } = useAppContext();

  if (isAuthenticated) {
  } else {
  }

  return (
    <Route
      {...kwargs}
      render={(props) => {
        if (isAuthenticated) {
          return <Component {...props} />;
        } else {
          return (
            <Redirect
              to={{
                pathname: "/accounts/login",
                state: { from: props.location },
              }}
            />
          );
        }
      }}
    />
  );
}
