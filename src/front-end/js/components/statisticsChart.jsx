import React from "react";
import { Line } from "react-chartjs-2";
import {CHART_TYPES} from "./../constants/constants.jsx";
import _ from "lodash";


export default class StatChart extends React.Component{
    constructor(props) {
        super(props);
        this._getChartData = this._getChartData.bind(this);
        this._getTimeLabel = this._getTimeLabel.bind(this);
    }
    // TODO: TEMP FUNCTIONs
    _getChartData(service = "openWeather") {

        let openWeatherData = [];
        _.each(this.props.statistics, function (data) {
           if (data.sourceAPI === service) openWeatherData.push(data.stat)
        });
        switch (this.props.chartType) {
            case CHART_TYPES.TEMPERATURE: {
                return openWeatherData.map(stat=>stat.temp.avg);
            }
            case CHART_TYPES.HUMIDITY: {
                return openWeatherData.map(stat=>stat.humidity.avg);
            }
            case CHART_TYPES.WIND_SPEED: {
                return openWeatherData.map(stat=>stat.windSpeed.avg);
            }
            case CHART_TYPES.PRESSURE: {
                return openWeatherData.map(stat=>stat.pressure.avg);
            }
            default : return openWeatherData.map(stat=>stat.temp.avg);
        }
    }
    _getTimeLabel() {
        let timeLabel = [];
        _.each(this.props.statistics, function (data) {
            if (data.sourceAPI === "openWeather") {
                let date = new Date(data.date * 1000);
                timeLabel.push(`${date.getFullYear()}-${(date.getMonth() + 1)}-${date.getDate()}`);
            }
        });
        return timeLabel;
    }
    render(){
        //TODO: change this to props after other guys will do action :)
        let serviceList = ["openWeather", "wunderground", "darkSky"];
        let colorsList = ["#FFC300", "#C70039", "#581845"];
        let dataSet = [];
        { serviceList.map((service, index) => {
            dataSet.push({
                label: `Data from ${service}`,
                fill: false,
                lineTension: 0.1,
                backgroundColor: colorsList[index],
                borderColor: colorsList[index],
                borderCapStyle: "butt",
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: "miter",
                pointBorderColor: "rgba(75,192,192,1)",
                pointBackgroundColor: "#fff",
                pointBorderWidth: 2,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: colorsList[index],
                pointHoverBorderColor: "rgba(220,220,220,1)",
                pointHoverBorderWidth: 2,
                pointRadius: 5,
                pointHitRadius: 10,
                data: this._getChartData(service)
            });
        })}

        const data = {
            labels: this._getTimeLabel(),
            datasets: dataSet
        };
        const option = {
            responsive: true
        };

        return(
            <div>
                <Line
                    data={data}
                    options={option}
                />
            </div>
        );
    }
}

StatChart.propTypes = {
    statistics: React.PropTypes.array,
    chartType: React.PropTypes.string
};