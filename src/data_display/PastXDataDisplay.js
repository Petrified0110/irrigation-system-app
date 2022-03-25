import React from "react";

import Chart from 'react-apexcharts';
import './PastXDataDisplay.css';

export const PastXDataDisplay = (minutes, humidity, temperature) => {

    function getDataForLastX(minutes, data) {
        const currentDate = new Date();
        const limit = new Date(currentDate.setMinutes(currentDate.getMinutes() - minutes)).toISOString();

        // console.log(data.map(d => {
        //     console.log(d.time)
        //     console.log(limit)
        //     console.log(d.time > limit)
        //     // console.log(d.time > limit)
        //     return  d.time - limit > 0
        // }))

        const filteredData = data.filter(d => d.time > limit);

        const localTimeData = filteredData.map(
            data => {
                data.time = new Date(data.time).toLocaleString()
                return data
            }
        )

        return localTimeData
    }

    const seriesTemperature = [
        {
            name: "Temperature",
            data: getDataForLastX(minutes, temperature).map(data => data.data)
        }
    ];

    const optionsTemperature = {
        xaxis: {
            categories: getDataForLastX(minutes, temperature).map(data => {
                console.log(data.time)
                return data.time
            }),
            type: 'datetime',
            labels: {
                datetimeUTC: false
            }
        },
        title: {
            text: "Temperature",
            align: "center"
        },
        labels: {
            datetimeFormatter: {
                year: 'yyyy',
                month: 'MMM \'yy',
                day: 'dd MMM',
                hour: 'HH:mm'
            },
            style: {
                colors: ['#000000'],
                fontSize: '12px',
                fontFamily: 'Helvetica, Arial, sans-serif',
                fontWeight: 400,
                cssClass: 'apexcharts-xaxis-label',
            },
        },
        dataLabels: {
            style: {
                fontSize: '14px',
                fontFamily: 'Helvetica, Arial, sans-serif',
                fontWeight: 'bold',
                colors: ['#000']
            },
        },
        tooltip: {
            x: {
                format: 'HH:mm dd MMM'
            }
        }
    };

    const seriesHumidity = [
        {
            name: "Humidity",
            data: getDataForLastX(minutes, humidity).map(data => data.data)
        }
    ];

    const optionsHumidity = {
        xaxis: {
            categories: getDataForLastX(minutes, humidity).map(data => data.time),
            type: 'datetime',
            labels: {
                datetimeUTC: false
            }
        },
        title: {
            text: "Humidity",
            align: "center"
        },
        labels: {
            datetimeFormatter: {
                year: 'yyyy',
                month: 'MMM \'yy',
                day: 'dd MMM',
                hour: 'HH:mm'
            }
        },
        tooltip: {
            x: {
                format: 'HH:mm dd MMM'
            }
        }
    };

    return (
        <div class="container">
            <Chart class="chartTemp" options={optionsTemperature} type="line" series={seriesTemperature} width="100%" float="left"/>
            <Chart class="chartHumid" options={optionsHumidity} type="line" series={seriesHumidity} width="100%" float="right"/>
        </div>
    );
}
