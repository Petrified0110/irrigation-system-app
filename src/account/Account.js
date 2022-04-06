import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {createDevice, getAllAccounts} from "../api";

import "./Account.css";
import Cookies from "universal-cookie";

export class Account extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            accounts: [],
            account: {},
            deviceId: "",
            tenantId: "",
            nrfToken: "",
            deviceName: ""
        };
    }

    async componentDidMount() {
        let cookies = new Cookies();
        let currentUserEmail = cookies.get('user')

        try {
            let retrievedAccounts = await getAllAccounts();
            this.state.account = retrievedAccounts.find(data => data.email === currentUserEmail)
            this.state.accounts = retrievedAccounts.filter(data => data.email !== currentUserEmail)
        } catch (err) {
        }

        this.forceUpdate()
    }

    logout() {
        let cookies = new Cookies()

        cookies.remove('token', {path: '/'});
        cookies.remove('user', {path: '/'});
        cookies.remove('selectedDevice', {path: '/'});
        cookies.remove('selectedDeviceName', {path: '/'});
    }

    validateForm() {
        return this.state.deviceId.length > 0 && this.state.tenantId.length > 0 && this.state.nrfToken.length > 0;
    }

    handleDeviceCreation = (event) => {
        event.preventDefault();

        let device = {
            deviceId: this.state.deviceId,
            tenantId: this.state.tenantId,
            nrfToken: this.state.nrfToken,
            deviceName: this.state.deviceName
        }

        createDevice(device);
    }

    onInputChange(event) {
        return {
            [event.target.id]: event.target.value
        }
    }

    render() {
        return (
            <div className="Account">
                <Form>
                    <Form.Group size="lg" controlId="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            color="black"
                            autoFocus
                            type="email"
                            value={this.state.account.email}
                            readOnly={true}
                            // onChange={(e) => this.setState(this.onInputChange(e))}
                        />
                    </Form.Group>
                    <Form.Group size="lg" controlId="firstName">
                        <Form.Label>First name</Form.Label>
                        <Form.Control
                            color="black"
                            type="firstName"
                            value={this.state.account.firstName}
                            // onChange={(e) => this.setState(this.onInputChange(e))}
                        />
                    </Form.Group>
                    <Form.Group size="lg" controlId="lastName">
                        <Form.Label>Last name</Form.Label>
                        <Form.Control
                            color="black"
                            type="lastName"
                            value={this.state.account.lastName}
                            // onChange={(e) => this.setState(this.onInputChange(e))}
                        />
                    </Form.Group>
                </Form>
                <Button href="/" block size="lg" onClick={this.logout}>
                    Logout
                </Button>


                <Form onSubmit={this.handleDeviceCreation}>
                    <Form.Group size="lg" controlId="deviceId">
                        <Form.Label>nRF Device id</Form.Label>
                        <Form.Control
                            color="black"
                            autoFocus
                            type="deviceId"
                            value={this.state.deviceId}
                            onChange={(e) => this.setState(this.onInputChange(e))}
                        />
                    </Form.Group>
                    <Form.Group size="lg" controlId="tenantId">
                        <Form.Label>nRF Tenant id</Form.Label>
                        <Form.Control
                            color="black"
                            type="tenantId"
                            value={this.state.tenantId}
                            onChange={(e) => this.setState(this.onInputChange(e))}
                        />
                    </Form.Group>
                    <Form.Group size="lg" controlId="nrfToken">
                        <Form.Label>nRF Token</Form.Label>
                        <Form.Control
                            color="black"
                            type="nrfToken"
                            value={this.state.nrfToken}
                            onChange={(e) => this.setState(this.onInputChange(e))}
                        />
                    </Form.Group>
                    <Form.Group size="lg" controlId="deviceName">
                        <Form.Label>Device's name</Form.Label>
                        <Form.Control
                            color="black"
                            type="deviceName"
                            value={this.state.deviceName}
                            onChange={(e) => this.setState(this.onInputChange(e))}
                        />
                    </Form.Group>
                    <Button block size="lg" type="submit" disabled={!this.validateForm()}>
                        Add device
                    </Button>
                </Form>

            </div>
        )
    }
}
