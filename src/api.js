import axios from "axios";
import Cookies from 'universal-cookie';
import {Navigate} from 'react-router-dom';
import React from "react";

const baseUrl = "https://irrigations.systems/"

function getToken() {
    let cookies = new Cookies()
    return cookies.get('token')
}

const headers = {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8;application/json',
    'Authorization': `Bearer ` + getToken()
}

export var fetchFromToWithSensorType = (params) => {
    return axios.get(baseUrl + "v1/data", {params, headers}).then(
        data => {
            return data.data
        }
    ).catch((error) => {
        console.log(error?.response?.data)
    })
}

export var fetchDevices = () => {
    return axios.get(baseUrl + "v1/devices", {headers}).then(
        data => {
            return data.data
        }
    ).catch((error) => {
        console.log(error?.response?.data)
    })
}

export var signUp = (user) => {
    axios.post(baseUrl + "v1/account", user, {headers})
        .then(
            result => {
                this.props.history.push(baseUrl)
            }
        ).catch((error) => {
        console.log(error?.response?.data)
    })
}

export var login = (credentials) => {
    axios.post(baseUrl + "v1/token", credentials, {headers}).then(res => res.data)
        .then(token => {
                const cookies = new Cookies();
                cookies.set('token', token, {path: '/'});
                cookies.set('user', credentials.email, {path: '/'})

                return <Navigate replace to="/"/>
            }
        ).catch((error) => {
        console.log(error?.response?.data)
    })
}

export var getAllAccounts = async () => {
    return await axios({
        method: 'get',
        url: baseUrl + "v1/accounts",
        headers: headers
    }).then(
        accounts => {
            return accounts.data
        }).catch((error) => {
        console.log(error?.response?.data)
    })
}

export var getShareableAccountsEndpoint = async (params) => {

    return axios.get(baseUrl + "v1/accounts", {params, headers}).then(
        data => {
            return data.data
        }
    ).catch((error) => {
        console.log(error?.response?.data)
    })
}

export var shareDevice = (params) => {
    const url =
        baseUrl + "v1/device/share?" +
        params;

    axios.post(url, {}, {headers})
        .then(
            result => {

            }
        ).catch((error) => {
        console.log(error?.response?.data)
    })
}

export var createDevice = (device) => {
    axios.post(baseUrl + "v1/device", device, {headers})
        .then(
            result => {
            }
        ).catch((error) => {
        console.log(error?.response?.data)
    })
}


axios.interceptors.request.use(request => {
    // console.log('Starting Request', JSON.stringify(request, null, 2))
    return request
})

axios.interceptors.response.use(response => {
    // console.log('Response:', JSON.stringify(response, null, 2))
    return response
})
