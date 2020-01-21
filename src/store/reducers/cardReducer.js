import {ADD_CARD, DELETE_CARD, EDIT_CARD, MOVE_CARD} from "../actions/types";

const initialState = {};

function cardReducer(state = initialState, action) {
    switch (action.type) {
        case ADD_CARD:
            return Object.assign({}, state, {});
        case EDIT_CARD:
            return Object.assign({}, state, {});
        case DELETE_CARD:
            return Object.assign({}, state, {});
        case MOVE_CARD:
            return Object.assign({}, state, {});
        default:
            return state;
    }
}

export default cardReducer;