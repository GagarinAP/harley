import {ACTION_TYPES} from "./../constants/constants.jsx";

export function userName (state = {}, action) {
    switch (action.type) {
        case ACTION_TYPES.SET_USER_EMAIL:
            console.log("user reducer", state);
            let nameState = state;
            nameState.userName = action.userName;
            return newState;
        default: return state
    }
}export function userPassword (state = {}, action) {
    switch (action.type) {
        case ACTION_TYPES.SET_USER_PASSWORD:
            let passwordState = state;
            passwordState.userPassword = action.userPassword;
            return newState;
        default: return state
    }
}export function authError (state = {}, action) {
    switch (action.type) {
        case ACTION_TYPES.SET_AUTH_ERROR:
            let authErrorState = state;
            authErrorState.authError = action.authError;
            return newState;
        default: return state
    }
}