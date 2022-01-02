import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { validate as uuidValidate } from 'uuid';
import { TOKEN_NAME, _UUID } from 'config/constantApi';
import { LOGIN } from 'config/constantUrl';

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      uuidValidate(localStorage.getItem(_UUID)) &&
      localStorage.getItem(TOKEN_NAME) ? (
        <Component {...props} />
      ) : (
        <Redirect to={LOGIN} />
      )
    }
  />
);

export default PrivateRoute;
