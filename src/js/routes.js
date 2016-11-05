import React from 'react';
import { Route, IndexRoute, Redirect } from 'react-router';
import Index from './pages/Index';
import App from './containers/App';
import NotFoundView from './pages/NotFoundView';
import UserSettings from './pages/UserSettings';
import AuthPage from './pages/Auth';
export default (
  <Route path="/" component={App}>
    <IndexRoute component={Index} />
    <Route path="404" component={NotFoundView} />
    <Route path="auth" component={AuthPage} />
    <Route path="settings" component={UserSettings} />
    <Redirect from="*" to="404" />
  </Route>
);
