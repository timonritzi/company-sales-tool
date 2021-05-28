import React, { Component } from 'react';
import WebSocketInstance from "../../services/websocket";
import "./form.scss"
import { withRouter } from "react-router-dom";
import axios from 'axios';
import green from "../../images/1920x1080-yellow-green-solid-color-background.jpg";
import red from "../../images/Lead-Gray-600x600.jpg"
import baseUrl from "../url";



class InitForm extends Component {

  constructor(props) {
      super(props);
      this.state = {
          value: '',
          modulo: false,
          seller: [],
          fetched: false,
          roomName: "",
          username: ""
      };
  }

  componentDidMount() {
      setTimeout(() => {
          this.isSellerOnline()
      },100)

  }

  usernameChangeHandler = (event) =>  {
    this.setState({
      username: event.target.value
    })
    const tmp_customer = event.target.value.replace(/[^0-9a-z]/gi, '')
    const room_name = this.state.seller["id"] + "_" + tmp_customer
    this.setState({
        roomName: room_name
    })
    // }

  }

  roomChangeHandler = (event) => {
      this.setState({
          room: event.target.value
      })
  }
  setFormUsername = () => {

      WebSocketInstance.setUsername(this.state.username, this.state.seller["id"])
      // WebSocketInstance.setRoomname(this.state.room)



  }
  moduloHandler = () => {
      this.setState({
          modulo: true
      })
      this.isSellerOnline()
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

    return (

            <div className={"chat-container"}>

                <div className="login">
                    <div className="form-seller">
                        {/*{this.state.fetched ?*/}
                        {(this.state.fetched) ?
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

                        <div className="input-button">
                            <form onSubmit={(event) => this.props.onSubmit(this.state.username, this.state.roomName, this.state.seller["id"], event)} className="form">
                                <label htmlFor="email-input">Ihre Email</label>
                                <input
                                  type="email"
                                  id="email-input"
                                  onChange={this.usernameChangeHandler}
                                  placeholder="max.muster@..."
                                  required />

                              {/*{localStorage.length !== 0 ? <input type="text" onChange={this.roomChangeHandler} placeholder="Enter Room"/> : null}*/}

                               <div className="button-container">
                                  <button className="submit" type="submit" value="Submit" onSubmit={this.setFormUsername()}>
                                   Zum Chat
                                  </button>
                               </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
    );
  }
}

export default withRouter(InitForm)
