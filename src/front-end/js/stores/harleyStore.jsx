import harleyReducer from "./../reducers/harleyReducer.jsx";
import {createStore} from "redux";
import {CHART_TYPES, CHART_PARAMS} from "./../constants/constants.jsx";

let date = new Date();
let firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1).toISOString();
let lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString();

let store = createStore(harleyReducer, {
    chart: {
        chartType: CHART_TYPES.TEMPERATURE,
        cityName: "Rivne",
        periodFrom: firstDayOfMonth,
        periodTo: lastDayOfMonth,
        statType: CHART_TYPES.TEMPERATURE
    },
    currentChart:{
        chartCity: "Rivne",
        chartParam: CHART_PARAMS.TEMPERATURE.LABEL
    },
    weather: {
        weather: []
    },
    statistics: {
        statistics: []
    },
    leaflet: {
        leaflet: {}
    },
    userName: "",
    userPassword: "",
    authError: {}
});

export default store;