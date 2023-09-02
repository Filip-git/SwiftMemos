import React, { useEffect, useState } from 'react';
import { auth, database } from '../firebase-config';
import { collection, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import LikeButton from '../functions/LikeButton';
import EditPost from '../functions/editPost';
import Comments from '../functions/Comments';
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";

export const Home = ({ isAuth }) => {
    const [postLists, setPostLists] = useState([]);
    const [editingPost, setEditingPost] = useState(null);
    const postsCollection = collection(database, "posts");
    const isAdmin = auth.currentUser?.email === "admin@swiftmemos.com";


    useEffect(() => {
        const unsubscribe = onSnapshot(postsCollection, (snapshot) => {
            const postsData = snapshot.docs.map((doc) => {
                const postData = doc.data();
                const isLiked = postData.likedUsers?.includes(auth.currentUser?.uid) || false;
                return { ...postData, id: doc.id, isLiked: isLiked };
            });
            setPostLists(postsData);
        });

        return () => {
            unsubscribe();
        };
    }, [auth.currentUser]);


    const deletePost = async (id) => {
        const postDoc = doc(database, "posts", id);
        await deleteDoc(postDoc);
    };


    const handleEdit = (postId) => {
        setEditingPost(postId);
    };

    const handleCancelEdit = () => {
        setEditingPost(null);
    };

    return (
        <div className='homePage'>
            {postLists.map((post) => {
                return (
                    <div className="post" key={post.id}>
                        <div className="postHeader">
                            <div className="title">
                                <h1> {post.title}</h1>
                            </div>


                            <div className="deletePost">

                                {isAuth && auth.currentUser && post.author.id === auth.currentUser.uid && (
                                    <button
                                        onClick={() => {
                                            setEditingPost(post.id); // Open the modal
                                        }}
                                    >
                                        <AiOutlineEdit></AiOutlineEdit>
                                    </button>
                                )}

                                {isAuth && (isAdmin || post.author.id === auth.currentUser.uid) && (
                                    <button onClick={() => deletePost(post.id)}>
                                        <AiOutlineDelete></AiOutlineDelete>
                                    </button>
                                )}


                            </div>
                        </div>

                        <div className="postTextContainer">{post.post}</div>
                        <h4>@{post.author.displayName || post.author.name || "Anonymous User"}</h4>
                        <hr />
                        <div className="text-center">
                            {post && <LikeButton post={post} user={auth.currentUser} />}

                        </div>

                        {/* Render EditPost component when editing */}
                        {editingPost === post.id && (
                            <EditPost postId={post.id} onCancel={handleCancelEdit} />
                        )} <hr></hr>

                        <Comments postId={post.id} comments={post.comments || []} isAuth={isAuth} isAdmin={isAdmin} />


                    </div>
                );
            })}

            {editingPost !== null && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <EditPost postId={editingPost} onCancel={() => setEditingPost(null)} />
                    </div>
                </div>
            )}
        </div>
    );
};