import { ACTION_TYPES } from "./../constants/constants.jsx";
import store from "./../stores/harleyStore.jsx";

export function changeChartCityAction (city) {
    store.dispatch({
        type: ACTION_TYPES.CHANGED_CURRENT_CITY,
        chartCity: city
    });
}

export function changeChartParamAction (param){
    store.dispatch({
        type: ACTION_TYPES.CHANGED_CURRENT_PARAM,
        chartParam: param
    });
}
