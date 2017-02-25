import React from "react";
import {Map, Marker, Popup, TileLayer} from "react-leaflet";
import L from "leaflet";
import {CHART_TYPES} from "./../constants/constants.jsx";

export default class LeafletMap extends React.Component {
    constructor() {
        super();
        this.getParamByCity = this.getParamByCity.bind(this);
        this.getParamByLeaflet = this.getParamByLeaflet.bind(this);
        this.getParamByleafletConfig = this.getParamByleafletConfig.bind(this);
    }

    getParamByCity(city, param){
        return _.map(_.filter(this.props.weather, weatherItem => {
            return weatherItem.cityName === city && weatherItem.sourceAPI === "openWeather";
        }), item => item[param]);
    }

    getParamByLeaflet(){
        var Citie = [];
        _.map(this.props.leaflet.cities, citie => {
            if (!citie.wundergroundName) {
                Citie.push(citie);
            }else{
                citie.name = citie.wundergroundName;
                Citie.push(citie);
            }
        });
        return Citie;
    }

    getParamByleafletConfig(){
        return _.defaults(this.props.leaflet.leafletConfig);
    }

    render() {
        L.Icon.Default.imagePath = this.getParamByleafletConfig().imagePath;
        return (
            <Map
                center={[this.getParamByleafletConfig().lat,this.getParamByleafletConfig().lng]}
                zoom={this.getParamByleafletConfig().zoom}
            >
                <TileLayer
                    attribution="Map data &copy; <a href='http://openstreetmap.org'>OpenStreetMap</a> contributors, <a href='http://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='http://mapbox.com'>Mapbox</a>"
                    url="https://api.tiles.mapbox.com/v4/mapbox.emerald/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiYW5keWtobWFyYSIsImEiOiJjaXVscXF5NTkwMDBiMm9waWlhamZldHB2In0.4ooYXIW33pagGNU4r9Hggw"
                />
                {this.getParamByLeaflet().map((point, index) => {
                    return (
                        <Marker
                            key={index}
                            position={[point.xCords,point.yCords]}
                        >
                        <Popup>
                            <div className="popup-statistic">
                                <h4>{point.name}</h4>
                                    <ul>
                                        <li>Temperature: {this.getParamByCity(point.name, CHART_TYPES.TEMPERATURE)}</li>
                                        <li>Pressure: {this.getParamByCity(point.name, CHART_TYPES.PRESSURE)}</li>
                                        <li>Wind speed: {this.getParamByCity(point.name, CHART_TYPES.WIND_SPEED)}</li>
                                        <li>Humidity: {this.getParamByCity(point.name, CHART_TYPES.HUMIDITY)}</li>
                                    </ul>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}
            </Map>
        );
    }
}
LeafletMap.propTypes = {
weather: React.PropTypes.array,
leaflet: React.PropTypes.object
};