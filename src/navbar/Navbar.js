import React from 'react'

import {
    CButton,
    CContainer,
    CDropdown,
    CDropdownDivider,
    CDropdownItem,
    CDropdownMenu,
    CDropdownToggle,
    CNavbar,
    CNavbarBrand,
    CNavbarNav,
    CNavItem,
    CNavLink
} from '@coreui/react';
import {View} from "react-native";
import '@coreui/coreui/dist/css/coreui.min.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import {fetchFromToWithSensorType, getShareableAccountsEndpoint, shareDevice} from "../api";
import {NowDataDisplay} from "../data_display/NowDataDisplay"
import {PastXDataDisplay} from "../data_display/PastXDataDisplay"
import Cookies from "universal-cookie";
import {Navigate, Route, Routes} from "react-router-dom";
import AuthenticateYourself from "../authentication/AuthenticateYourself";
import {SignUp} from "../authentication/SignUp";
import {Login} from "../authentication/Login";
import {Account} from "../account/Account";
import {DevicePicker} from "../devices/DevicePicker";
import Button from "react-bootstrap/Button";

import "./Navbar.css"
import {ForecastPage} from "../forecast/ForecastPage";

const cookies = new Cookies();

export class Navbar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isSignedIn: false,
            email: "",
            allDropdownElems: ["Now", "Last Day", "Last Week", "Last Month"],
            humidity: [],
            temperature: [],
            currentDropdown: "Now",
            otherDropdownElems: ["Last Day", "Last Week", "Last Month"],
            accountDropdownElems: [],
            devices: [],
            selectedDevice: "",
            selectedDeviceName: "",
            accountToShareWith: ""
        };

        this.DevicePicker = React.createRef();

        let cookiesToken = cookies.get('token');
        if (cookiesToken !== undefined) {
            this.state.isSignedIn = true
            this.state.email = cookies.get('user')
        }

        let cookiesSelectedDevice = cookies.get('selectedDevice')
        if (cookiesSelectedDevice !== undefined) {
            this.state.selectedDevice = cookiesSelectedDevice
            this.state.selectedDeviceName = cookies.get('selectedDeviceName')
        }
    }

    getData = async (from, to, sensorType) => {
        let payload = {
            "from": from,
            "to": to,
            "sensorType": sensorType,
            "deviceId": this.state.selectedDevice
        };

        const params = new URLSearchParams(payload);
        return await fetchFromToWithSensorType(params);
    };

    getDataFor30Days = async (sensorType) => {
        const now = new Date();

        const toDate = now.toISOString();
        const fromDate = new Date(now.setDate(now.getDate() - 30)).toISOString();
        // const toDate = moment();
        // const fromDate = moment().subtract( 7, 'day' );

        await this.getData(fromDate, toDate, sensorType).then(
            result => {
                if (sensorType === "HUMID")
                    this.setState({humidity: this.orderDataByTime(result)});
                else if (sensorType === "TEMP")
                    this.setState({temperature: this.orderDataByTime(result)});
            }
        );
    }

    getShareableAccountsForDevice = async () => {
        let payload = {
            "deviceId": this.state.selectedDevice
        };
        const params = new URLSearchParams(payload);

        await getShareableAccountsEndpoint(params).then(
            result => {
                this.setState({accountDropdownElems: result.map(account => account.email)});
            }
        )
    }

    orderDataByTime(data) {
        return data.sort((a, b) => (a.time > b.time) ? 1 : -1)
    }

    componentDidMount() {
        if (this.state.selectedDevice !== "") {
            this.getShareableAccountsForDevice();
            this.getDataFor30Days("HUMID");
            this.getDataFor30Days("TEMP");
        }

        console.log("MOUNT")
    }

    handleRemoveDropdownElem(elem) {
        this.state.otherDropdownElems = this.state.allDropdownElems.filter(item => item !== elem)
    }

    changeCurrentDropdown(elem) {
        if (this.state.selectedDevice !== "") {
            this.getDataFor30Days("HUMID");
            this.getDataFor30Days("TEMP");
        }
        this.state.currentDropdown = elem
        this.handleRemoveDropdownElem(elem)
        this.forceUpdate()
    }

    changeSelectedAccountToShareWith(elem) {
        this.state.currentAccountToShareWith = elem

        this.forceUpdate()
    }


    generateOtherDropdownMenu() {
        return (
            <CDropdownMenu>
                <CDropdownItem disabled>{this.state.currentDropdown}</CDropdownItem>
                <CDropdownDivider/>
                {this.state.otherDropdownElems.map(elem =>
                    <CDropdownItem disabled={!this.state.isSignedIn}
                                   onClick={() => this.changeCurrentDropdown(elem)}>{elem}</CDropdownItem>
                )}
            </CDropdownMenu>
        )
    }

    generateAccountsDropdownMenu() {
        return (
            <CDropdownMenu>
                {
                    this.state.accountDropdownElems.map(elem =>
                        <CDropdownItem onClick={() => this.changeSelectedAccountToShareWith(elem)}>
                            {elem}
                        </CDropdownItem>
                    )
                }
            </CDropdownMenu>
        )
    }

    displayData() {
        if (this.state.currentDropdown === "Now") {
            return NowDataDisplay(this.state.humidity, this.state.temperature)
        } else if (this.state.currentDropdown === "Last Day") {
            return PastXDataDisplay(24 * 60, this.state.humidity, this.state.temperature)
        } else if (this.state.currentDropdown === "Last Week") {
            return PastXDataDisplay(24 * 60 * 7, this.state.humidity, this.state.temperature)
        } else if (this.state.currentDropdown === "Last Month") {
            return PastXDataDisplay(24 * 60 * 30, this.state.humidity, this.state.temperature)
        }
    }

    chooseDevice() {
        return (
            <div align="center">
                <h1>Choose a device</h1>
                <Button block size="lg" href="/devices">
                    Devices
                </Button>
            </div>
        )
    }

    branchLoggedIn() {
        if (this.state.isSignedIn) {
            if (this.state.selectedDevice !== "") {
                return <Route path="/" element={this.displayData()}/>
            }
            return <Route path="/" element={this.chooseDevice()}/>
        } else {
            return <Route path="/" element={<Navigate replace to="/authenticate"/>}/>
        }
    }

    handleShareDevice = (accountToShareWith) => {
        console.log("share device ", accountToShareWith)

        if (accountToShareWith) {
            let payload = {
                "email": accountToShareWith,
                "deviceId": this.state.selectedDevice
            };

            const params = new URLSearchParams(payload);
            shareDevice(params);
        }
    }

    render() {
        return (
            <>
                <CNavbar expand="lg" colorScheme="light" className="bg-light">
                    <CContainer fluid>
                        <CNavbarBrand href="#">Irrigation System</CNavbarBrand>
                        <CNavbarNav>
                            <CNavItem>
                                <CNavLink href="/" active>
                                    Home
                                </CNavLink>
                            </CNavItem>
                            <CNavItem>
                                <CNavLink href="/devices" disabled={!this.state.isSignedIn}>Devices</CNavLink>
                            </CNavItem>
                            <CDropdown variant="nav-item" popper={false} disabled={!this.state.isSignedIn}>
                                <CDropdownToggle color="secondary">{this.state.currentDropdown}</CDropdownToggle>
                                {this.generateOtherDropdownMenu()}
                            </CDropdown>
                            <CNavItem>
                                <CNavLink href="/account" disabled={!this.state.isSignedIn}>
                                    My Account
                                </CNavLink>
                            </CNavItem>
                        </CNavbarNav>
                    </CContainer>
                </CNavbar>
                <View style={{borderBottomColor: 'black', borderBottomWidth: 1,}}/>
                {
                    this.state.selectedDevice !== "" &&
                    <div className="device1">
                        <CNavbar expand="lg" colorScheme="light" className="bg-light">
                            <CContainer fluid>
                                <CNavbarBrand>
                                    <h6>{this.state.selectedDeviceName}</h6>
                                    <h7>{this.state.selectedDevice}</h7>
                                </CNavbarBrand>
                                <CNavbarNav color-scheme="light">
                                    <CDropdown variant="nav-item" popper={false} active>
                                        <CDropdownToggle
                                            color="light">{this.state.currentAccountToShareWith ? this.state.currentAccountToShareWith : "Choose an account to share with"}
                                        </CDropdownToggle>
                                        {this.generateAccountsDropdownMenu()}
                                    </CDropdown>
                                    <CButton
                                        onClick={() => this.handleShareDevice(this.state.currentAccountToShareWith)}
                                        color="light">
                                        Share
                                    </CButton>
                                    <CButton href="/forecast" active
                                             color="light">
                                        See weather forecast
                                    </CButton>
                                </CNavbarNav>
                            </CContainer>
                        </CNavbar>
                    </div>
                }
                <header className="App-header">
                    <Routes>
                        {this.branchLoggedIn()}
                        <Route path="/authenticate" element={AuthenticateYourself()}/>
                        <Route path="/signup" element={<SignUp/>}/>
                        <Route path="/login" element={<Login/>}/>
                        <Route path="/account" element={<Account/>}/>
                        <Route path="/devices"
                               element={<DevicePicker ref={this.DevicePicker} devices={this.state.devices}/>}/>
                        <Route path="/forecast" element={<ForecastPage device={this.state.selectedDevice}/>}/>
                    </Routes>
                </header>
            </>
        )
    }

}
