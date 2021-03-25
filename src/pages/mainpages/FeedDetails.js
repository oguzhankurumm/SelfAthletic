import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, StatusBar, Image, SafeAreaView, TouchableOpacity, ImageBackground, Dimensions, FlatList } from 'react-native';
import { database2, auth2 } from '../../config/config';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SpinnerLoading from '../../components/SpinnerLoading';
import moment from 'moment';
import 'moment/locale/tr';
moment.locale('tr');

const { height, width } = Dimensions.get("window");

const FeedDetails = props => {

    const [Loading, setLoading] = useState(false);
    const [Comments, setComments] = useState(props.route.params.item.comments !== undefined ? Object.values(props.route.params.item.comments) : [])
    const [Likes, setLikes] = useState(props.route.params.item.likes !== undefined ? Object.values(props.route.params.item.likes) : [])
    const [isLiked, setisLiked] = useState(false);

    const getComments = () => {
        let commentList = [];
        if (Comments.length !== 0) {
            Comments.forEach((cm) => {
                database2.ref('users').child(cm.ownerid).once('value')
                    .then((res) => {
                        if (Likes.length > 0) {
                            Object.values(Likes).forEach((like) => {
                                if (like === auth2.currentUser.uid) {
                                    setisLiked(true)
                                } else {
                                    setisLiked(false);
                                }
                            })
                        }
                        commentList.push({
                            name: res.val().name,
                            avatar: res.val().avatar,
                            likeCount: Likes.length,
                            date: cm.date,
                            comment: cm.comment
                        })
                        setComments(commentList);
                        setLoading(false);
                    })
                    .catch((err) => {
                        console.log('feed comment error: ', err);
                        setLoading(false);
                    })
            })
        } else {
            setLoading(false);
        }
    }

    const removeLike = () => {

    }

    const addLike = id => {
        console.log('post: ', id)
        // database2.ref('feed').child()
    }


    useEffect(() => {
        getComments();
    }, [])

    return (
        <ImageBackground style={{ height: height, width: width }} resizeMode="cover" source={require('../../img/bg.jpg')}>
            <StatusBar barStyle="light-content" />

            <SafeAreaView style={styles.container}>
                <SpinnerLoading Loading={Loading} />


                <View style={styles.header} >
                    <TouchableOpacity onPress={() => props.navigation.goBack()} style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                        <Icon name="keyboard-arrow-left" color="#FFF" size={42} style={{ marginRight: 15 }} />
                        <Text style={styles.headerText}>Yorumlar</Text>
                    </TouchableOpacity>
                </View>

                {!Loading && Comments.length >= 1 &&
                    <FlatList style={{ paddingHorizontal: 20, width: '100%' }}
                        scrollEnabled={true}
                        data={Comments}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={(comment) => {
                            return (comment.item && !Loading &&
                                <View style={{
                                    justifyContent: 'center',
                                    padding: 10,
                                    height: 'auto',
                                    width: '100%',
                                    marginTop: 20
                                }}>
                                    <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                        <Image source={{ uri: comment.item.avatar }} style={styles.avatar} resizeMode="cover" />
                                        <Text style={styles.nameText}>{comment.item.name}</Text>
                                    </View>
                                    <View style={{ marginTop: 10, width: '100%', backgroundColor: 'rgba(0,0,0,0.3)', padding: 10, borderRadius: 8 }}>
                                        <Text style={styles.commentText}>{comment.item.comment}</Text>

                                        <View style={{ marginTop: 15, flexDirection: 'row', width: '100%', justifyContent: 'flex-start', alignItems: 'center' }}>
                                            <Text numberOfLines={1} style={styles.commentButtonText}>{comment.item.date !== '' && comment.item.date !== null ? moment(comment.item.date, "DD/MM/YYYYTHH:mm:ss").fromNow() : ''}</Text>
                                            <Text numberOfLines={1} style={[styles.commentButtonText, { marginLeft: 10 }]}>{String(comment.item.likeCount)} beğenme</Text>
                                            <TouchableOpacity onPress={() => alert('yanıtla')}>
                                                <Text numberOfLines={1} style={[styles.commentButtonText, { marginLeft: 10 }]}>Yanıtla</Text>
                                            </TouchableOpacity>
                                        </View>

                                        <TouchableOpacity onPress={() => isLiked ? removeLike(comment.item.id) : addLike(comment.item.id)} style={{ position: 'absolute', right: 10, top: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>
                                            <Icon name={isLiked ? "favorite" : "favorite-outline"} size={20} color='white' />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )
                        }}
                    />
                }
            </SafeAreaView>

        </ImageBackground >
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        width: '100%',
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20
    },
    headerText: {
        fontFamily: 'SFProDisplay-Medium',
        fontSize: 18,
        color: '#FFF'
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 50
    },
    nameText: {
        marginLeft: 10,
        fontFamily: 'SFProDisplay-Bold',
        fontSize: 15,
        color: 'white'
    },
    commentText: {
        fontFamily: 'SFProDisplay-Medium',
        fontSize: 15,
        color: '#FFF'
    },
    commentButtonText: {
        fontFamily: 'SFProDisplay-Medium',
        fontSize: 12,
        color: '#D1D1D1'
    }
})

export default FeedDetails;