import React from "react"
import './App.css';

import {Navbar} from './navbar/Navbar'
// import { BrowserRouter as Router, Route, Link } from "react-router-dom";

class App extends React.Component {


    render() {
        return (
            <div className="App">
                <Navbar />
            </div>
        )
    }
}

export default App
