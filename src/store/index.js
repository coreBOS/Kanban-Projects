import {applyMiddleware, createStore} from "redux";
import createRootReducer from "./reducers"
import {routerMiddleware} from 'react-router-redux';
import {composeWithDevTools} from "redux-devtools-extension";
import {createHashHistory} from "history";
import thunk from "redux-thunk";
import {persistReducer} from 'redux-persist'
import storage from 'redux-persist/lib/storage'

export const history = createHashHistory({
    hashType: 'slash',
});

const persistConfig = {
    key: 'root',
    storage,
};

const initialState = {};
const middleware = [routerMiddleware(history), thunk];
const persistedReducer = persistReducer(persistConfig, createRootReducer(history));

const store = createStore(
    persistedReducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
