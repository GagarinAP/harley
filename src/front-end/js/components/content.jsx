import React from "react";
import Chart from "./chart.jsx";
import StatChart from "./statisticsChart.jsx";
import LeafletMap from "./leaflet.jsx";

export default class Content extends React.Component {
    constructor() {
        super();
    }
    render () {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <StatChart
                            chartType={this.props.chartType}
                            statistics={this.props.statistics}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <Chart
                            currentChart={this.props.currentChart}
                            weather={this.props.weather}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <div className="map-wrapper">
                            <LeafletMap
                                leaflet={this.props.leaflet}
                                weather={this.props.weather}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

Content.propTypes = {
leaflet: React.PropTypes.object,
statistics: React.PropTypes.array,
weather: React.PropTypes.array,
currentChart: React.PropTypes.object,
chartType: React.PropTypes.string
};

