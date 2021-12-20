import React, { useEffect, useState, useRef } from 'react'
import { View, FlatList } from 'react-native';
import ImageLayout from '../image-layout';
import { firestore } from '../../config/config';
import { ListItem, Text } from 'react-native-ui-lib';
import { useRoute } from '@react-navigation/core';
import 'moment/locale/tr';
import { TextInput } from 'react-native-paper';

const PostComments = () => {
    const params = useRoute().params.comments;
    const inputRef = useRef(null);
    const [Loading, setLoading] = useState(false);
    const [UserComments, setUserComments] = useState([]);
    const [MyComment, setMyComment] = useState('');

    const getUsersComments = async () => {
        setLoading(true);

        Object.values(params).map(async (comment) => {
            try {
                const snapshot = await firestore().collection('users').where('username', '==', comment.user).get();
                const allComments = snapshot.docs.map(item => {
                    return {
                        profile_picture: item.data().profile_picture,
                        comment: comment.comment,
                        user: comment.user,
                        owner_email: item.data().email,
                        id: item.id
                    }
                })
                setUserComments(allComments);
            } catch (error) {
                console.log(error);
            }
        })
        setLoading(false);
    }

    useEffect(() => {
        getUsersComments();
    }, [])

    const renderRow = (row, id) => {
        return (
            <ListItem key={id}>
                <ListItem.Part left containerStyle={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', padding: 20 }} >
                    <Text color="white" style={{ fontWeight: '600', marginBottom: 3 }}>{row.user}</Text>
                    <Text color="white">{row.comment}</Text>
                </ListItem.Part>
            </ListItem>
        );
    }


    return (
        <ImageLayout
            title="Yorumlar"
            showBack
            Loading={Loading}
        >
            <FlatList
                data={UserComments}
                renderItem={({ item, index }) => renderRow(item, index)}
                keyExtractor={(item, index) => index.toString()}
                ListFooterComponent={() => (
                    <View style={{ paddingHorizontal: 20 }}>
                        <TextInput
                            ref={inputRef}
                            placeholderTextColor={'white'}
                            onChangeText={text => setMyComment(text)}
                            value={MyComment}
                            clearTextOnFocus={true}
                            clearButtonMode='always'
                            returnKeyType='done'
                            style={{ backgroundColor: 'none' }}
                            autoFocus={true}
                            placeholder="Yorumunuzu buraya yazın..."
                            multiline
                        />
                    </View>
                )}
            />
        </ImageLayout>
    )
}

export default PostComments;