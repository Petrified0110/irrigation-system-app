import React from "react";

import "./DevicePicker.css"
import Button from "react-bootstrap/Button";
import {fetchDevices} from "../api";
import Cookies from "universal-cookie";

export class DevicePicker extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            devices: []
        };
    }

    getDevices = async () => {
        await fetchDevices().then(
            result => {
                this.state.devices = result
                this.forceUpdate()
            }
        )
    }

    componentDidMount = async() => {
        await this.getDevices()
    }

    handleDeviceSelection = (index) => {
        let device = this.state.devices[index]

        let cookies = new Cookies()
        cookies.set('selectedDevice', device.deviceId, {path: '/'});
        cookies.set('selectedDeviceName', device.deviceName, {path: '/'});
    }


    render() {
        return (
            <div className="DevicePicker">
                {
                    this.state.devices.map((post, index) => {
                        return (<div key={index} className="Device">
                            <h1>{post.deviceName}</h1>
                            <h2>{post.deviceId}</h2>
                            <Button onClick={this.handleDeviceSelection(index)} href="/">See data</Button>
                        </div>)
                    })
                }

            </div>
        )

    }
}
