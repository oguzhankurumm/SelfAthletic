import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, StatusBar, Image, SafeAreaView, Alert, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SpinnerLoading from '../../components/SpinnerLoading';
import Video from 'react-native-video';
import axios from 'axios';

const { height, width } = Dimensions.get("window");


const MoveThumb = props => {

    const [Loading, setLoading] = useState(true);
    const [VideoLoading, setVideoLoading] = useState(false);
    const [VideoList, setVideoList] = useState([]);
    const [Thumbs, setThumbs] = useState(props.route.params.item.thumbs)
    const infoText = props.route.params.item.info;

    const getVideo = () => {
        let videoList = [];

        Thumbs.forEach((move) => {
            axios.get(`https://player.vimeo.com/video/${move}/config`)
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

                        setVideoList(videoList);
                        setLoading(false);
                    } else {
                        setLoading(false);
                    }
                })
                .catch((err) => {
                    setLoading(false);
                    Alert.alert('Hata', 'Videolar yüklenemedi, lütfen internet bağlantınızı kontrol edin.')
                })
        })
    }

    useEffect(() => {
        if (Thumbs !== undefined && Thumbs.length !== 0) {
            getVideo();
        } else if (infoText !== undefined){
            setLoading(false);
        } else {
            setTimeout(() => {
                Alert.alert('Hata', 'Bu hareket için hiç önizlenecek video yok.', [
                    { text: 'Geri Dön', onPress: () => props.navigation.goBack(), style: 'cancel' }
                ])
            }, 400);
        }
    }, [])

    return (
        <ImageBackground style={{ height: height, width: width }} resizeMode="cover" source={require('../../img/bg.jpg')}>

            <SafeAreaView style={styles.container}>
                <SpinnerLoading Loading={Loading} />
                <SpinnerLoading Loading={VideoLoading} />

                <View style={styles.header} >
                    <TouchableOpacity onPress={() => props.navigation.goBack()} style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                        <Icon name="keyboard-arrow-left" color="#FFF" size={42} style={{ marginRight: 15 }} />
                        <Text style={styles.headerText}>Önizleme & Bilgi</Text>
                    </TouchableOpacity>
                </View>

                <View showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} style={styles.container}>
                    <StatusBar barStyle="light-content" />

                    <View style={{ justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, marginTop: 20 }}>

                        {!Loading &&
                            <>
                                <View style={{
                                    height: 'auto',
                                    width: '100%',
                                    borderRadius: 18,
                                    marginBottom: 20
                                }}>
                                    <View style={{ width: '100%', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                                        <Text style={styles.textStyle}>{infoText !== undefined ? infoText : ""}</Text>
                                    </View>
                                </View>

                                <View style={{ width: '100%' }}>
                                    <View style={{
                                        width: '100%',
                                        height: 200
                                    }}>
                                        {Thumbs !== null && VideoList.map((item) => {
                                            return (
                                                <Video
                                                    resizeMode="contain"
                                                    useNativeControls
                                                    repeat={true}
                                                    paused={false}
                                                    shouldPlay={false}
                                                    source={{ uri: item.url }}
                                                    style={{ height: 200, width: '100%', borderWidth: 1, borderColor: '#FFF', marginBottom: 10, borderRadius: 12 }}
                                                    playInBackground={false}
                                                    playWhenInactive={false}
                                                    onBuffer={self.onBuffer}
                                                    onEnd={self.onEnd}
                                                    muted={true}
                                                    onError={() => {
                                                        setVideoLoading(false);
                                                    }}
                                                    onLoadStart={() => setVideoLoading(true)}
                                                    onLoad={() => setVideoLoading(false)}
                                                    onProgress={self.setTime}
                                                    onTimedMetadata={self.onTimedMetadata}
                                                    onFullscreenPlayerWillPresent={self.fullScreenPlayerWillPresent}
                                                    onFullscreenPlayerDidPresent={self.fullScreenPlayerDidPresent}
                                                    onFullscreenPlayerWillDismiss={self.fullScreenPlayerWillDismiss}
                                                    onFullscreenPlayerDidDismiss={self.fullScreenPlayerDidDissmiss}
                                                />
                                            )
                                        })
                                        }
                                    </View>
                                </View>
                            </>
                        }
                    </View>
                </View>
            </SafeAreaView>
        </ImageBackground >
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    textStyle: {
        fontFamily: 'SFProDisplay-Medium',
        justifyContent: 'flex-start',
        textAlign: 'justify',
        fontSize: 16,
        color: '#FFF'
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

export default MoveThumb;