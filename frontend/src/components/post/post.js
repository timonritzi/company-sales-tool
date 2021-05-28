import React, {useEffect, useState} from 'react';
import { Carousel } from 'react-responsive-carousel';
import axios from 'axios';
import '../post/post.css';
import { useParams } from "react-router";
import chat from "../../assets/svg/chat.svg";
import cancel from "../../assets/svg/cancel.svg";

import Livechat from "../../pages/livechat";

export const PostCell = () => {

    const [postsAllChron,setPostsAllChron] = useState(null)
    const [currentStage,setCurrentStage] = useState(0)
    const [pop_up, setpop_up] = useState(false)
    const { username } = useParams()

    let screen_width = window.screen.width



    const getPosts = () => {

        // console.log('Fetching posts ' + new Date().getTime());
        // console.log(username)

        axios.get(`https://live.auto-zuerisee.ch/backend/api/posts/user/${username}/`, {})
            .then((response) => {
                // console.log(response)
                // setCounter(+1)
                setPostsAllChron(response['data'])
            })
            .catch((error) => {
                console.log(error)
            })
    }



    useEffect(() => {

        if(username){
            setCurrentStage(+1)
            getPosts()
        }

    }, [])

    // console.log('pop_up');
    //console.log(pop_up);
    return (
    <div className='post_root'>

                        {pop_up === true  ? <Livechat/> : null}
                        {pop_up === false && screen_width > 1024  ? <Livechat/> : null}
                        {pop_up === false ? <img className='chat-popup' src={chat} onClick={() => setpop_up(true)} alt='Chat'/> : null}
                        {pop_up === true ? <img className='chat-popup-cancel' src={cancel} onClick={() => setpop_up(false)} alt='Chat'/> : null}

                {postsAllChron !== null ? postsAllChron.map(post => {

                    const date_published_new_format = new Date(`${post.date_published}`).toLocaleDateString('en-gb', {year: 'numeric', month: 'long', day: 'numeric'});
                    return (

                        <div className='post_cell_container' key={post.id}>

                            <div className='post_content_container'>

                                <div className='post_content'>
                                    <p className='post_date_published'>{date_published_new_format}</p>
                                    <p className='post_title'>{post.post_title}</p>
                                    <hr></hr>
                                    <p className='post_text'>{post.post_content}</p>

                                    <Carousel autoPlay>

                                        {post.fk_post_image.map(image => {

                                            return(

                                                <div>
                                                    <img alt="" src={image.images}/>
                                                </div>
                                            )
                                        })}
                                    </Carousel>

                                { post.og_title !== null ?

                                    <div className='link_preview'>

                                        <a target="_blank" rel="noopener noreferrer" href={post.og_url}> <img className='og_image_url' src={post.og_image} alt='' loading='lazy' /> </a>
                                        <a target="_blank" rel="noopener noreferrer" href={post.og_url}> <p className='og_title'>{post.og_title}</p> </a>
                                        <p className='og_description'>{post.og_description}</p>

                                    </div>

                                : null}


                                </div>


                            </div>

                        </div>

                        )

                        }): null}


        </div>


    )
}