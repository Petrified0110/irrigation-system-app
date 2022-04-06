import React from "react";

import "./DevicePicker.css"
import Button from "react-bootstrap/Button";
import {fetchDevices} from "../api";
import Cookies from "universal-cookie";

export class DevicePicker extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            devices: [],
            currentUser: ""
        };

        let cookies = new Cookies()
        this.state.currentUser = cookies.get("user")
    }

    getDevices = async () => {
        await fetchDevices().then(
            result => {
                this.state.devices = result
                this.forceUpdate()
            }
        )
    }

    componentDidMount = async () => {
        await this.getDevices()
    }

    handleDeviceSelection = (index) => {
        let device = this.state.devices[index]

        let cookies = new Cookies()
        cookies.set('selectedDevice', device.deviceId, {path: '/'});
        cookies.set('selectedDeviceName', device.deviceName, {path: '/'});
    }

    returnClassName = (device) => {
        var className = "Device"

        if (device.owner === this.state.currentUser) {
            className = "Device Owned"
        }
        return className
    }


    render() {
        return (
            <div className="DevicePicker">
                {
                    this.state.devices.map((device, index) => {
                        return (<div key={index} className={this.returnClassName(device)}>
                            <h1>{device.deviceName}</h1>
                            <h2>{device.deviceId}</h2>
                            <h3>Owner: {device.owner}</h3>
                            <Button onClick={this.handleDeviceSelection(index)} href="/">See data</Button>
                        </div>)
                    })
                }

            </div>
        )

    }
}
