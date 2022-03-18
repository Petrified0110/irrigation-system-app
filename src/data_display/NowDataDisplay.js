import React from "react";
import {Humidity, Temperature} from "react-environment-chart";

export const NowDataDisplay = (humidity, temperature) => {

    function getLatestHumidityData() {
        let first = humidity[humidity.length - 1]
        if (first !== undefined && humidity.length > 0) {
            let humid = parseInt(first.data, 10) + 1;
            return (<Humidity value={humid}/>)
        }
    }

    function getLatestTemperatureData() {
        let first = temperature[temperature.length - 1]
        if (first !== undefined && temperature.length > 0) {
            let temp = parseInt(first.data, 10) + 1;
            return (<Temperature value={temp}/>)
        }
    }

    return (
        <div>
            {getLatestHumidityData()}
            {getLatestTemperatureData()}
        </div>
    )
}
