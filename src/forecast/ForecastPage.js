import React from "react";

import ReactWeather from 'react-open-weather';

import "./ForecastPage.css";
import {getForecast} from "../api";
import svgIcons from "react-open-weather/src/js/svgIcons";

export class ForecastPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            device: this.props.device,
            forecastData: null,
            location: ""
        };

        this.handleWeatherForecast()
    }

    handleWeatherForecast = async () => {
        let currentDevice = this.state.device
        console.log("forecast device ", currentDevice)

        if (currentDevice) {
            let payload = {
                "deviceId": currentDevice
            };

            if (!(this.state.forecastData && this.state.forecastData.length)) {
                const params = new URLSearchParams(payload);
                const forecast = await getForecast(params)

                if (forecast) {
                    forecast.forecast.current.icon = svgIcons.sunny
                    forecast.forecast.forecast.map(f => f.icon = svgIcons.sunny)
                    this.state.forecastData = forecast.forecast
                    this.state.location = forecast.location
                    // window.location.reload()
                } else {
                    this.props.history.push('/')
                }

                //TODO: throw error no gps or no data for device
            }
        }
    }

    render() {
        return (
            <ReactWeather
                // isLoading="false"
                // errorMessage="Something went wrong"
                data={this.state.forecastData}
                lang="en"
                locationLabel={this.state.location}
                unitsLabels={{temperature: 'C', windSpeed: 'Km/h'}}
                showForecast
            />
        )
    }
}
