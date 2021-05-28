import React, { Component } from 'react';
import InitFormOperator from '../components/initChat/formOperator'
import ChatOperator from '../components/chat/chatOperator'
import WebSocketInstance from '../services/websocketOperator'
import axios from "axios";
import baseUrl from "../components/url";
import green from "../images/1920x1080-yellow-green-solid-color-background.jpg";


export default class LivechatOperator extends Component {
  constructor(props) {
    super(props);
    //this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
    this.state = {
      username: "",
      loggedIn: false,
      operator_id: "",
      room_name: "",
      normalView: true,
      isOnline: false,
    };
  }
  componentDidMount() {
    this.changeChatView()
    this.getUserData()

    setInterval(() => {
        this.notifyNewChat()
    },5000)

  }

  notifyNewChat = () => {
      let stringCounter = localStorage.getItem("newChats")
      let counter = parseInt(stringCounter)

     if(counter > 0) {

         // TODO: Show Banner
         document.getElementById("banner").className = "notification-show"

         // TODO: Set storage to zero
         localStorage.setItem("newChats", "0")

         // TODO: SetTimout for banner to disappear

         setTimeout(() => {
             document.getElementById("banner").className = "notification-hidden"
         },10000)

     }

  }


  getUserData = () => {
    const token = localStorage.getItem("token")

    axios.get( `${baseUrl}/backend/api/users/me/`, {
          headers: {
              'Authorization': `Bearer ${token}`
          }

    })
        .then((response) => {
          this.setState({
            ...this.state,
            isOnline: response["data"]["status"]
          })
        })
  }
  handleOnOffButton = (event) => {
    const url = `${baseUrl}/backend/api/users/me/`
    const token = localStorage.getItem("token")
    let fd = new FormData();

    if (this.state.isOnline === true) {
        fd.append('status', false);
    }
    else {
        fd.append('status', true)
    }




    axios.patch(url, fd,
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then((response) => {
            // console.log(response);
        })
        .catch((error) => {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);}
        });
    window.location.reload(false);
  }

  handleLoginSubmit = (username, chatID, roomName, operator) => {
    this.setState({
      username: username,
      loggedIn: true,
      chat_id: chatID,
      room_name: roomName,
      operator_id: operator
    })
    //console.log('does it work?')
    WebSocketInstance.connect();
  }
  backToForm = () => {
    this.setState({
      loggedIn: false
    })
  }
  changeChatView = () => {
    if(window.location.pathname === "/chat/operator") {
      this.setState({
        normalView: false
      })
    }
  }


  render() {
    const {
      loggedIn,
      username
    } = this.state;

    return (
      <div className={this.state.normalView ? "App" : "StandAloneChat"}>
        <div className="chat-btns">
            <div className="screensharing-btn">
              <a href="https://www.screenleap.com/" target="_blank"><button className="screensharing" >Screensharing</button></a>
            </div>
            <div className="about-btn-container">
              <button className="OnOffBtn" onClick={this.handleOnOffButton}>{this.state.isOnline ? "online" : "offline"}</button>
            </div>
            <div id="banner" className="notification-hidden">
                <img src={green} />
            </div>

        </div>

        {
          loggedIn ?
          <ChatOperator
            currentUser={username}
            chatID={this.state.chat_id}
            handleLoginState={this.backToForm}
            roomName={this.state.room_name}
            operator={this.state.operator_id}
          />
          :
          <InitFormOperator
              handleClick={this.handleLoginSubmit}
          />
        }
      </div>
    );
  }
}
