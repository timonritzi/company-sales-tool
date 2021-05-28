import React, {useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import default_pb from "../../assets/defaults/male-placeholder-image.jpeg";
import { getUserAction } from "../../store/actions/userAction";
import './about.css'
import { useParams } from "react-router";
import Livechat from "../../pages/livechat";
import logoAutoG from "../../assets/logo/Auto_Graf_Neues_Logo-kombi-bmw-mini.png"
import logoAutoS from "../../assets/logo/logoAutoSteiner_test.svg"



export const About = () => {
    // const url = (value) => ("https://live.auto-zuerisee.ch/backend/api/users/" + value)
    const { users } = useSelector((state) => state.users)
    const dispatch = useDispatch();
    const { username } = useParams()

    const [CurrentStage, setCurrentStage] = useState(0)

    // console.log(username)


    useEffect(() => {
        dispatch(getUserAction( {
           username: username
        }))
        if (username) {
            setCurrentStage(+1)

        }




    }, [CurrentStage, username])
    // console.log("about component", users)

    // console.log(users)



    let garage = ""
    if(users.autohaus == "AutoGraf-BMW" || users.autohause == "AutoGraf-MINI") {
        garage = "Auto-Graf"
    }
    else {
        garage = "Auto-Steiner"
    }
    document.title = users.first_name + " " + users.last_name + ' - ' + garage;

    let logo = ""
    if(users.autohaus === "AutoGraf-BMW") {
        logo = <a href="https://dealer.bmw.ch/autograf/de" className="link-about-logo" target="_blank"><img className="logo" src={logoAutoG}/></a>
    }
    if(users.autohaus === "AutoGraf-MINI") {
        logo = <a href="https://autograf.mini.ch/de" className="link-about-logo" target="_blank"><img className="logo" src={logoAutoG}/></a>
    }
    if(users.autohaus === "AutoSteiner"){
        logo = <a href="https://auto-steiner-ag.ch" className="link-about-logo" target="_blank"><img className="logo steiner" src={logoAutoS}/></a>
    }



    return (


        <>



            <div className='about_root'>

                {logo}

                <div className='about_container'>

                <div className='profile_picture_about'>

                    <img className='avatar_me' src={users.avatar ? users.avatar : default_pb} alt=''/>

                </div>

                    <div className='left_container_ab'>
                        {users.length !== 0 ?

                                <div className='left_flex_div'>

                                    <p className='full_name_me'>{users.first_name + " " + users.last_name}</p>
                                    <p className='postition_me'>{users.position}</p>
                                    <p className='location_me'>Meilen, Zürich</p>
                                    <p className='email_me'>{users.email}</p>
                                    <p className='phone_me'>{users.phone}</p>

                                </div>

                         : null}
                    </div>

                    <div className='middle_container_ab'>

                        <p className='about_me'>Über mich</p>
                        <p className='about_me_text'>{users.about}</p>



                    </div>

                </div>

            </div>

        </>
    )
}