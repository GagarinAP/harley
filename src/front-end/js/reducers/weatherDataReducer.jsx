import {ACTION_TYPES} from "./../constants/constants.jsx";

export function weather (state = {}, action) {
	switch (action.type) {
		case ACTION_TYPES.SET_WEATHER_DATA:
			let newState = state;
			newState.weather = action.weather;
			return newState;
		default: return state
	}
}