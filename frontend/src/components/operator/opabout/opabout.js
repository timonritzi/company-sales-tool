import React, {useEffect, useState} from 'react';
import default_pb from "../../../assets/defaults/male-placeholder-image.jpeg";
import '../opabout/opabout.css';

import {useDispatch, useSelector} from "react-redux";
import axios from "axios";
import {userProfileAction} from "../../../store/actions/operator/userProfileAction";
import {ABOUT_USER} from "../../../store/constants/constants";
import edit from '../../../assets/svg/edit.svg'
import save from '../../../assets/svg/save.svg'
import baseUrl from "../../url";
import { useHistory } from 'react-router-dom';

export const OperatorAbout = () => {

    const token = localStorage.getItem("token")
    const url = `${baseUrl}/backend/api/users/me/`
    const history = useHistory()



    //Get User Data
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user)

        useEffect(() => {
            setTimeout(() => {
                const userData = async () => {
                        await dispatch(userProfileAction(ABOUT_USER))
                }
                userData()
            }, 100)
            if(!token) {
                history.push('/verkaufsteamlogin')
            }

        },[]);



    const logged_in_user = user.user;
    // console.log("LOGGED", logged_in_user)



    //STAGES
    const [editStage, setEditStage] = useState('default-stage')
    const [isfetched, setIsfetched] = useState(true)
    const [about, setAbout] = useState((logged_in_user !== null ? logged_in_user.about : ''))




    const handleSubmit = (event) => {
        let fd = new FormData();

        if (about !== undefined) {

            fd.append('about', about);
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

    const handleOnOffButton = (event) => {
        let fd = new FormData();

        if (logged_in_user.status === true) {
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
    const popUpChat = (event) => {
      window.open("https://live.auto-zuerisee.ch/chat/operator", 'LiveChat','toolbar=no,location=no, titlebar=no, fullscreen=yes, status=no,menubar=no,personalbar=no, height=700, width=600, resizable=yes, scrollbars=yes, status=0');

    }

    // console.log(about)
    return (

        <div className='op_about_root'>

            {logged_in_user !== null ?
            <div className='op_about_container'>

                <div className='op_left_container_ab'>


                            <div className='op_left_flex_div'>

                                <img className='op_avatar_me' src={logged_in_user.avatar ? logged_in_user.avatar : default_pb} alt=''/>
                                <p className='op_full_name_me'>{logged_in_user.first_name + " " + logged_in_user.last_name}</p>
                                <p className='op_postition_me'>{logged_in_user.position}</p>
                                <p className='op_location_me'>{logged_in_user.location}</p>
                                <p className='op_email_me'>{logged_in_user.email}</p>
                                <p className='op_phone_me'>{logged_in_user.phone}</p>

                            </div>


                </div>

                <div className='op_middle_container_ab'>

                    {editStage === 'default-stage' ?

                        <>
                            <p className='op_about_me'>Über mich <img src={edit} alt='' onClick={(event) => setEditStage('edit-stage')}/></p>
                            <p className='op_about_me_text'>{logged_in_user.about}</p>
                        </>

                    : null}

                    {editStage === 'edit-stage' ?
                        <>
                            <p className='op_about_me'>Über mich <img src={edit} alt='' onClick={(event) => setEditStage('default-stage')}/> <img src={save} alt='' onClick={handleSubmit} /> </p>
                            <textarea className='op_input_text' rows='10' columns='10' onChange={(event) => setAbout(event.target.value)} defaultValue={logged_in_user.about} />
                        </>
                    : null}

                </div>

                <div className="about-btn-container">
                    <button className="OnOffBtn" onClick={handleOnOffButton}>{logged_in_user.status ? "online" : "offline"}</button>
                </div>






            </div>
                : null}

            <div className="screensharing-btn">
                <a href="https://www.screenleap.com/" target="_blank"><button className="screensharing">Screensharing</button></a>
            </div>

            <div className="standalone-btn">
                <button className="standalone" onClick={(event) => {popUpChat(event)}}>Standalone Chat</button>
            </div>



        </div>

    )
}