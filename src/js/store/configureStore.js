import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from '../reducers';
import thunkMiddleware from 'redux-thunk';
import promise from 'redux-promise';
import createLogger from 'redux-logger';
import persistState from 'redux-localstorage'

export default function configureStore(initialState) {

  const logger = createLogger({
    predicate: (getState, action) => action.type.indexOf('redux-form') < 0
  });;
  let middleware = applyMiddleware(thunkMiddleware, promise, logger);
  let enhancer;


  if (process.env.NODE_ENV !== 'production') {
    enhancer = compose(

      // Middleware we want to use in development
      middleware,
      window.devToolsExtension ?
        window.devToolsExtension() :
        require('../containers/DevTools').default.instrument(),
      persistState()
    );
  }
  else {
    enhancer = compose(middleware,persistState());
  }

  const store = createStore(rootReducer, initialState, enhancer);

  // Enable Webpack hot module replacement for reducers
  if (module.hot) {
    module.hot.accept('../reducers', () =>
      store.replaceReducer(require('../reducers').default)
    );
  }

  return store;
}
