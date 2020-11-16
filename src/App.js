import React from "react";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import moment from "moment";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form"
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import DateTimePicker from 'react-datetime-picker'
import InputGroup from "react-bootstrap/InputGroup"
import Dropdown from "react-bootstrap/Dropdown";
import styled from "styled-components";

const StyledDateTimePicker = styled(DateTimePicker)`
    & > div {
        border: none;
    }     
`;

function App() {

    const messages = [
        {
            message: "hello world",
            sender: "user1",
            sentAt: moment()
        },
        {
            message: "hello world",
            sender: "user1",
            sentAt: moment()
        },
        {
            message: "hello world",
            sender: "user1",
            sentAt: moment()
        },
        {
            message: "hello world",
            sender: "user1",
            sentAt: moment()
        },
        {
            message: "hello world",
            sender: "user1",
            sentAt: moment()
        }
    ]

    return (
        <Container>
            <h1 className="my-5"> Go Chat Manager </h1>
            <br/>
            <Card>
                <Card.Body>
                    {messages.map((message) => (<p>[{message.sentAt.format()}] <span
                        style={{fontWeight: "bold"}}>{message.sender}</span> >_ {message.message} </p>))}
                </Card.Body>
                <Card.Footer>
                    <Row>
                        <Col md="3">
                            <Form.Control placeholder="Name (Default: Anonymous)"/>
                        </Col>
                        <Col md="7">
                            <Form.Control placeholder="Message..."/>
                        </Col>
                        <Col md="2">
                            <Button variant="primary" className="w-100">Send</Button>
                        </Col>
                    </Row>
                </Card.Footer>
            </Card>
            <br/>
            <Card>
                <Card.Header>
                    <h4>Chat Admin</h4>
                </Card.Header>
                <Card.Body>
                    <Form>
                        <h5>Clear Chat</h5>
                        <Row>
                            <Col md="4">
                                <InputGroup className="mb-3">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text>Start</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <StyledDateTimePicker className="form-control"/>
                                </InputGroup>
                            </Col>
                            <Col md="4">
                                <InputGroup className="mb-3">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text>End</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <StyledDateTimePicker className="form-control"/>
                                </InputGroup>
                            </Col>
                            <Col md="2">
                                <Button className="w-100">Clear</Button>
                            </Col>
                            <Col md="2">
                                <Button className="w-100">Clear All</Button>
                            </Col>
                        </Row>
                    </Form>
                    <Form>
                        <h5>Search Chat</h5>
                        <Row>
                            <Col md="4">
                                <InputGroup className="mb-3">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text>Start</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <StyledDateTimePicker className="form-control"/>
                                </InputGroup>
                            </Col>
                            <Col md="4">
                                <InputGroup className="mb-3">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text>End</InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <StyledDateTimePicker className="form-control"/>
                                </InputGroup>
                            </Col>
                            <Col md="2">
                                <Button className="w-100">Search</Button>
                            </Col>
                            <Col md="2">
                                <Dropdown>
                                    <Dropdown.Toggle id="dropdown-basic" className="w-100">
                                        Download
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        <Dropdown.Item>XML</Dropdown.Item>
                                        <Dropdown.Item>Plaintext</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Col>
                        </Row>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default App;
