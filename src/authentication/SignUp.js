import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {signUp} from "../api";

import "./Auth.css";

export class SignUp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            firstName: "",
            lastName: "",
            confirmPassword: ""
        };
    }

    validateForm() {
        return this.state.email.length > 0 && this.state.password.length > 0 && this.state.password === this.state.confirmPassword;
    }

    handleSubmit = (event) => {
        event.preventDefault();

        let user = {
            email: this.state.email,
            password: this.state.password,
            firstName: this.state.firstName,
            lastName: this.state.lastName
        }

        signUp(user);
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
                    <Form.Group size="lg" controlId="firstName">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control
                            color="black"
                            autoFocus
                            type="firstName"
                            value={this.state.firstName}
                            onChange={(e) => this.setState(this.onInputChange(e))}
                        />
                    </Form.Group>
                    <Form.Group size="lg" controlId="lastName">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control
                            color="black"
                            autoFocus
                            type="lastName"
                            value={this.state.lastName}
                            onChange={(e) => this.setState(this.onInputChange(e))}
                        />
                    </Form.Group>
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
                    <Form.Group size="lg" controlId="confirmPassword">
                        <Form.Label>Confirm your password</Form.Label>
                        <Form.Control
                            color="black"
                            type="password"
                            value={this.state.confirmPassword}
                            onChange={(e) => this.setState(this.onInputChange(e))}
                        />
                    </Form.Group>
                    <Button block size="lg" type="submit" disabled={!this.validateForm()}>
                        Sign up
                    </Button>
                </Form>
            </div>
        );
    }
}
