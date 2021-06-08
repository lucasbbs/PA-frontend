/*!

=========================================================
* Black Dashboard React v1.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/black-dashboard-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/black-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import AdminLayout from 'layouts/Admin/Admin.js';
import LoginLayout from 'layouts/LoginLayout/LoginLayout.js';
import VerifyLayout from 'layouts/Verify/Verify.js';
// import RTL from 'layouts/RTL/RTL.js';

import 'assets/scss/black-dashboard-react.scss';
import 'assets/demo/demo.css';
import 'assets/css/nucleo-icons.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import ThemeContextWrapper from './components/ThemeWrapper/ThemeWrapper';
import BackgroundColorWrapper from './components/BackgroundColorWrapper/BackgroundColorWrapper';
import { isAuthenticated } from './services/auth';

export const TOKEN_KEY = 'userInfo';

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      isAuthenticated() ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{ pathname: '/login/login', state: { from: props.location } }}
        />
      )
    }
  />
);

ReactDOM.render(
  <ThemeContextWrapper>
    <BackgroundColorWrapper>
      <BrowserRouter>
        <Switch>
          <PrivateRoute
            path='/app'
            component={(props) => <AdminLayout {...props} />}
          />
          <Route path='/login' render={(props) => <LoginLayout {...props} />} />
          <Route
            path='/verify/:token'
            render={(props) => <VerifyLayout {...props} />}
          ></Route>
          {/* <Route path='/rtl' render={(props) => <RTL {...props} />} /> */}
          <Redirect from='/' to='/app/dashboard' />
          {/* </Provider> */}
        </Switch>
      </BrowserRouter>
    </BackgroundColorWrapper>
  </ThemeContextWrapper>,
  document.getElementById('root')
);
