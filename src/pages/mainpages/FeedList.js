import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, StatusBar, Image, SafeAreaView, TouchableOpacity, ImageBackground, Dimensions, FlatList } from 'react-native';
import { database2 } from '../../config/config';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon2 from 'react-native-vector-icons/FontAwesome5';
import SpinnerLoading from '../../components/SpinnerLoading';
import FeedPost from '../../components/FeedPost';
import moment from 'moment';

const { height, width } = Dimensions.get("window");

const FeedList = ({ props, navigation }) => {

    const [Loading, setLoading] = useState(true);
    const [Feed, setFeed] = useState([]);

    const getFeed = async () => {
        database2.ref('feed').on('value', data => {
            let PostList = [];

            data.forEach((item) => {
                item.forEach((newitem) => {
                    database2.ref('users').child(item.key).once('value')
                        .then((userData) => {
                            PostList.push({
                                ...newitem.val(),
                                name: userData.val().name !== '' ? userData.val().name : 'Kullanıcı Silindi',
                                avatar: userData.val().avatar !== '' ? userData.val().avatar : '',
                                id: newitem.key
                            })
                            setFeed(PostList);
                            setLoading(false);
                        })
                        .catch((err) => {
                            setFeed(PostList);
                            setLoading(false);
                        })
                })
            })

        })
    }

    useEffect(() => {
        getFeed();
    }, [])

    return (
        <ImageBackground style={{ height: height, width: width }} resizeMode="cover" source={require('../../img/bg.jpg')}>
            <StatusBar barStyle="light-content" />

            <SafeAreaView style={styles.container}>
                <SpinnerLoading Loading={Loading} />


                <View style={styles.header} >
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                        <Icon name="keyboard-arrow-left" color="#FFF" size={42} style={{ marginRight: 15 }} />
                        <Text style={styles.headerText}>SelfAthletic Team</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('SendPost')}>
                        <Icon2 name="plus" color="#FFF" size={24} style={{ marginRight: 20 }} />
                    </TouchableOpacity>
                </View>

                {!Loading &&
                    <FlatList style={{ height: 'auto', paddingHorizontal: 20 }}
                        scrollEnabled={true}
                        data={Feed.sort(function (a, b) {
                            var formattedA = moment(a.date, "DD/MM/YYYY HH:mm:ss");
                            var formattedB = moment(b.date, "DD/MM/YYYY HH:mm:ss");
                            return moment(formattedB).diff(formattedA);
                        })}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={(feed) => {
                            return (feed.item &&
                                <FeedPost item={feed.item} navigation={navigation} />
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
        fontFamily: 'SFProDisplay-Bold',
        fontSize: 18,
        color: '#FFF'
    }
})

export default FeedList;