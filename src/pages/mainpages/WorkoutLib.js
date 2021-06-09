import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, Dimensions, ImageBackground, SafeAreaView, FlatList, Image, Alert, ScrollView } from 'react-native';
import { database2 } from '../../config/config';
import SpinnerLoading from '../../components/SpinnerLoading';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';

const { height, width } = Dimensions.get("window");

const WorkoutLib = props => {
    const [Loading, setLoading] = useState(true);
    const [VideoList, setVideoList] = useState([]);

    useEffect(() => {
        getWorkouts();
    }, [])

    const getVideo = async (newWorkouts) => {
        let videoList = [];
        newWorkouts.forEach((move) => {
            axios.get(`https://player.vimeo.com/video/${move.video}/config`)
                .then((res) => {
                    if (res.status === 200) {
                        videoList.push({
                            size: res.data.request.files.progressive[4].width,
                            url: res.data.request.files.progressive[4].url,
                            thumb: res.data.video.thumbs[640],
                            title: res.data.video.title,
                            duration: res.data.video.duration,
                            id: res.data.video.id,
                            ...move
                        })
                    }
                })
                .catch((err) => {
                    setLoading(false);
                    setTimeout(() => {
                        Alert.alert('Hata', 'Bazı videolar yüklenemedi, lütfen internet bağlantınızı kontrol edin.');
                    }, 200);
                })
        })
        const int = setInterval(() => {
            if (videoList.length === newWorkouts.length) {
                setVideoList(videoList.sort((a, b) => a.title.localeCompare(b.title)))
                setLoading(false);
                clearInterval(int)
            }
        }, 500);
    }

    const getWorkouts = async () => {
        setLoading(true);
        var wList = [];
        await database2.ref('workouts').once('value')
            .then((snapshot) => {
                snapshot.forEach((item) => {
                    wList.push({
                        ...item.val(),
                        id: item.key
                    })
                })
                getVideo(wList)
            })
            .catch((err) => {
                setLoading(false);
            })
    }
    return (
        <ImageBackground style={{ height: height, width: width }} resizeMode="cover" source={require('../../img/bg.jpg')}>
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="light-content" />
                <SpinnerLoading Loading={Loading} />

                <View style={styles.header} >
                    <TouchableOpacity onPress={() => props.navigation.goBack()} style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                        <Icon name="keyboard-arrow-left" color="#FFF" size={42} style={{ marginRight: 15 }} />
                        <Text style={styles.headerText}>Egzersiz Kütüphanesi</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView style={{ width: '100%', marginTop: 20 }}>
                    {!Loading && VideoList.length > 0 ?
                        <FlatList style={{ height: 'auto', paddingHorizontal: 20, marginBottom: 50, marginTop: 10 }}
                            scrollEnabled={false}
                            showsVerticalScrollIndicator={true}
                            data={VideoList}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={(workouts) => {
                                var item = workouts.item;
                                return (item &&
                                    <TouchableOpacity key={item.id} onPress={() => props.navigation.navigate('MoveThumb', { item: item })}
                                        style={{
                                            paddingVertical: 8,
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            height: 'auto',
                                            width: '100%',
                                            borderRadius: 18
                                        }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                            <Image
                                                resizeMode="cover"
                                                source={{ uri: item.thumb }}
                                                style={{
                                                    width: 60,
                                                    height: 60,
                                                    borderRadius: 8
                                                }}
                                            />
                                            <View style={{ marginLeft: 20 }}>
                                                <Text style={{
                                                    fontFamily: 'SFProDisplay-Bold',
                                                    fontSize: 16,
                                                    color: '#FFF'
                                                }}>{item.title}</Text>
                                                <View style={{ marginTop: 5, flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'flex-start' }}>
                                                    <Icon name="arrow-right" color="#FFF" size={20} style={{ marginLeft: -8 }} />
                                                    <Text numberOfLines={2} style={{
                                                        fontFamily: 'SFProDisplay-Medium',
                                                        fontSize: 13,
                                                        color: '#FFF'
                                                    }}>{item.category}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                )
                            }}
                        />
                        : <>{Loading === false ? <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={[styles.headerText, { fontSize: 14, marginTop: 50 }]}>Kütüphanede hiç egzersiz yok.</Text>
                        </View> : <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={[styles.headerText, { fontSize: 14, marginTop: 50 }]}>Egzersizler yükleniyor...</Text>
                        </View>
                        }
                        </>
                    }
                </ScrollView>
            </SafeAreaView>
        </ImageBackground >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
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
    }
})
export default WorkoutLib;