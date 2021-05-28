import React from 'react';
import { About } from '../components/about/about';
import { PostCell } from '../components/post/post';


export const MainPage = () => {

    return (

        <>

        <div className='mainpage_container'>
            <About/>
            <PostCell/>
        </div>

        
        
        </>
    )
}