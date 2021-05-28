import React from 'react';
import { Header } from '../components/header/header';
import { OperatorAbout } from '../components/operator/opabout/opabout';
import { OperatorPostCell } from '../components/operator/post/post';
import {CreatePost} from "../components/operator/create_post/create_post";


export const OperatorPage = () => {

    return (

        <>

        <div className='mainpage_container'>
            <OperatorAbout/>
            <CreatePost/>
            <OperatorPostCell/>
        </div>

        
        
        </>
    )
}