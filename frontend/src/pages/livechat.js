import React, { Component } from 'react';
import InitForm from '../components/initChat/form'
import Chat from '../components/chat/chat'
import WebSocketInstance from '../services/websocket'
import chat from "../assets/svg/chat.svg";

export default class Livechat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      loggedIn: false,
      chatState: false,
      room_name: "",
      pop_up: false
    };
  }

  handleLoginSubmit = (username, roomName, operator, event) => {
    event.preventDefault()
    this.setState({
      loggedIn: true,
      username: username,
      room_name: roomName,
      operator_id: operator
    });
    WebSocketInstance.connect();
  }

  componentDidMount() {

    const scriptSentry = document.createElement("script");
    const scriptChat = document.createElement("script");
    const scriptConfig = document.createElement("script");

    scriptSentry.src = "https://js.sentry-cdn.com/4bffc82f812b40c4bd2002fc872d8f37.min.js";
    scriptChat.src = "https://chat.autograf.ch/customer/autografchat.js";
    scriptConfig.src = "https://chat.autograf.ch/integration/config.js";

    document.head.appendChild(scriptSentry);
    document.head.appendChild(scriptChat);
    document.head.appendChild(scriptConfig);

  }

  render() {
    const {
      loggedIn,
      username,
      pop_up
    } = this.state;





    return (
        <>
      {/*<div className="App">*/}
      {/*  /!*<img className='chat-popup' src={chat}  alt='Chat'/>*!/*/}
      {/*  {*/}
      {/*    loggedIn ?*/}
      {/*    <Chat*/}
      {/*      currentUser={username}*/}
      {/*      roomName={this.state.room_name}*/}
      {/*      operator={this.state.operator_id}*/}
      {/*    />*/}
      {/*    :*/}
      {/*    <InitForm*/}
      {/*      onSubmit={this.handleLoginSubmit}*/}
      {/*      usernameChangeHandler={this.usernameChangeHandler}*/}
      {/*    />*/}
      {/*  }*/}
      {/*</div>*/}



          </>




    );
  }
}
