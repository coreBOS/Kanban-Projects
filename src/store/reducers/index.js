import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import cardReducer from "./cardReducer";
import laneReducer from "./laneReducer";


export default (history) => combineReducers({
    router: connectRouter(history),
    card: cardReducer,
    lane: laneReducer
})