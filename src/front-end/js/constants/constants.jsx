export const CHART_TYPES = {

	TEMPERATURE: "temp",
	PRESSURE: "pressure",
	WIND_SPEED: "windSpeed",
	HUMIDITY: "humidity"
};

export const ACTION_TYPES = {
	TEST: "test",
	CHANGE_CHART_TYPE: "change_chart_type",
	SET_WEATHER_DATA: "set_weather_data",
    GET_STATISTICS_DATA: "get_statistics_data",
    CHANGE_CITY_NAME: "change_city_name",
    GET_DATE_FROM: "get_date_from",
    GET_DATE_TO: "get_date_to",
    STAT_TYPE: "stat_type",
    GET_LEAFLET_DATA: "get_leaflet_data",
    GET_CURRENT_WEATHER_DATA: "get_current_weather_data",
    CHANGED_CURRENT_CITY: "changed_current_city",
    CHANGED_CURRENT_PARAM: "changed_current_param",
    GET_USER_CREDENTIALS: "get_user_credentials",
    SET_USER_EMAIL: "set_user_email",
    SET_USER_PASSWORD: "set_user_password",
    SET_AUTH_ERROR: "set_auth_error"
};

export const CHART_PARAMS = {
    TEMPERATURE: {
    	NAME: "Temperature",
		LABEL: "temp",
		UNITS: "C",
		MIN: 30,
		MAX: -30
	},
    PREASURE: {
    	NAME: "Pressure",
        LABEL: "pressure",
        UNITS: "mmHg",
        MAX: 1200
    },
    HUMIDITY: {
        NAME: "Humidity",
        LABEL: "humidity",
        UNITS: "%",
        MAX: 100
    },
    WIND_SPEED: {
    	NAME: "Wind Speed",
		LABEL: "windSpeed",
        UNITS: "meter/sec",
        MAX: 50
	}
};