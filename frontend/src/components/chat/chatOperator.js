import React, { Component } from 'react';
import "./chat.scss"
import sendIcon from "../../images/send_button.svg"
import axios from "axios";
import backButton from "../../assets/svg/down-arrow.svg"
import clip from "../../assets/svg/paper-clip.svg"
import pdffile from "../../assets/svg/pdf-file.svg"


import WebSocketInstance from '../../services/websocketOperator'
import baseUrl from "../url";

export default class ChatOperator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active_chats: [],
    }

    this.waitForSocketConnection(() => {
      // WebSocketInstance.initChatUser(this.props.currentUser);
      WebSocketInstance.addCallbacks(this.setMessages.bind(this), this.addMessage.bind(this), this.handleFileUpload.bind(this))
      this.setMessages([]);
      // WebSocketInstance.fetchMessages(this.props.currentUser);
    });
  }



  waitForSocketConnection(callback) {

    const component = this;
    setTimeout(
      function () {
        // Check if websocket state is OPEN
        if (WebSocketInstance.state() === 1) {
          //console.log("Connection is made")
          callback();

          return;
        } else {
          //console.log("wait for connection...")
          component.waitForSocketConnection(callback);
        }
    }, 100); // wait 100 milisecond for the connection...
  }


  getAllMessages = () => {
    const token = localStorage.getItem("token")
    axios.get(`${baseUrl}/backend/api/messages/${this.props.chatID}`, {
      headers: {
              'Authorization': `Bearer ${token}`
          }
    }).then((res) => {

      const chatObj = res["data"][0];

      let tempMessages = [];

      //console.log(chatObj);

      if (chatObj['messages'] !== null) {

        for (const [msgK, msg] of Object.entries(chatObj['messages'])) {

          tempMessages.push(msg);
        }

        //console.log(tempMessages);

        // this.renderMessages(tempMessages);

        this.setState({
          ...this.state,
          messages: tempMessages
        });
      }

    })
  }

  handleFileUpload = (event) => {
    // event.preventDefault()
    const currentfiles = []
    for (const [fileKey, file] of Object.entries(event.target.files)) {
      currentfiles.push(file)
    }

    //console.log(currentfiles)


    // const token = localStorage.getItem("token")
    const url = `${baseUrl}/backend/api/files/`
    let fd = new FormData();

    for (const file of currentfiles) {
      fd.append('files', file)
    }



    fd.append('room_name', this.props.roomName)
    fd.append("author", this.props.currentUser)
    fd.append("operator_id", this.props.operator)

    axios(
        {
          method: 'POST',
          data: fd,
          url: url,
          headers: {
            'content-type': 'multipart/form-data'
          }
        }
    )
        .then((response) => {
          WebSocketInstance.newFileMessage(response["data"])
        })
  }

  componentDidMount() {

    this.scrollToBottom();
    document.querySelector(".container-messages").scrollTop = document.querySelector(".container-messages").scrollHeight
    setTimeout(() => {
      this.getAllMessages()
    },250)


  }

  componentDidUpdate() {
    this.scrollToBottom();
    document.querySelector(".container-messages").scrollTop = document.querySelector(".container-messages").scrollHeight
  }

  scrollToBottom = () => {
    const chat = this.messagesEnd;
    const scrollHeight = chat.scrollHeight;
    const height = chat.clientHeight;
    const maxScrollTop = scrollHeight - height;
    chat.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
  }

  addMessage(message) {
    this.setState({ messages: [...this.state.messages, message]});
  }

  setMessages(messages) {
    this.setState({ messages: messages.reverse()});
  }

  messageChangeHandler = (event) =>  {
    this.setState({
      message: event.target.value
    })
  }

  sendMessageHandler = (e, message) => {
    const messageObject = {
      from: this.props.currentUser,
      text: message
    };
    WebSocketInstance.newChatMessage(messageObject);
    this.setState({
      message: ''
    })
    e.preventDefault();
  }

  backArrowhandler = (event) => {
    event.preventDefault()
    this.props.handleLoginState();
    WebSocketInstance.disconnect();

  }

  renderMessages = (messages) => {
    const currentUser = this.props.currentUser;
    return messages.map((message, i) => {
      if (message.body.type === "file") {
        if (message.body.ext === "pdf"){
          return <div key={message.id} className={message.author === currentUser ? 'customer' : 'operator'}><a href={baseUrl + "/userfiles/" + this.props.roomName + "/" + message.body.content} target="_blank"><img src={pdffile} className="pdf"/></a></div>
        }
        else {
          return <div key={message.id} className={message.author === currentUser ? 'customer' : 'operator'}><a href={baseUrl + "/userfiles/" + this.props.roomName + "/" + message.body.content} target="_blank"><img src={baseUrl + "/userfiles/" + this.props.roomName + "/" + message.body.content}/></a></div>
        }
      }

      else {
        return <div key={message.id} className={message.author === currentUser ? 'customer' : 'operator'} dangerouslySetInnerHTML={{__html: message.body.content} }></div>
      }


    })

  }
  render() {
    const messages = this.state.messages;
    const currentUser = this.props.currentUser;
    return (
      <div className='chat'>
        <div className="back-btn">
          <img src={backButton} onClick={(event) => this.backArrowhandler(event)}/>
        </div>
        <div className='container-messages'>
          {/*<h1>Chatting as {currentUser} </h1>*/}
          <div ref={(el) => { this.messagesEnd = el; }} className="message-wrapper">
           {

              messages &&
              this.renderMessages(messages)
           }
          </div>
        </div>
        <div className='container-message-form'>
          <form onSubmit={(e) => this.sendMessageHandler(e, this.state.message)} className='form'>
            <input
              type='text'
              className="text-input"
              onChange={this.messageChangeHandler}
              value={this.state.message}
              placeholder='Schreibe eine Nachricht'
              required />
            <label for="file-input">
              <img src={clip} className="fileUpload"/>
            </label>
            <input id="file-input" type="file" accept="image/*, application/pdf" name="file" onChange={(event) => this.handleFileUpload(event)} multiple/>
            <button className='submit' type='submit' value='Submit'>
              <img src={sendIcon}/>
            </button>
          </form>
        </div>
      </div>
    );
  }
}
