import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from "react-router-dom";
import "./login.css"
import baseUrl from "../url";
export const Login = (props) => {
    let history = useHistory();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();

    // const baseUrl = (value) => "https://live.auto-zuerisee.ch/" + value;
    const getLoginUrls = `${baseUrl}/backend/api/token`;
    //console.log("url", getLoginUrls);
    const loginHandler = async () => {
        const headers = new Headers({
            "Content-type": "application/json",
        })
        const body = JSON.stringify({ email: email.toLowerCase(), password: password });
        const config = {
            method: "POST",
            body: body,
            headers: headers,
        }
        const respone = await fetch(`${baseUrl}/backend/api/token/`, config)
        const responeParsed = await respone.json()
        const token = responeParsed;
        if (token.access) {
            //console.log(token)
            localStorage.setItem("token", token.access)
            history.push("/operator");
        }
    }


    const emailHandler = (e) => {
        setEmail(e.currentTarget.value)
    }

    const passwordHandler = (e) => {

        setPassword(e.currentTarget.value)
    }


    let onKeyPress = (e) => {
        if(e.which === 13) {
          loginHandler();
        }
      }

    return (

        <div className='login_root'>

            <main className="login-container">

                <div className="wrapper">

                    <div className="login">

                        <p>LOGIN</p>

                        <span>Archiv – Chats bis 25.5.2021 - Chat nicht mehr aktiv</span>

                    </div>

                    <div className="inputs">

                        <input className="username" placeholder="Email" onChange={emailHandler} />
                        <input type="password" className="password" placeholder="Password" onChange={passwordHandler} onKeyPress={onKeyPress}/>

                    </div>

                    <div className="btn-container">

                        <button type="submit" className="button" id="login" onClick={loginHandler}>Login</button>

                    </div>
                </div>

            </main>
        </div>

    )
}