import React, { useContext, lazy } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import {
  LOGIN,
  DASHBOARD,
} from './settings/constants';

import AuthProvider, { AuthContext } from './context/auth';
import Login from './components/Login';
import Dashboard from './components/main/Dashboard';

function PrivateRoute({ children, ...rest }) {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <Route
      {...rest}
      render={({ location }) =>
        isAuthenticated ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: LOGIN,
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}

const Routes = () => {
  return (
    <AuthProvider>
        <Switch>
          <PrivateRoute exact={true} path={DASHBOARD}>
            <Dashboard />
          </PrivateRoute>
          <Route path={LOGIN}>
            <Login />
          </Route>
        </Switch>
    </AuthProvider>
  );
};

export default Routes;
