import { ACTION_TYPES } from "./../constants/constants.jsx";
import store from "./../stores/harleyStore.jsx";

export function changeUserEmailAction (name){
    console.log("user action", name);
    store.dispatch({
        type: ACTION_TYPES.SET_USER_EMAIL,
        userName: name
    });
}

export function changeUserPasswordAction (password){
    store.dispatch({
        type: ACTION_TYPES.SET_USER_PASSWORD,
        userPassword: password
    });
}

export function catchErrorAction (error){
    store.dispatch({
        type: ACTION_TYPES.SET_AUTH_ERROR,
        authError: error
    });
}