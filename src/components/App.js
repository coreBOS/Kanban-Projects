import React from "react";
import {PersistGate} from "redux-persist/integration/react";
import {Provider} from 'react-redux';
//import {Route, Switch} from 'react-router';
import {ConnectedRouter} from 'connected-react-router'

import persistor from "../store/persist";
import store, {history} from '../store'
//import Dashboard from "./main/Dashboard";
import Routes from '../routes';

window.store = store;

const App = () => (
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <ConnectedRouter history={history}>
                <React.Fragment>
                    <Routes />
                </React.Fragment>
            </ConnectedRouter>
        </PersistGate>
    </Provider>
);

export default App;