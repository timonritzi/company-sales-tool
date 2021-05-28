import React from 'react';
import logo from '../../assets/logo/Logo_Auto_Graf_AG.jpg'

import '../header/header.css'

import twitter from "../../assets/svg/twitter.svg"
import facebook from "../../assets/svg/facebook.svg"
import instagram from "../../assets/svg/instagram.svg"
import linkedin from "../../assets/svg/linkedin.svg"
import youtube from "../../assets/svg/youtube.svg"

export const Header = () => {

    return (

        <div className='header'>
            <img classname='logo' src={logo} alt=''/>
            <a href='/login'>Login</a>
            <a href='/'>Verkaufsteam</a>

            <div className='svgs'>
                <a href='https://twitter.com/autografmeilen' ><img src={twitter} alt=''/></a>
                <a href='https://www.facebook.com/autografmeilen/' ><img src={facebook} alt=''/></a>
                <a href='https://www.youtube.com/channel/UCMSCY2WDWNjBXlO9_RZ005A' ><img src={instagram} alt=''/></a>
                <a href='https://www.linkedin.com/company/auto-graf-meilen/' ><img src={linkedin} alt=''/></a>
                <a href='https://www.instagram.com/autografmeilen/' ><img src={youtube} alt=''/></a>
            </div>

        </div>
    )
}