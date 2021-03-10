import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, StatusBar, Image, SafeAreaView, TouchableOpacity, ImageBackground, TouchableHighlight, Dimensions, RefreshControl, FlatList } from 'react-native';
import { database2 } from '../../config/config';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SpinnerLoading from '../../components/SpinnerLoading';
import FeedPost from '../../components/FeedPost';

const { height, width } = Dimensions.get("window");

const FeedList = props => {

    const [Loading, setLoading] = useState(false);
    const [Feed, setFeed] = useState([]);

    useEffect(() => {
        setLoading(true);

        database2.ref('feed').once('value')
            .then((data) => {
                let PostList = [];

                data.forEach((item) => {
                    item.forEach((newitem) => {
                        PostList.push({
                            ...newitem.val(),
                            id: newitem.key
                        })
                    })
                })

                setFeed(PostList);

                setLoading(false);
            })
            .catch((err) => {
                console.log('err: ', err);
                Alert.alert('Hata', 'Feed listesi çekilemedi.');
                setLoading(false);
            })
    }, [])

    return (
        <ImageBackground style={{ height: height, width: width }} resizeMode="cover" source={require('../../img/bg.jpg')}>
            <StatusBar barStyle="light-content" />

            <SafeAreaView style={styles.container}>
                <SpinnerLoading Loading={Loading} />


                <View style={styles.header} >
                    <TouchableOpacity onPress={() => props.navigation.goBack()} style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                        <Icon name="keyboard-arrow-left" color="#FFF" size={42} style={{ marginRight: 15 }} />
                        <Text style={styles.headerText}>Feed Listesi</Text>
                    </TouchableOpacity>

                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>

                        <TouchableHighlight disabled={true} onPress={() => alert('feed')}>
                            <Icon name="comment" color="#C7CB4B" size={28} style={{ marginRight: 20 }} />
                        </TouchableHighlight>

                        <TouchableHighlight onPress={() => alert('ayarlar')}>
                            <Icon name="settings" color="#FFF" size={28} />
                        </TouchableHighlight>

                    </View>
                </View>

                {!Loading &&
                    <FlatList style={{ height: 'auto', paddingHorizontal: 30 }}
                        scrollEnabled={true}
                        data={Feed}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={(feed) => {
                            return (feed.item &&
                                <FeedPost item={feed.item} />
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
        paddingHorizontal: 30
    },
    headerText: {
        fontFamily: 'SFProDisplay-Medium',
        fontSize: 18,
        color: '#FFF'
    }
})

export default FeedList;