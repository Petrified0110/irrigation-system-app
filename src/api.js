import axios from "axios";

// export default {
//   // user: {
//   //   login: credentials =>
//   //     axios.get("http://164.92.132.20:8080/v1/data", { credentials }).then(res => res.data),
//   //   register: user =>
//   //     axios.post("/api/user", { user }).then(res => res.data.data),
//   //   }
//   sensorData: {
//     fetchFromToWithSensorType
//     // create: event =>
//     //   axios.post("http://localhost:8000/api/event", { event }).then(res => res.data.data.event)
//   }
// };

const headers = {
    headers: {
        'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8;application/json'
    }
}

export var fetchFromToWithSensorType = (params) => {
    return axios.get("http://164.92.132.20:8080/v1/data", {params, headers}).then(
        data => {
            return data.data;
        },
        error => {
            console.log("error occurred in fetchFromToWithSensorType")
        }
    );
}
