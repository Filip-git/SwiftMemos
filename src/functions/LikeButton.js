import React, { useState } from 'react';
import { updateDoc, doc } from 'firebase/firestore';
import { database } from '../firebase-config';
import { auth } from '../firebase-config';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';

const LikeButton = ({ post }) => {
    const user = auth.currentUser; // Use auth.currentUser directly
    const likedUsers = post.likedUsers || [];
    const [isLiked, setIsLiked] = useState(post.isLiked || false);

    const handleLike = async () => {
        if (user) {
            const postRef = doc(database, 'posts', post.id);

            if (!likedUsers.includes(user.uid)) {
                const newLikedUsers = [...likedUsers, user.uid];

                try {
                    await updateDoc(postRef, {
                        likedUsers: newLikedUsers
                    });

                    setIsLiked(true);
                } catch (error) {
                    console.error('Error updating liked users:', error);
                }
            }
        }
    };

    const handleUnlike = async () => {
        if (user) {
            const postRef = doc(database, 'posts', post.id);

            if (likedUsers.includes(user.uid)) {
                const newLikedUsers = likedUsers.filter(userId => userId !== user.uid);

                try {
                    await updateDoc(postRef, {
                        likedUsers: newLikedUsers
                    });

                    setIsLiked(false);
                } catch (error) {
                    console.error('Error updating liked users:', error);
                }
            }
        }
    };

    return (
        <div>
            {isLiked ? (
                <span onClick={handleUnlike}>
                    <AiFillHeart />
                </span>
            ) : (
                <span onClick={handleLike}>
                    <AiOutlineHeart />
                </span>
            )}
            <div></div>
            <span>{likedUsers.length} Likes </span>
        </div>
    );
};

export default LikeButton;
