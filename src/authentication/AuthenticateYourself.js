import React from "react";
import Button from "react-bootstrap/Button";

import "./AuthenticateYourself.css";


export default function AuthenticateYourself() {
    return (
        <React.Fragment>
            <div className="ButtonGroup">
                <div className="ButtonCss">
                    <Button variant="light" size="lg" href="/signup"> Sign up </Button>
                </div>
                <div className="ButtonCss">
                    <Button variant="light" size="lg" href="/login"> Login </Button>
                </div>

            </div>
        </React.Fragment>
    )

}
