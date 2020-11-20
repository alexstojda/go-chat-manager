import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";


export default function ChatLogModal({messages, state, onClose}) {

    return (
        <>
            <Modal
                show={state}
                onHide={onClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Modal title</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {messages && messages.length !== 0 && messages.map((message, key) => (
                        <p key={key}>
                            [{message.sentAt.format()}]
                            <span style={{fontWeight: "bold"}}>{message.sender}</span> >_ {message.message}
                        </p>))}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
