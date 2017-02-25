import {combineReducers} from "redux";
import {chart} from "./chartReducer.jsx";
import {weather} from "./weatherDataReducer.jsx";
import {statistics} from "./statisticsDataReducer.jsx";
import {currentChart} from "./currentChartReducer.jsx";
import { leaflet } from "./leafletReducer.jsx";
import { userName, userPassword, authError } from "./userAuthReducer.jsx";

let harleyReducer = combineReducers({
    chart,
    weather,
    statistics,
    currentChart,
    leaflet,
    userName,
    userPassword,
    authError
});

export default harleyReducer;