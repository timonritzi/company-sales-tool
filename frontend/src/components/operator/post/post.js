import React, {useEffect, useState} from 'react';
import { Carousel } from 'react-responsive-carousel';
import axios from 'axios';
import { useParams } from "react-router";
import Livechat from "../../../pages/livechat";
import edit from '../../../assets/svg/edit.svg'
import save from '../../../assets/svg/save.svg'
import loeschen from '../../../assets/svg/loeschen.svg'
import LivechatOperator from "../../../pages/livechatOperator";
import baseUrl from "../../url";

export const OperatorPostCell = () => {

    const [postsAllChron,setPostsAllChron] = useState([])
    const [currentStage,setCurrentStage] = useState(0)

    const token = localStorage.getItem("token");

    if (token == null) {
        window.location.href = "verkaufsteamlogin";
    }


    const getPosts = () => {

        // console.log('Fetching posts ' + new Date().getTime());
        // console.log(username)

        axios.get(`${baseUrl}/backend/api/posts/user/`, {

            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-type": "application/json",
            },

        })
            .then((response) => {
                // console.log(response)
                // setCounter(+1)
                setPostsAllChron(response['data'])
                // console.log("101",postsAllChron)
            })
            .catch((error) => {
                console.log(error)
            })
    }
    const deletePost = (id) => {
        axios.delete(`${baseUrl}/backend/api/posts/${id}`,)
            .then((response) => {
                // console.log(response, "deleted")
                // setCurrentStage(-1)
            })
            .catch((error) => {
                console.log(error)
            })
          setTimeout(() => {window.location.reload();}, 1000);


    }



    useEffect(() => {

        // console.log(token)

        if(token){
            setCurrentStage(+1)

            getPosts()

        }

    }, [currentStage])

    // console.log('oke');
    // console.log(postsAllChron);


    return (

    <div className='post_root'>

        <LivechatOperator/>

                {Array.isArray(postsAllChron) ? postsAllChron.map(post => {
                    const date_published_new_format = new Date(`${post.date_published}`).toLocaleDateString('en-gb', {year: 'numeric', month: 'long', day: 'numeric'});
                    return (

                        <div className='post_cell_container' id={post.id}>

                            <div className='post_content_container'>

                                <div className='post_content'>
                                    <div className="edit-delete">
                                        <img onClick={() => deletePost(post.id)} src={loeschen}/>
                                    </div>
                                    <p className='post_date_published'>{date_published_new_format}</p>
                                    <p className='post_title'>{post.post_title}</p>
                                    <hr></hr>
                                    <p className='post_text'>{post.post_content}</p>

                                    <Carousel autoPlay>

                                        { post.fk_post_image ? post.fk_post_image.map(image => {

                                            return(

                                                <div>
                                                    <img alt="" src={image.images}/>
                                                </div>
                                            )
                                        }): null}
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

                        }): <div></div>}


        </div>


    )
}