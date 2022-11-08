import React, { useRef, useState } from "react";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import moment from "moment";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import DateTimePicker from "react-datetime-picker";
import InputGroup from "react-bootstrap/InputGroup";
import Dropdown from "react-bootstrap/Dropdown";
import styled from "styled-components";
import axios from "axios";
import timeFormat from "./utils/timeFormat";
import useInterval from "@restart/hooks/useInterval";
import ChatLogModal from "./chatLogModal";

const StyledDateTimePicker = styled(DateTimePicker)`
  & > div {
    border: none;
  }
`;

const ChatCard = styled(Card)`
  height: 25vw;
`;

const ChatCardBody = styled(Card.Body)`
  height: 100%;
  overflow-x: scroll;
`;

function App() {
  const [newSender, setSender] = useState("");
  const [newMessage, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [refreshCounter, updateRefreshCounter] = useState(5);
  const [isLoading, setIsLoading] = useState(false);

  const [showLogModal, setShowLogModal] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const [startDate, setStartDate] = useState(moment().toDate());
  const [endDate, setEndDate] = useState(moment().toDate());

  const bottomRef = useRef();

  const scrollToBottom = () => {
    bottomRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  useInterval(() => {
    if (!isLoading) {
      // Your custom logic here
      if (refreshCounter > 0) updateRefreshCounter(refreshCounter - 1);
      else updateRefreshCounter(5);
      if (refreshCounter === 0) {
        setIsLoading(true);
        fetchMessages();
        scrollToBottom();
      }
    }
  }, 1000);

  function onNewMessageChange(e) {
    setMessage(e.target.value);
    setMessage(e.target.value);
  }

  function onNewSenderChange(e) {
    setSender(e.target.value);
  }

  function postMessage() {
    if (newMessage === "") return;

    axios
      .post(apiUrl("/api/chat"), {
        sender: newSender,
        message: newMessage,
      })
      .then((response) => {
        if (response.status === 201) {
          setMessage("");
          updateRefreshCounter(5);
          fetchMessages();
        }
      });
  }

  function fetchMessages() {
    axios.get(apiUrl("/api/chat")).then((response) => {
      console.debug(response);
      if (response.status === 200) {
        let messages = response.data.messages
          .map((message) => {
            message.sentAt = moment.utc(message.sentAt, timeFormat).local();
            return message;
          })
          .sort((a, b) => a.sentAt - b.sentAt);
        setMessages(messages);
      } else {
        console.error(response.statusText, response.data);
        console.debug(response);
      }
      setIsLoading(false);
    });
  }

  function searchMessages() {
    axios
      .get(apiUrl("/api/chat"), {
        params: {
          start: startDate ? moment(startDate).utc().format(timeFormat) : null,
          end: endDate ? moment(endDate).utc().format(timeFormat) : null,
        },
        headers: {
          Accept: "application/json",
        },
      })
      .then((response) => {
        console.debug(response);
        if (response.status === 200 && response.data.messages) {
          let messages = response.data.messages
            .map((message) => {
              message.sentAt = moment.utc(message.sentAt, timeFormat).local();
              return message;
            })
            .sort((a, b) => a.sentAt - b.sentAt);
          setSearchResults(messages);
          setShowLogModal(true);
        } else {
          console.error(response.statusText, response.data);
          console.debug(response);
        }
      });
  }

  function openDownload(format) {
    if (format)
      switch (format) {
        case "xml":
          format = "application/xml";
          break;
        case "json":
          format = "application/json";
          break;
        default:
          break;
      }

    const params = new URLSearchParams({
      start: startDate ? moment(startDate).utc().format(timeFormat) : "",
      end: endDate ? moment(endDate).utc().format(timeFormat) : "",
      format: format ? format : "",
      download: true,
    });

    window.open(apiUrl("/api/chat?" + params.toString()), "_blank");
  }

  function deleteMessages(startDate, endDate) {
    setIsLoading(true);
    axios
      .delete(apiUrl("/api/chat"), {
        params: {
          start: startDate ? moment(startDate).utc().format(timeFormat) : null,
          end: endDate ? moment(endDate).utc().format(timeFormat) : null,
        },
        headers: {
          Accept: "application/json",
        },
      })
      .then((response) => {
        console.debug(response);
        if (response.status === 204) {
          fetchMessages();
        } else {
          console.error(response.statusText, response.data);
          console.debug(response);
        }
      });
  }

  function apiUrl(path) {
    if (
      process.env.REACT_APP_API_HOST !== undefined &&
      process.env.REACT_APP_API_HOST !== ""
    ) {
      return process.env.REACT_APP_API_HOST + path;
    } else {
      return path;
    }
  }

  return (
    <Container>
      <h1 className="my-5"> Go Chat Manager </h1>
      <br />
      <ChatCard>
        <ChatCardBody>
          {messages &&
            messages.length !== 0 &&
            messages.map((message, key) => (
              <p key={key}>
                [{message.sentAt.format("DD/MM h:mm:ss A")}]{" "}
                <span style={{ fontWeight: "bold" }}>{message.sender}</span>{" "}
                {">"}_ {message.message}{" "}
              </p>
            ))}
          <div ref={bottomRef} className="list-bottom" />
        </ChatCardBody>
        <Card.Footer>
          <Row>
            <Col md="3">
              {!isLoading && "Refreshing in " + refreshCounter}
              {isLoading && "Loading..."}
            </Col>
          </Row>
          <Row>
            <Col md="3">
              <Form.Control
                value={newSender}
                onChange={onNewSenderChange}
                placeholder="Name (Default: Anonymous)"
              />
            </Col>
            <Col md="7">
              <Form.Control
                value={newMessage}
                onChange={onNewMessageChange}
                placeholder="Message..."
              />
            </Col>
            <Col md="2">
              <Button variant="primary" className="w-100" onClick={postMessage}>
                Send
              </Button>
            </Col>
          </Row>
        </Card.Footer>
      </ChatCard>
      <br />
      <Card>
        <Card.Header>
          <h4>Chat Admin</h4>
        </Card.Header>
        <Card.Body>
          <Form>
            <h5>Select dates (optional)</h5>
            <Row>
              <Col md="6">
                <InputGroup className="mb-3">
                  <InputGroup.Prepend>
                    <InputGroup.Text>Start</InputGroup.Text>
                  </InputGroup.Prepend>
                  <StyledDateTimePicker
                    className="form-control"
                    value={startDate}
                    onChange={setStartDate}
                    disableClock
                  />
                </InputGroup>
              </Col>
              <Col md="6">
                <InputGroup className="mb-3">
                  <InputGroup.Prepend>
                    <InputGroup.Text>End</InputGroup.Text>
                  </InputGroup.Prepend>
                  <StyledDateTimePicker
                    className="form-control"
                    value={endDate}
                    onChange={setEndDate}
                  />
                </InputGroup>
              </Col>
            </Row>
          </Form>
          <Form>
            <Row>
              <Col md="3">
                <Button
                  className="w-100"
                  onClick={() => {
                    searchMessages();
                  }}
                >
                  Search
                </Button>
              </Col>
              <Col md="3">
                <Dropdown>
                  <Dropdown.Toggle id="dropdown-basic" className="w-100">
                    Download
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item
                      onClick={() => {
                        openDownload("xml");
                      }}
                    >
                      XML
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => {
                        openDownload("json");
                      }}
                    >
                      JSON
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => {
                        openDownload();
                      }}
                    >
                      Plaintext
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Col>
              <Col md="3">
                <Button
                  className="w-100 btn-warning"
                  onClick={() => {
                    if (window.confirm("Are you sure?"))
                      deleteMessages(startDate, endDate);
                  }}
                >
                  Clear
                </Button>
              </Col>
              <Col md="3">
                <Button
                  className="w-100 btn-danger"
                  onClick={() => {
                    if (window.confirm("Are you sure?")) deleteMessages();
                  }}
                >
                  Clear All
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
      <ChatLogModal
        messages={searchResults}
        state={showLogModal}
        onClose={() => {
          setShowLogModal(false);
        }}
      />
    </Container>
  );
}

export default App;
