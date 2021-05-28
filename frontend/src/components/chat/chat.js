import React, { Component } from 'react';
import "./chat.scss"
import sendIcon from "../../images/send_button.svg"
import { withRouter } from "react-router-dom";

import WebSocketInstance from '../../services/websocket'
import axios from "axios";
import green from "../../images/Solid_green.svg.png";
import baseUrl from "../url";
import pdffile from "../../assets/svg/pdf-file.svg"
import clip from "../../assets/svg/paper-clip.svg";
import red from "../../images/Lead-Gray-600x600.jpg";

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {}

    this.waitForSocketConnection(() => {
      WebSocketInstance.initChatUser(this.props.currentUser);
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
          // console.log("Connection is made")
          callback();
          return;
        } else {
          // console.log("wait for connection...")
          component.waitForSocketConnection(callback);
        }
    }, 100); // wait 100 milisecond for the connection...
  }

  componentDidMount() {
    this.scrollToBottom();
    this.isSellerOnline();


  }

  componentDidUpdate() {
    this.scrollToBottom();
    document.querySelector(".container-messages-customer").scrollTop = document.querySelector(".container-messages-customer").scrollHeight
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
    //console.log(this.props.roomName)

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

  isSellerOnline = () => {
      const sellername = this.props.match.params.username

      axios.get(`${baseUrl}/backend/api/users/${sellername}`, {})
          .then((response) => {
              //console.log(response["data"])
              // this.state.seller = response["data"]
              // this.state.fetched = true

              this.setState({
                  seller: response["data"],
                  fetched: true
              })

              //console.log(this.state.seller.last_name)
          })


  }

  render() {
    const messages = this.state.messages;
    const currentUser = this.props.currentUser;
    return (

      <div className='chat'>

        {this.state.fetched ?
        <div className="seller-pb-name">
          <img src={this.state.seller["avatar"]}/>
          <p>{this.state.seller["first_name"] + " " + this.state.seller["last_name"]}</p>
          {this.state.seller["status"] ?
              <span>online</span>
              :
              <span>offline</span>
          }
          {this.state.seller["status"] ?
              <img src={green} id="online"/>
              :
              <img src={red} id="online"/>
          }
        </div>
        : null}
        <div className='container-messages-customer'>
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
              placeholder='Schreiben Sie eine Nachricht'
              required
              autoComplete="off"/>
            <label htmlFor="file-input">
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

export default withRouter(Chat)
