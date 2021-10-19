import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, StatusBar, Image, SafeAreaView, TouchableOpacity, ImageBackground, Dimensions, FlatList, Alert, Pressable } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { database, auth } from '../../config/config';
import { Textarea } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SpinnerLoading from '../../components/SpinnerLoading';
import moment from 'moment';
import 'moment/locale/tr';
moment.locale('tr');
import { useSelector } from 'react-redux';

const { height, width } = Dimensions.get("window");

const FeedDetails = props => {
    const [Loading, setLoading] = useState(false);
    const [SaveLoading, setSaveLoading] = useState(false);
    const [Comments, setComments] = useState(props.route.params.item.comments !== undefined ? Object.values(props.route.params.item.comments) : [])
    const [Likes, setLikes] = useState(props.route.params.item.likes !== undefined ? Object.values(props.route.params.item.likes) : [])
    const [isLiked, setisLiked] = useState(false);
    const [MyComment, setMyComment] = useState("");
    const profileData = useSelector(state => state.user.users);

    const getComments = async () => {
        let commentList = [];
        if (Comments.length !== 0) {
            Comments.forEach(async (cm) => {
                // console.log('cm: ', cm)
                await database().ref('users').child(cm.ownerId).once('value')
                    .then((res) => {
                        if (Likes.length > 0) {
                            Object.values(Likes).forEach((like) => {
                                if (like === auth().currentUser.uid) {
                                    setisLiked(true)
                                } else {
                                    setisLiked(false);
                                }
                            })
                        }
                        commentList.push({
                            name: res.val().name,
                            avatar: res.val().profile_picture,
                            userId: cm.ownerId,
                            likeCount: Likes.length,
                            likeList: Likes,
                            date: cm.date,
                            comment: cm.comment
                        })
                        setComments(commentList);
                        setLoading(false);
                    })
                    .catch((err) => {
                        setLoading(false);
                    })
            })
        } else {
            setLoading(false);
        }
    }

    const sendComment = async () => {

        let postId = props.route.params.item.postId;
        let myObj = {
            comment: MyComment,
            name: profileData.name,
            avatar: profileData.profile_picture,
            ownerId: profileData.userId,
            date: moment().format("DD/MM/YYYYTHH:mm:ss"),
        }

        if (MyComment !== "") {
            setSaveLoading(true);
            await database().ref(`feed/${postId}/comments`).push(myObj)
                .then(() => {
                    let cArr = [];
                    cArr = Comments;
                    cArr.unshift(myObj);
                    setComments(cArr)
                    setMyComment("")
                    setSaveLoading(false);
                })
                .catch((err) => {
                    setSaveLoading(false);
                    setTimeout(() => {
                        Alert.alert('Hata', String(err));
                    }, 200);
                })
        } else {
            Alert.alert('Hata', 'Yorum boş olamaz.')
        }


    }


    useEffect(() => {
        getComments();
    }, [])

    return (
        <ImageBackground style={{ height: height, width: width }} resizeMode="cover" source={require('../../img/bg.jpg')}>
            <StatusBar barStyle="light-content" />

            <KeyboardAwareScrollView bounces={false} style={styles.container}>

                <SafeAreaView style={styles.container}>
                    <SpinnerLoading Loading={Loading} />
                    <SpinnerLoading Loading={SaveLoading} />

                    <View style={styles.header} >
                        <TouchableOpacity onPress={() => props.navigation.goBack()} style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                            <Icon name="keyboard-arrow-left" color="#FFF" size={42} style={{ marginRight: 15 }} />
                            <Text style={styles.headerText}>Yorumlar</Text>
                        </TouchableOpacity>
                    </View>

                    {!Loading &&
                        <FlatList style={{ height: '100%', padding: 15, width: '100%' }}
                            scrollEnabled={true}
                            ListHeaderComponent={() => {
                                return (
                                    <>
                                        <View style={{ width: '100%' }}>
                                            {props.route.params.item.type === 'text' ?
                                                <View style={{ width: '100%', padding: 20, backgroundColor: '#202026', height: 150, borderRadius: 18 }}>
                                                    <Text style={{
                                                        fontFamily: 'SFProDisplay-Bold',
                                                        fontSize: 16,
                                                        color: '#FFF',
                                                        marginBottom: 8
                                                    }}>{props.route.params.item.title}</Text>
                                                </View>
                                                :
                                                <View style={{ width: '100%', height: 200, borderRadius: 18 }}>
                                                    <Image style={{ width: '100%', height: 200, borderRadius: 18 }} resizeMode="cover" source={{ uri: props.route.params.item.image }} />
                                                </View>
                                            }
                                        </View>
                                        <Pressable onPress={() => Object.values(Likes).length !== 0 ? props.navigation.navigate('LikedList', { users: Object.values(Likes) }) : Alert.alert('Hata', 'Hiç Beğeni Yok.')} style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, marginTop: 20 }}>
                                            <Icon name="favorite" size={20} color='white' />
                                            <Text style={{
                                                fontFamily: 'SFProDisplay-Medium',
                                                fontSize: 16,
                                                color: '#FFF',
                                                marginBottom: 8
                                            }}>{Object.values(Likes).length} Kişi Beğendi</Text>
                                        </Pressable>
                                    </>
                                )
                            }}
                            contentContainerStyle={{ paddingBottom: 100 }}
                            data={Comments}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={(comment) => {
                                return (comment.item && !Loading && Comments.length >= 1 &&
                                    <View style={{
                                        justifyContent: 'center',
                                        padding: 10,
                                        height: 'auto',
                                        width: '100%',
                                        marginTop: 20
                                    }}>
                                        <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                            <Image source={{ uri: comment.item.profile_picture !== "" && comment.item.profile_picture !== undefined ? comment.item.profile_picture : 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png' }} style={styles.avatar} resizeMode="cover" />
                                            <Text style={styles.nameText}>{comment.item.name}</Text>
                                        </View>
                                        <View style={{ marginTop: 10, width: '100%', backgroundColor: 'rgba(0,0,0,0.3)', padding: 10, borderRadius: 8 }}>
                                            <Text style={styles.commentText}>{comment.item.comment}</Text>

                                            <View style={{ marginTop: 15, flexDirection: 'row', width: '100%', justifyContent: 'flex-start', alignItems: 'center' }}>
                                                <Text numberOfLines={1} style={styles.commentButtonText}>{comment.item.date !== '' && comment.item.date !== null ? moment(comment.item.date, "DD/MM/YYYYTHH:mm:ss").fromNow() : ''}</Text>
                                                {/* <Text numberOfLines={1} style={[styles.commentButtonText, { marginLeft: 10 }]}>{comment.item.likeCount !== undefined ? String(comment.item.likeCount) : 0} beğenme</Text> */}
                                            </View>

                                            {/* <TouchableOpacity onPress={() => isLiked ? removeLike(comment.item.id) : addLike(comment.item)} style={{ position: 'absolute', right: 10, top: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>
                                                <Icon name={isLiked ? "favorite" : "favorite-outline"} size={20} color='white' />
                                            </TouchableOpacity> */}
                                        </View>
                                    </View>
                                )
                            }}
                        />
                    }


                </SafeAreaView>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', position: 'absolute', bottom: 20, left: 0, right: 0, width: width }}>
                    <Textarea
                        autoCorrect={false}
                        allowFontScaling={false}
                        blurOnSubmit={true}
                        returnKeyType="done"
                        maxLength={280}
                        style={{ marginLeft: 10, borderRadius: 12, color: '#FFF', width: '73%', height: 80, borderTopLeftRadius: 8, borderTopRightRadius: 8, backgroundColor: '#202026', padding: 10 }}
                        rowSpan={2}
                        onChangeText={(yorum) => setMyComment(yorum)}
                        value={MyComment}
                        placeholder="Yorum yaz..."
                        placeholderTextColor='#FFF'
                        fontFamily='SFProDisplay-Medium'
                        fontWeight='500'
                        fontSize={15}
                    />

                    <TouchableOpacity
                        onPress={sendComment}
                        style={{ marginRight: 10, borderRadius: 12, backgroundColor: '#000', width: '20%', height: 80, justifyContent: 'center', alignItems: 'center' }}
                    >
                        <Text style={styles.nameText}>Gönder</Text>
                    </TouchableOpacity>
                </View>

            </KeyboardAwareScrollView>
        </ImageBackground >
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: width,
        height: height
    },
    header: {
        width: '100%',
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10
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