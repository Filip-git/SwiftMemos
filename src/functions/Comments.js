import React, { useState, useEffect, useRef } from 'react';
import { updateDoc, doc } from 'firebase/firestore';
import { database, auth } from '../firebase-config';
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";

const Comments = ({ postId, comments, isAuth, isAdmin }) => {
    const user = auth.currentUser;
    const [newComment, setNewComment] = useState('');
    const commentsContainerRef = useRef(null);
    const [editingCommentIndex, setEditingCommentIndex] = useState(); // Define 'editingCommentIndex' state
    const [editedCommentContent, setEditedCommentContent] = useState(''); // Define 'editedCommentContent' state

    useEffect(() => {
        if (commentsContainerRef.current) {
            commentsContainerRef.current.scrollTop = commentsContainerRef.current.scrollHeight;
        }
    }, [comments]);

    const addComment = async () => {
        if (user) {
            if (!newComment.trim()) {
                alert("Comment cannot be empty.");
                return;
            }

            const postRef = doc(database, 'posts', postId);

            try {
                await updateDoc(postRef, {
                    comments: [...comments, { userId: user.uid, content: newComment, createdAt: new Date(), author: { name: auth.currentUser.displayName, id: auth.currentUser.uid } }],
                });

                setNewComment('');
            } catch (error) {
                console.error('Error adding comment:', error);
            }
        }
    };


    const editComment = async (commentIndex) => {
        setEditingCommentIndex(commentIndex);
        setEditedCommentContent(comments[commentIndex].content);
    };

    const saveEditedComment = async (commentIndex) => {
        if (user) {
            try {
                const updatedComments = [...comments];
                updatedComments[commentIndex].content = editedCommentContent;

                const postRef = doc(database, 'posts', postId);

                await updateDoc(postRef, {
                    comments: updatedComments,
                });

                setEditingCommentIndex(null);
            } catch (error) {
                console.error('Error editing comment:', error);
            }
        }
    };

    const deleteComment = async (commentIndex) => {
        if (user) {
            try {
                const updatedComments = comments.filter((_, index) => index !== commentIndex);

                const postRef = doc(database, 'posts', postId);

                await updateDoc(postRef, {
                    comments: updatedComments,
                });
            } catch (error) {
                console.error('Error deleting comment:', error);
            }
        }
    };

    const renderDeleteButton = (commentIndex) => {
        if (isAdmin) {
            return (
                <AiOutlineDelete
                    onClick={() => deleteComment(commentIndex)}
                    style={{
                        fontSize: '18px',
                        margin: '10px',
                        cursor: 'pointer',
                        color: 'red',
                    }}
                />
            );
        }
        return null;
    };


    return (
        <div>

            <div ref={commentsContainerRef} className="comments-container" style={{ maxHeight: '220px', overflowY: 'auto' }}>

                {comments.map((comment, index) => (
                    <div key={index} className="comment-container">
                        <p
                            style={{
                                fontStyle: 'italic',
                                fontSize: '15px'
                            }}
                        >@{(comment.author?.displayName ?? comment.author?.name) || "Anonymous User"}</p>

                        {editingCommentIndex === index ? (
                            <input
                                type="text"
                                value={editedCommentContent}
                                onChange={(e) => setEditedCommentContent(e.target.value)}
                            />
                        ) : (
                            <p>{comment.content}                            {renderDeleteButton(index)}
                            </p>
                        )}
                        {user && user.uid === comment.userId && (
                            <div className="space-x-4">
                                {editingCommentIndex === index ? (
                                    <button
                                        style={{
                                            height: '35px',
                                            borderRadius: '5px',
                                            fontSize: '18px',
                                            margin: '10px',
                                        }}
                                        onClick={() => saveEditedComment(index)}
                                    >
                                        Save
                                    </button>
                                ) : (
                                    <AiOutlineEdit
                                        onClick={() => editComment(index)}
                                        style={{
                                            fontSize: '18px',
                                            margin: '10px',
                                            cursor: 'pointer',
                                            color: 'blue',
                                        }}
                                    />
                                )}
                                <AiOutlineDelete
                                    onClick={() => deleteComment(index)}
                                    style={{
                                        fontSize: '18px',
                                        margin: '10px',
                                        cursor: 'pointer',
                                        color: 'red',
                                    }}
                                />
                            </div>
                        )}
                    </div>

                ))}

                {isAuth ? (

                    <div className='flex items-center '>
                        <input
                            className='flex-1 p-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500'
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Add a comment..."
                        />
                        <button
                            className='commentButton'
                            onClick={addComment}
                            style={{
                                height: '35px',
                                borderRadius: '5px',
                                fontSize: '18px',
                                margin: '10px',
                            }}
                        >
                            Add Comment
                        </button>
                    </div>) : null}

            </div>
        </div>

    );
};

export default Comments;
