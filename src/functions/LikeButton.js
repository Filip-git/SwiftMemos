import React, { useState } from 'react';
import { updateDoc, doc } from 'firebase/firestore';
import { database } from '../firebase-config';
import { auth } from '../firebase-config';

const LikeButton = ({ post }) => {
    const user = auth.currentUser;
    const likedUsers = post.likedUsers || [];
    const [isLiked, setIsLiked] = useState(false);

    const handleLike = async () => {
        if (user) {
            const postRef = doc(database, 'posts', post.id);

            // Check if the user has already liked the post
            if (!likedUsers.includes(user.uid)) {
                const newLikedUsers = [...likedUsers, user.uid];

                try {
                    await updateDoc(postRef, {
                        likedUsers: newLikedUsers
                    });

                    setIsLiked(true);
                } catch (error) {
                    console.error("Error updating liked users:", error);
                }
            }
        }
    };

    const handleUnlike = async () => {
        if (user) {
            const postRef = doc(database, 'posts', post.id);

            // Check if the user has liked the post
            if (likedUsers.includes(user.uid)) {
                const newLikedUsers = likedUsers.filter(userId => userId !== user.uid);

                try {
                    await updateDoc(postRef, {
                        likedUsers: newLikedUsers
                    });

                    setIsLiked(false);
                } catch (error) {
                    console.error("Error updating liked users:", error);
                }
            }
        }
    };

    return (
        <div>
            {isLiked ? (
                <span i className="fa fa-heart" onClick={handleUnlike}>

                </span>
            ) : (
                <span onClick={handleLike}>
                    &#x2661;
                </span>
            )}
            <div></div><span>{likedUsers.length} Likes </span>
        </div>
    );
};

export default LikeButton;
