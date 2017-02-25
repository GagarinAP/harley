import React from "react";
import {Bar} from "react-chartjs-2";
import {CHART_TYPES, CHART_PARAMS} from "./../constants/constants.jsx";
import {changeChartCityAction, changeChartParamAction} from "./../actions/currentWeatherChartActions.jsx";
import _ from "lodash";


export default class Chart extends React.Component {
    constructor(props){
        super(props);
        this._getChartLabel = this._getChartLabel.bind(this);
        this._getServicesByCity = this._getServicesByCity.bind(this);
        this.handleCity = this.handleCity.bind(this);
        this.handleParam = this.handleParam.bind(this);
        this._getOptionsByParam = this._getOptionsByParam.bind(this);
        this._getMaximalValue = this._getMaximalValue.bind(this);
    }

    componentWillMount(){
        this.setState({
            options: this._getOptionsByParam(this.props.currentChart.chartParam)
        });
    }

    handleCity(event){
        changeChartCityAction(event.target.value);
        // this.setState({city: event.target.value});
    }

    handleParam(event){
        let options = this._getOptionsByParam(event.target.value);
        changeChartParamAction(event.target.value);
        this.setState({
            options
        });
    }

    _getOptionsByParam(param){
        const options = {
            responsive: true,
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }],
                xAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        };
        //TODO: this do not work properly
        // options.scales.yAxes[0].ticks.max = this._getMaximalValue(param);
        // if (param === CHART_PARAMS.TEMPERATURE.LABEL){
        //     console.log(param, "<>", CHART_PARAMS.TEMPERATURE.LABEL);
        //    options.scales.yAxes[0].ticks.min = CHART_PARAMS.TEMPERATURE.MIN;
        // } else {
        //     delete options.scales.yAxes[0].ticks.min;
        // }
        return options
    }

    // specially for 3/4 guy
    //return false ? (<div>Hi</div>) : (<div>Bye</div>);

    _getServicesByCity(){
        let services = [];
        let data = [];
        let city = this.props.currentChart.chartCity;
        let label = this.props.currentChart.chartParam;
        _.each(this.props.weather, (item) => {
            if (item.cityName === city){
                services.push(item.sourceAPI);
                data.push(item[label]);
            }
        });
        return {services, data};
    }
    //TODO this should be taken from config
    _getMaximalValue(param){
        switch (param) {
            case CHART_PARAMS.PREASURE.LABEL:
                return CHART_PARAMS.PREASURE.MAX;
            case CHART_PARAMS.HUMIDITY.LABEL:
                return CHART_PARAMS.HUMIDITY.MAX;
            case CHART_PARAMS.WIND_SPEED.LABEL:
                return CHART_PARAMS.WIND_SPEED.MAX;
            case CHART_PARAMS.TEMPERATURE.LABEL:
                return CHART_PARAMS.TEMPERATURE.MAX;
        }
    }
    //TODO this should be taken from config
    _getChartLabel(){
        switch (this.props.currentChart.chartParam) {
            case CHART_PARAMS.PREASURE.LABEL:
                return CHART_PARAMS.PREASURE.NAME;
            case CHART_PARAMS.HUMIDITY.LABEL:
                return CHART_PARAMS.HUMIDITY.NAME;
            case CHART_PARAMS.WIND_SPEED.LABEL:
                return CHART_PARAMS.WIND_SPEED.NAME;
            case CHART_PARAMS.TEMPERATURE.LABEL:
                return CHART_PARAMS.TEMPERATURE.NAME;
        }
    }

    render() {
        let weather = this._getServicesByCity();
        const data = {
            labels: weather.services,
            datasets: [
                {
                    label: this._getChartLabel(),
                    backgroundColor: [
                        "rgba(255, 99,  132, 0.2)",
                        "rgba( 54, 162, 235, 0.2)",
                        "rgba(255, 206,  86, 0.2)"
                    ],
                    borderColor: [
                        "rgba(255, 99,  132, 1)",
                        "rgba( 54, 162, 235, 1)",
                        "rgba(255, 206,  86, 1)"

                    ],
                    borderWidth: 1,
                    data: weather.data
                }
            ]
        };

        return (
            <section className="current-weather">
                <div className="container">
                    <div className="row">
                        <div className="col-xs-12 col-sm-4">
                            <h2>Current Weather Chart</h2>
                        </div>
                        <div className="col-xs-12 col-sm-4">
                            <label>City:</label>
                            <select
                                onChange={this.handleCity}
                                value={this.props.currentChart.chartCity}
                            >
                                <option value="Rivne">Rivne</option>
                                <option value="Kiev">Kiev</option>
                                <option value="Luts'k">Luts'k</option>
                            </select>
                        </div>
                        <div className="col-xs-12 col-sm-4">
                            <label>Parameter:</label>
                            <select
                                onChange={this.handleParam}
                                value={this.props.currentChart.chartParam}
                            >
                                <option value="temp">Temperature</option>
                                <option value="pressure">Pressure</option>
                                <option value="humidity">Humidity</option>
                                <option value="windSpeed">Wind Speed</option>
                            </select>
                        </div>
                    </div>
                </div>
                <Bar
                    data={data}
                    options={this.state.options}
                />
            </section>
        );
    }
}
Chart.propTypes = {
    currentChart: React.PropTypes.object,
    weather: React.PropTypes.array
}
