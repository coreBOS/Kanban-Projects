import {
    ADD_CARD,
    EDIT_CARD,
    DELETE_CARD,
    MOVE_CARD, LOGIN,
} from "./types";

export const addCard = (cardData) => async dispatch => {
    dispatch({
        type: ADD_CARD,
        payload: {
            laneId: cardData.laneId,
            card: {
                id: cardData.id,
                title: cardData.title,
                label: cardData.label,
                description: cardData.description
            }
        }
    });
};

export const authenticate = (payload) => async dispatch =>{
    dispatch({
        type: LOGIN,
        payload: payload
    })
};