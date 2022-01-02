import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
// import createFilter from 'redux-persist-transform-filter';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';

import { layoutReducer } from '../layout/reducer';

// const saveSubsetFilter = createFilter('layoutReducer', ['isAuthenticated']);

const persistConfig = {
  key: 'panel',
  storage,
  whitelist: ['loginReducer'],
  // transforms: [saveSubsetFilter],
  stateReconciler: autoMergeLevel2,
};

const rootReducer: any = combineReducers({
  layoutReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

let middleware: any;

if (process.env.NODE_ENV !== 'production') {
  middleware = applyMiddleware(thunk, logger);
} else {
  middleware = applyMiddleware(thunk);
}

export default () => {
  const store = createStore(persistedReducer, middleware);
  const persistor = persistStore(store);
  return { store, persistor };
};
