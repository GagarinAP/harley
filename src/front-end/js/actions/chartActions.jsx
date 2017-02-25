import { ACTION_TYPES } from "./../constants/constants.jsx";
import store from "./../stores/harleyStore.jsx";

export function changeChartTypeAction (chartType) {
	store.dispatch({
		type: ACTION_TYPES.CHANGE_CHART_TYPE,
		chartType: chartType
	});
}

export function changeCityAction (cityName) {
	store.dispatch({
		type: ACTION_TYPES.CHANGE_CITY_NAME,
		cityName: cityName
	});
}

export function changeDateFromAction (periodFrom) {
	store.dispatch({
		type: ACTION_TYPES.GET_DATE_FROM,
		periodFrom: periodFrom
	});
}

export function changeDateToAction (periodTo) {
	store.dispatch({
		type: ACTION_TYPES.GET_DATE_TO,
		periodTo: periodTo
	});
}

export function changeStatTypeAction (statType) {
    store.dispatch({
        type: ACTION_TYPES.STAT_TYPE,
        statType: statType
    });
}