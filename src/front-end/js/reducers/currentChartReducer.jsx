import {ACTION_TYPES} from "./../constants/constants.jsx";

export function currentChart (state = {}, action){
    let newState = state;
    switch (action.type) {
        case ACTION_TYPES.CHANGED_CURRENT_CITY:
            newState.chartCity = action.chartCity;
            return newState;
        case ACTION_TYPES.CHANGED_CURRENT_PARAM:
            newState.chartParam = action.chartParam;
            return newState;
        default: return state;
    }
}