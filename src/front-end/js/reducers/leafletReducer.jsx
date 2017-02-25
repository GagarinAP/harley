import {ACTION_TYPES} from "./../constants/constants.jsx";

export function leaflet (state = {}, action) {
	switch (action.type) {
		case ACTION_TYPES.GET_LEAFLET_DATA:
			let newState = state;
			newState.leaflet = action.leaflet;
			return newState;
		default: return state;
	}
}