import React from 'react';
import ReactDOM from 'react-dom';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';

import Persistor from './redux/store/store';
import App from './App';
// import * as serviceWorker from './serviceWorker';
import AntProvider from './antProvider/AntProvider';
import './assets/styles/main.scss';
import './pages/commonStyle.scss';
import './i18n/config';

export let { store, persistor } = Persistor();

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={undefined} persistor={persistor}>
      <AntProvider>
        <App />
      </AntProvider>
    </PersistGate>
  </Provider>,

  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
