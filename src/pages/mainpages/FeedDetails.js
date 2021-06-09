import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, StatusBar, Image, SafeAreaView, TouchableOpacity, ImageBackground, Dimensions, FlatList, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { database2, auth2 } from '../../config/config';
import { Textarea } from 'native-base';
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
    const [MyComment, setMyComment] = useState("");

    const getComments = async () => {
        let commentList = [];
        if (Comments.length !== 0) {
            Comments.forEach(async (cm) => {
                console.log('cm: ', cm)
                await database2.ref('users').child(cm.ownerid).once('value')
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
                            userId: cm.ownerid,
                            likeCount: Likes.length,
                            date: cm.date,
                            comment: cm.comment
                        })
                        console.log('cmL  : ', cm)
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

        if (MyComment !== "") {

        } else {
            Alert.alert('Hata', 'Yorum boş olamaz.')
        }


    }

    const removeLike = () => {

    }

    const addLike = async (item) => {

        console.log('item : ', item);

        // await database2.ref(`feed/${userid}/${id}`).once('value')
        //     .then((res) => {
        //         console.log('res:', res.val())
        //     })
        //     .catch((err) => {
        //         console.log('err: ', err)
        //     })
    }


    useEffect(() => {
        getComments();
    }, [])

    return (
        <ImageBackground style={{ height: height, width: width }} resizeMode="cover" source={require('../../img/bg.jpg')}>
            <StatusBar barStyle="light-content" />

            <KeyboardAwareScrollView style={styles.container}>

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
                                            </View>

                                            <TouchableOpacity onPress={() => isLiked ? removeLike(comment.item.id) : addLike(comment.item)} style={{ position: 'absolute', right: 10, top: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>
                                                <Icon name={isLiked ? "favorite" : "favorite-outline"} size={20} color='white' />
                                            </TouchableOpacity>
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