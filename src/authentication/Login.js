import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {login} from "../api";

import "./Auth.css";

export class Login extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: ""
        };
    }

    validateForm() {
        return this.state.email.length > 0 && this.state.password.length > 0;
    }

    handleSubmit = (event) => {
        event.preventDefault();

        let credentials = {
            email: this.state.email,
            password: this.state.password
        }

        login(credentials);
    }

    onInputChange(event) {
        return {
            [event.target.id]: event.target.value
        }
    }

    render() {
        return (
            <div className="Auth">
                <Form onSubmit={this.handleSubmit}>
                    <Form.Group size="lg" controlId="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            color="black"
                            autoFocus
                            type="email"
                            value={this.state.email}
                            onChange={(e) => this.setState(this.onInputChange(e))}
                        />
                    </Form.Group>
                    <Form.Group size="lg" controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            color="black"
                            type="password"
                            value={this.state.password}
                            onChange={(e) => this.setState(this.onInputChange(e))}
                        />
                    </Form.Group>
                    <Button block size="lg" type="submit" disabled={!this.validateForm()}>
                        Login
                    </Button>
                </Form>
            </div>
        )
    }
}
