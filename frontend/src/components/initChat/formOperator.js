import React, { Component } from 'react';
import WebSocketInstance from "../../services/websocketOperator";
import "./form.scss"
import { withRouter } from "react-router-dom";
import axios from "axios";
import {BASEURL} from "../config";
import {useSelector} from "react-redux";
import livechatOperator from "../../pages/livechatOperator";
import LivechatOperator from "../../pages/livechatOperator";
import baseUrl from "../url";


class InitFormOperator extends Component {

  constructor(props) {
      super(props);
      //this.props = props;

      //this.setFormRoomName = this.setFormRoomName.bind(this);
      this.state = {
        value: '',
        seller_id: null,
        chats: [],
        seller_name: null,
        active_chats: [],
      };
  }

  componentDidMount() {

      if("Notification" in window) {
          Notification.requestPermission()
      }

      setTimeout(() => {

          this.isSellerOnline();

      }, 250);

       setInterval(() => {
           this.getChatList();
       }, 15000)

  }



    //   usernameChangeHandler = (event) =>  {
  //   this.setState({
  //     username: event.target.value
  //   })
  // }
  // roomChangeHandler = (event) => {
  //     this.setState({
  //         room: event.target.value
  //     })
  // }
  setFormRoomName = (operator, customer, chatId, roomName) => {


      // const operator = event.target.attributes.getNamedItem("idoperator").value
      // const customer = event.target.attributes.getNamedItem("namecustomer").value

      //console.log(operator, customer)

      const tmp_customer = customer.replace(/[^0-9a-z]/gi, '')
      //console.log(tmp_customer)
      const room_path = `${operator}/${tmp_customer}`
      const chat_id = chatId
      //console.log("room Name before state", room_path)




      if(room_path !== "") {

          WebSocketInstance.setRoomname(room_path)
          this.props.handleClick(this.state.seller_name, chat_id, roomName, operator);


      }

  }



  isSellerOnline  = () => {
      const token = localStorage.getItem("token")


       axios.get( `${baseUrl}/backend/api/users/me/`, {
          headers: {
              'Authorization': `Bearer ${token}`
          }
      }).then((response) => {
          //console.log(response["data"])

           this.setState({
              ...this.state,
              seller_id: response["data"]["id"],
              fetched: false,
              seller_name: response["data"]["username"]
          })
           this.getChatList()

      })


  }

  getChatList = () => {
      const token = localStorage.getItem("token")
      const active_chats = this.state.active_chats


      axios.get(`${baseUrl}/backend/api/whatever/chats/${this.state.seller_id}`, {
              headers: {
                  'Authorization': `Bearer ${token}`
              }
          })
          .then((resp) => {
            //console.log(resp["data"])
                this.setState({
                  chats: resp["data"],
                  fetched: true
                })

          })

      let counter = 0

      for(let i = 0; i < this.state.chats.length; i++) {



          if(this.state.chats[i].active && !active_chats.includes(this.state.chats[i].id)) {

              active_chats.push(this.state.chats[i].id)

              counter = +1

              if("Notification" in window) {

                  new Notification("New Chat")

              }



          }
          if(this.state.chats[i].active === false && active_chats.includes(this.state.chats[i].id)) {

              active_chats.splice(active_chats.indexOf(this.state.chats[i].id), 1)

              counter = -1

          }


      }

      localStorage.setItem("newChats", counter.toString())

  }




  render() {


    return (
      <div className="login">
        <div className="form-operator">
            {Array.isArray(this.state.chats) && this.state.chats !== 0 ? this.state.chats.map(chat => {
                const date_published_new_format = new Date(`${chat.date_created}`).toLocaleDateString('en-gb', {year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'});
                return (
                    <button key={chat.id} onClick={() => this.setFormRoomName(chat.operator_id, chat.customer, chat.id, chat.room_name)}><div className={chat.active ? "livechat-container green" : "livechat-container" }>

                        <div className="live-chat-cell">
                            <span>{date_published_new_format}</span>
                            <p>{chat.customer}</p>

                        </div>

                    </div></button>

                )

            }): <p>no data</p>}


          {/* <input*/}
          {/*    type="text"*/}
          {/*    onChange={this.usernameChangeHandler}*/}
          {/*    placeholder="Enter your Email"*/}
          {/*    required />*/}
          {/*<input type="text" onChange={this.roomChangeHandler} placeholder="Enter Room"/>*/}

          {/* <div className="button-container">*/}
          {/*     <button className="submit" type="submit" value="Submit" onSubmit={this.setFormUsername()}>*/}
          {/*         Let's Chat*/}
          {/*     </button>*/}
          {/* </div>*/}

         </div>
      </div>
    );
  }
}

export default withRouter(InitFormOperator)
