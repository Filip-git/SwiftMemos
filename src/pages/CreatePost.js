import { addDoc, collection } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { auth, database } from "../firebase-config"
import { useNavigate } from 'react-router-dom'

export const CreatePost = ({ isAuth }) => {

    const [title, setTitle] = useState('')
    const [post, setPost] = useState('')

    const postsColletion = collection(database, "posts")

    let navigate = useNavigate();
    const createPost = async () => {
        await addDoc(postsColletion, { title, post, author: { name: auth.currentUser.displayName, id: auth.currentUser.uid } });
        navigate('/')
    };

    useEffect(() => {
        if (!isAuth) {
            navigate("/login");
        }
    }, [isAuth, navigate]);


    return (
        <div className='createPostPage'>
            {" "}
            <div className='cpContainer'>
                <h1>Create a post</h1>
                <div className='inputGp'> <label>Title:</label>
                    <input placeholder='Title...' onChange={(e) => { setTitle(e.target.value); }} /></div>
                <div className='inputGp'>
                    <label>Post:</label>
                    <textarea placeholder='Text...' onChange={(e) => { setPost(e.target.value); }} /> </div>
                <button onClick={createPost}>Submit post</button>
            </div>
        </div>
    )
}
