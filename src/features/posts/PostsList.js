import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import { PostAuthor } from './PostAuthor';
import { TimeAgo } from './TimeAgo';
import { ReactionButtons } from './ReactionButtons';
import {
    fetchPosts,
    selectPostIds,
    selectPostById
} from './postsSlice';
import { Spinner } from '../../components/Spinner';

const PostExcerpt = ({ postId }) => {
    const post = useSelector(state => selectPostById(state, postId));
    return (
        <article className='post-excerpt'>
            <h3>{post.title}</h3>
            <div>
                <PostAuthor userId={post.user} />
                <TimeAgo timestamp={post.date} />
            </div>
            <p className='post-content'>{post.content.substring(0, 100)}</p>

            <ReactionButtons post={post} />
            <Link to={`/posts/${post.id}`} className='button muted-button'>
                View Post
            </Link>
        </article>
    );
}

export const PostsList = () => {
    const dispatch = useDispatch();
    // const posts = useSelector(selectAllPosts);

    const postStatus = useSelector(state => state.posts.status);
    const error = useSelector(state => state.posts.error);

    useEffect(() => {
        if (postStatus === 'idle') {
            dispatch(fetchPosts());
        }
    }, [postStatus, dispatch]);

    let content;
    const orderedPosts = useSelector(selectPostIds);

    if (postStatus === 'loading') {
        content = <Spinner text='Loading...' />
    } else if (postStatus === 'succeeded') {
        // Sort posts in reverse chronological order by datetime string
        content = orderedPosts.map(postId => (
            <PostExcerpt key={postId} postId={postId} />
        ));
    } else if (postStatus === 'failed') {
        content = <div>{error}</div>
    }

    return (
        <section className="posts-list">
            <h2>Posts</h2>
            {content}
        </section>
    );
}