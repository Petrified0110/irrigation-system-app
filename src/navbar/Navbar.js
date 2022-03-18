import React from 'react'

import {
    CNavbar,
    CContainer,
    CNavbarBrand,
    CNavbarNav,
    CNavItem,
    CNavLink, CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem, CDropdownDivider
} from '@coreui/react';
import '@coreui/coreui/dist/css/coreui.min.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import {fetchFromToWithSensorType} from "../api";
import {NowDataDisplay} from "../data_display/NowDataDisplay"
import {PastXDataDisplay} from "../data_display/PastXDataDisplay"


export class Navbar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            allDropdownElems: ["Now", "Last Day", "Last Week", "Last Month"],
            humidity: [],
            temperature: [],
            currentDropdown: "Now",
            otherDropdownElems: ["Last Day", "Last Week", "Last Month"]
        };

        // this.getLatestHumidityData = this.getLatestHumidityData.bind(this);
        // this.getLatestTemperatureData = this.getLatestTemperatureData.bind(this);
    }

    getData = async (from, to, sensorType) => {
        let payload = {
            "from": from,
            "to": to,
            "sensorType": sensorType
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

    orderDataByTime(data) {
        return data.sort((a, b) => (a.time > b.time) ? 1 : -1)
    }

    componentDidMount() {
        this.getDataFor30Days("HUMID");
        this.getDataFor30Days("TEMP");
        console.log("MOUNT")
    }

    handleRemoveDropdownElem(elem) {
        const newList = this.state.allDropdownElems.filter(item => item !== elem);

        this.state.otherDropdownElems = newList
    }

    changeCurrentDropdown(elem) {
        this.getDataFor30Days("HUMID");
        this.getDataFor30Days("TEMP");
        this.state.currentDropdown = elem
        this.handleRemoveDropdownElem(elem)
        this.forceUpdate()
    }

    generateOtherDropdownMenu() {
        return (
            <CDropdownMenu>
                <CDropdownItem disabled>{this.state.currentDropdown}</CDropdownItem>
                <CDropdownDivider/>
                {this.state.otherDropdownElems.map(elem =>
                    <CDropdownItem onClick={() => this.changeCurrentDropdown(elem)}>{elem}</CDropdownItem>
                )}
            </CDropdownMenu>
        )
    }

    displayData() {
        if (this.state.currentDropdown === "Now") {
            return NowDataDisplay(this.state.humidity, this.state.temperature)
        }
        else if(this.state.currentDropdown === "Last Day"){
            return PastXDataDisplay(24*60, this.state.humidity, this.state.temperature)
        }
        else if(this.state.currentDropdown === "Last Week"){
            return PastXDataDisplay(24*60*7, this.state.humidity, this.state.temperature)
        }
        else if(this.state.currentDropdown === "Last Month"){
            return PastXDataDisplay(24*60*30, this.state.humidity, this.state.temperature)
        }
    }

    render() {
        return (
            <>
                <CNavbar expand="lg" colorScheme="light" className="bg-light">
                    <CContainer fluid>
                        <CNavbarBrand href="#">Irrigation System</CNavbarBrand>
                        {/*<CNavbarToggler onClick={() => setVisible(!visible)}/>*/}
                        {/*<CCollapse className="navbar-collapse" visible={visible}>*/}
                        <CNavbarNav>
                            <CNavItem>
                                <CNavLink href="/" active>
                                    Home
                                </CNavLink>
                            </CNavItem>
                            {/*<CNavItem>*/}
                            {/*    <CNavLink href="#">Link</CNavLink>*/}
                            {/*</CNavItem>*/}
                            <CDropdown variant="nav-item" popper={false}>
                                <CDropdownToggle color="secondary">{this.state.currentDropdown}</CDropdownToggle>
                                {this.generateOtherDropdownMenu()}
                            </CDropdown>
                            <CNavItem>
                                <CNavLink href="/" active>
                                    Account
                                </CNavLink>
                            </CNavItem>
                            {/*<CNavItem>*/}
                            {/*    <CNavLink href="#" disabled>*/}
                            {/*        Disabled*/}
                            {/*    </CNavLink>*/}
                            {/*</CNavItem>*/}
                        </CNavbarNav>
                        {/*<CForm className="d-flex">*/}
                        {/*    <CFormInput type="search" className="me-2" placeholder="Search"/>*/}
                        {/*    <CButton type="submit" color="success" variant="outline">*/}
                        {/*        Search*/}
                        {/*    </CButton>*/}
                        {/*</CForm>*/}
                        {/*</CCollapse>*/}
                    </CContainer>
                </CNavbar>
                <header className="App-header">
                    {this.displayData()}
                </header>
            </>
        )
    }
}