import React, { useEffect, useState } from 'react'
import { StyleSheet, Alert, FlatList } from 'react-native';
import ImageLayout from '../image-layout';
import { firestore } from '../../config/config';
import { Colors, ListItem, Text, Avatar, AvatarHelper } from 'react-native-ui-lib'; //eslint-disable-line
import 'moment/locale/tr';
import { useRoute } from '@react-navigation/core';

const LikedUsers = () => {
    const [Loading, setLoading] = useState(true);
    const [Likes, setLikes] = useState([]);
    const params = useRoute().params.likedUsers;

    const getLikedUsers = async () => {
        setLoading(true);
        const snapshot = await firestore().collection('users').where(firestore.FieldPath.documentId(), 'in', params).get();

        if (!snapshot.empty) {
            const likedList = snapshot.docs.map(item => {
                return {
                    ...item.data(),
                    id: item.id
                }
            })
            setLikes(likedList);
            setLoading(false);
        } else {
            setLoading(false);
        }
    }

    useEffect(() => {
        getLikedUsers();
    }, [])

    const renderRow = (row, id) => {
        const userName = row.firstName + ' ' + row.lastName;
        const initials = AvatarHelper.getInitials(userName);

        return (
            <ListItem
                key={id}
                onPress={() => Alert.alert(`pressed on contact #${id + 1}`)}
            >
                <ListItem.Part left>
                    <Avatar
                        source={row.profile_picture ? { uri: row.profile_picture } : null}
                        label={initials}
                        containerStyle={{ margin: 18 }}
                    />
                </ListItem.Part>
                <ListItem.Part middle containerStyle={{
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    borderColor: Colors.grey10
                }}>
                    <Text color="yellow">{userName}</Text>
                </ListItem.Part>
            </ListItem>
        );
    }


    return (
        <ImageLayout
            title="Beğenenler"
            showBack
            Loading={Loading}
        >
            <FlatList
                data={Likes}
                renderItem={({ item, index }) => renderRow(item, index)}
                keyExtractor={(item, index) => index.toString()}
            />
        </ImageLayout>
    )
}

export default LikedUsers;