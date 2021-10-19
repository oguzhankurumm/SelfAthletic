import React, { useState, useEffect } from 'react'
import { FlatList } from 'react-native';
import { firestore } from '../../../config/config';
import Post from '../../../components/post';
import ImageLayout from '../../../components/image-layout';

const FeedList = () => {
    const [Loading, setLoading] = useState(false);
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        firestore()
            .collectionGroup('posts')
            .orderBy('createdAt', 'desc')
            .onSnapshot(snapshot => {
                setPosts(snapshot.docs.map(post => ({ id: post.id, ...post.data() })))
            })
    }, [])


    return (
        <ImageLayout
            title="SelfAthletic Team"
            isScrollable={false}
            Loading={Loading}
            showAddPost
        >
            {!Loading &&
                <FlatList
                    bounces={false}
                    style={{ height: 'auto' }}
                    scrollEnabled={true}
                    data={posts.sort((a, b) => a.date - b.date)}
                    keyExtractor={(item, index) => index.toString()}
                    contentContainerStyle={{ paddingBottom: 80 }}
                    renderItem={(feed) => {
                        return (feed.item &&
                            <Post post={feed.item} />
                        )
                    }}
                />
            }
        </ImageLayout>
    )
}

export default FeedList;