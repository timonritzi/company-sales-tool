import React, {useState} from 'react';

import "./createpost.css"
import axios from "axios";
import baseUrl from "../../url";

export const CreatePost = () => {

    const token = localStorage.getItem("token")
    const url = `${baseUrl}/backend/api/posts/create/`

    const [post_title, setpost_title] = useState(null)
    const [post_content, setpost_content] = useState(null)
    const [images, setimages] = useState([])

    const handleImage = (event) => {
        //console.log(event.target.files)
        setimages((prevState) => {
            /*let temp = images;
            console.log(temp);*/

            for (const [fileKey, file] of Object.entries(event.target.files)) {

                prevState.push(file);
            }

            //console.log(prevState);

            // temp.push(...event.target.files)
            return prevState;
        })
    }

    const handleSubmit = (event) => {


        let fd = new FormData();

        if (post_title !== undefined) {

            fd.append('post_title', post_title);
        }
        if (post_content !== undefined) {

            fd.append('post_content', post_content);
        }
        if (images !== undefined) {

            //console.log(images);

            for (const img of images) {

                fd.append('images', img);
            }
        }

        //console.log(fd)

        axios(
            {
                method: "post",
                data: fd,
                url: url,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'content-type': 'multipart/form-data'
                }
            })
            .then((response) => {
            })
            .catch((error) => {
                if (error.response) {
                    console.log(error.response.data);
                    console.log(error.response.status);
                    console.log(error.response.headers);}
            });

      setTimeout(() => {window.location.reload();}, 3000);

    }


    return (

    <div className='create_post_root'>

        <div className='create_post_wrapper'>

            <div className='title_creating_post'>

                <p className='create_post'>Beitrag Erstellen</p>
            </div>

            <div className='input_title_container'>

                <label>Beitrags Titel</label>
               <textarea className='input_title' rows='2' columns='10' onChange={(event) => setpost_title(event.target.value)} />

            </div>

            <div className='input_text_container'>

            <label>Beitrags Text</label>
            <textarea className='input_text' rows='2' columns='10' onChange={(event) => setpost_content(event.target.value)}/>

            </div>

            <div className='image_and_post_btn_container'>

                <div className='input_images_container'>

                <input  hidden className='input_images' id="actual-btn" type="file" accept='image/*' name='file' onChange={(event) => handleImage(event)} multiple />
                <label htmlFor="actual-btn">Bilder Hochladen</label>

                </div>

                <div className='submit_post'>

                <input hidden className='input_submit_post' id="submit-btn" type="submit" onClick={() => handleSubmit()}/>
                <label htmlFor="submit-btn">Beitrag Veröffentlichen</label>

                </div>
            </div>

        </div>

    </div>

    )
}