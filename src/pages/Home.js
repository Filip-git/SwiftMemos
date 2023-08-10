import React, { useEffect, useState } from 'react';
import { auth, database } from '../firebase-config';
import { collection, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import LikeButton from '../functions/LikeButton';
import EditPost from '../functions/editPost';

export const Home = ({ isAuth }) => {
    const [postLists, setPostLists] = useState([]);
    const [editingPost, setEditingPost] = useState(null);
    const postsCollection = collection(database, "posts");

    useEffect(() => {
        const unsubscribe = onSnapshot(postsCollection, (snapshot) => {
            const postsData = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
            setPostLists(postsData);
        });

        return () => {
            unsubscribe();
        };
    }, []);

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
                                    <button onClick={() => deletePost(post.id)}>
                                        &#128465;
                                    </button>
                                )}

                                {/* Render the edit button */}
                                {isAuth && auth.currentUser && post.author.id === auth.currentUser.uid && (
                                    <button
                                        onClick={() => {
                                            setEditingPost(post.id); // Open the modal
                                        }}
                                    >
                                        <i className="far fa-edit"></i>
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="postTextContainer">{post.post}</div>
                        <h3>@{post.author.displayName || post.author.name || "Anonymous User"}</h3>
                        <hr />
                        <div>
                            {post && <LikeButton post={post} />}
                        </div>

                        {/* Render EditPost component when editing */}
                        {editingPost === post.id && (
                            <EditPost postId={post.id} onCancel={handleCancelEdit} />
                        )}
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
