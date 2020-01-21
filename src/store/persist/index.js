import { persistStore } from 'redux-persist';
import store from "..";

const persistor = persistStore(store);

export default persistor;