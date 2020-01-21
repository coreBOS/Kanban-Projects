import {ADD_LANE, EDIT_LANE, DELETE_LANE, MOVE_LANE} from "../actions/types";

const initialState = {};

function laneReducer(state = initialState, action) {
    switch (action.type) {
        case ADD_LANE:
            return Object.assign({}, state, {});
        case EDIT_LANE:
            return Object.assign({}, state, {});
        case DELETE_LANE:
            return Object.assign({}, state, {});
        case MOVE_LANE:
            return Object.assign({}, state, {});
        default:
            return state;
    }
}

export default laneReducer;