import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { database } from '../firebase-config';

const EditPost = ({ postId, onCancel }) => {
    const [post, setPost] = useState({ title: '', post: '' });

    useEffect(() => {
        const fetchPost = async () => {
            const postDocRef = doc(database, 'posts', postId);
            const postDoc = await getDoc(postDocRef);
            if (postDoc.exists()) {
                setPost(postDoc.data());
            }
        };

        fetchPost();
    }, [postId]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setPost((prevPost) => ({
            ...prevPost,
            [name]: value,
        }));
    };

    const handleSave = async () => {
        const postDocRef = doc(database, 'posts', postId);
        await updateDoc(postDocRef, {
            title: post.title,
            post: post.post,
        });
        onCancel();
    };

    return (
        <div>
            <div className='createPostPage'>
                <div className='cpContainer'>
                    <h1>Edit a post</h1>
                    <div className='inputGp'>
                        <label>Title:</label>
                        <input
                            type='text'
                            name='title'
                            placeholder='Title...'
                            value={post.title}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className='inputGp'>
                        <label>Post:</label>
                        <textarea
                            type='text'
                            name='post'
                            placeholder={'Edited text...'}
                            value={post.post}
                            onChange={handleInputChange}
                        />

                    </div>
                    <button onClick={handleSave}>Save</button>
                    <button onClick={onCancel}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default EditPost;