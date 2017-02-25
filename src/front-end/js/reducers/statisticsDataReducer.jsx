import {ACTION_TYPES} from "./../constants/constants.jsx";

export function statistics (state = {}, action) {
    switch (action.type) {
        case ACTION_TYPES.GET_STATISTICS_DATA:
            let newState = state;
            newState.statistics = action.statistics;
            return newState;
        default: return state
    }
}