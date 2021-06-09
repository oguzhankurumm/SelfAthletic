import React, { useState, useLayoutEffect, useEffect } from 'react'
import { View, Text, StyleSheet, StatusBar, SafeAreaView, Alert, TouchableOpacity, Animated, ImageBackground, Dimensions, TextInput, ScrollView, Image } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SpinnerLoading from '../../components/SpinnerLoading';
import Video from 'react-native-video';
import axios from 'axios';
import moment from 'moment';
import { auth2, database2 } from '../../config/config';
import * as actions from '../../redux/actions/profile';
import { SCLAlert, SCLAlertButton } from 'react-native-scl-alert'

const { height, width } = Dimensions.get("window");


const Testler = props => {
    const dispatch = useDispatch()

    const [Loading, setLoading] = useState(true);
    const [VideoLoading, setVideoLoading] = useState(false);
    const [LoadingSave, setLoadingSave] = useState(false);
    const [VideoList, setVideoList] = useState([]);
    const [Exams, setExams] = useState(props.route.params.item);
    const [Testler, setTestler] = useState([]);
    const [SelectedIndex, setSelectedIndex] = useState(0);
    const [SelectedPage, setSelectedPage] = useState(0);

    const [initialTime, setInitialTime] = React.useState(0);
    const [startTimer, setStartTimer] = React.useState(false);
    const [playVideo, setplayVideo] = useState(false);

    const [Yapilan, setYapilan] = useState(0);
    const profileData = useSelector(state => state.user.users);
    const [TotalPoint, setTotalPoint] = useState(0);
    const [TotalTime, setTotalTime] = useState(0);

    const [ShowAlert, setShowAlert] = useState(false);
    const [ShowAlert2, setShowAlert2] = useState(false);

    const getVideo = () => {
        let videoList = [];

        Exams.forEach((ex) => {
            ex.videos.forEach((move, i) => {
                axios.get(`https://player.vimeo.com/video/${move}/config`)
                    .then((res) => {
                        if (res.status === 200) {
                            videoList.push({
                                video: {
                                    size: res.data.request.files.progressive[4].width,
                                    url: res.data.request.files.progressive[4].url,
                                    thumb: res.data.video.thumbs[640]
                                },
                                ...ex
                            })
                            if (Exams.length === videoList.length) {
                                setTestler(videoList.sort((a, b) => b.name - a.name));
                                setLoading(false);
                            }
                        } else {
                            setLoading(false);
                        }
                    })
                    .catch((err) => {
                        setLoading(false);
                        Alert.alert('Hata', 'Videolar yüklenemedi, lütfen internet bağlantınızı kontrol edin.')
                    })
            })
        })
    }

    const InfoSection = () => {
        return (
            <View style={{ justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
                <Text style={{
                    width: '100%',
                    fontFamily: 'SFProDisplay-Medium',
                    fontSize: 16,
                    color: '#FFF'
                }}>Üç farklı testin ilk ikisinde (squat ve push up) 1 dakika içerisinde yapabildiğiniz en yüksek sayıda tekrar sayısına ulaşmanız gerekmektedir. Testi başlattıktan sonra sayaç sona erene kadar hareketi uygulamaya devam edin. Sayaç sonlandığında ise yaptığınız tekrar sayısını testin karşısındaki kutucuğa yazınız. İlk testi bitirdikten sonra kendinizi hazır hissedene kadar dinleniniz. Ardından diğer testi başlatarak aynı şekilde 1 dakika boyunca yapabildiğiniz en yüksek sayıdaki tekrar sayısına ulaşınız. Testin karşısında kutucuğa işaretledikten sonra son test olan plank testine geçiniz. Plank testinde maksimum süreniz 2 dakikadır. 2 dakika boyunca sabit olarak pozisyonunuzu korumaya çalışınız. Pozisyonunuz bozulduğunda süreyi durdurunuz. Üç testi de bu şekilde tamamlayınız.</Text>

                <Text style={{
                    width: '100%',
                    marginTop: 50,
                    marginBottom: 50,
                    fontFamily: 'SFProDisplay-Bold',
                    fontSize: 16,
                    color: '#FFF'
                }}>Kendinizi hazır hissettiğiniz zaman testi başlat butonuna basın.</Text>

                {!Loading && Testler.length > 0 &&
                    <>
                        <Text style={{
                            width: '100%',
                            fontFamily: 'SFProDisplay-Bold',
                            fontSize: 16,
                            color: '#FFF',
                            marginBottom: 10
                        }}>Gelecek Test:</Text>
                        <View style={{ width: '100%', justifyContent: 'flex-start', alignItems: 'center' }}
                            key={Testler[SelectedIndex].id}
                            style={{
                                flexDirection: 'row',
                                height: 'auto',
                                width: '100%',
                                paddingVertical: 8,
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                                <Image
                                    resizeMode="cover"
                                    source={{ uri: Testler[SelectedIndex].video.thumb !== undefined ? Testler[SelectedIndex].video.thumb : Testler[SelectedIndex].image }}
                                    style={{
                                        width: 60,
                                        height: 60,
                                        borderRadius: 8,
                                        marginRight: 20
                                    }}
                                />

                                <View style={{ marginTop: 5, alignItems: 'flex-start', justifyContent: 'center' }}>
                                    <Text style={{
                                        fontFamily: 'SFProDisplay-Bold',
                                        fontSize: 16,
                                        color: '#FFF'
                                    }}>{Testler[SelectedIndex].name}</Text>
                                    <View style={{ marginTop: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                                        <Icon name="timer" style={{ marginLeft: -3 }} color="#FFF" size={22} />
                                        <Text numberOfLines={2} style={{
                                            fontFamily: 'SFProDisplay-Medium',
                                            fontSize: 15,
                                            color: '#FFF',
                                            marginLeft: 5
                                        }}>{Testler[SelectedIndex].time} Saniye</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </>
                }

            </View >
        )
    }

    const InfoSection2 = () => {
        return (
            <View style={{ justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
                <Text style={{
                    width: '100%',
                    marginTop: 10,
                    marginBottom: 50,
                    fontFamily: 'SFProDisplay-Bold',
                    fontSize: 16,
                    color: '#FFF'
                }}>Kendinizi hazır hissettiğiniz zaman testi başlat butonuna basın.</Text>

                {!Loading && Testler.length > 0 &&
                    <>
                        <Text style={{
                            width: '100%',
                            fontFamily: 'SFProDisplay-Bold',
                            fontSize: 16,
                            color: '#FFF',
                            marginBottom: 10
                        }}>Gelecek Test:</Text>
                        <View style={{ width: '100%', justifyContent: 'flex-start', alignItems: 'center' }}
                            key={Testler[SelectedIndex].id}
                            style={{
                                flexDirection: 'row',
                                height: 'auto',
                                width: '100%',
                                paddingVertical: 8,
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                                <Image
                                    resizeMode="cover"
                                    source={{ uri: Testler[SelectedIndex].video.thumb !== undefined ? Testler[SelectedIndex].video.thumb : Testler[SelectedIndex].image }}
                                    style={{
                                        width: 60,
                                        height: 60,
                                        borderRadius: 8,
                                        marginRight: 20
                                    }}
                                />

                                <View style={{ marginTop: 5, alignItems: 'flex-start', justifyContent: 'center' }}>
                                    <Text style={{
                                        fontFamily: 'SFProDisplay-Bold',
                                        fontSize: 16,
                                        color: '#FFF'
                                    }}>{Testler[SelectedIndex].name}</Text>
                                    <View style={{ marginTop: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                                        <Icon name="timer" style={{ marginLeft: -3 }} color="#FFF" size={22} />
                                        <Text numberOfLines={2} style={{
                                            fontFamily: 'SFProDisplay-Medium',
                                            fontSize: 15,
                                            color: '#FFF',
                                            marginLeft: 5
                                        }}>{Testler[SelectedIndex].time} Saniye</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </>
                }
            </View>
        )
    }



    const CompleteTest = async (item) => {
        const Type = item.type
        let point = 0;

        if (Type === "time") {
            point = parseFloat(Yapilan).toFixed(0) / 10;
            setTotalPoint(parseFloat(TotalPoint) + parseFloat(point));
        } else {
            point = 1 * parseFloat(Yapilan).toFixed(0);
            setTotalPoint(parseFloat(TotalPoint) + parseFloat(point));
        }

        setInitialTime(0);
        setStartTimer(false);
        setSelectedPage(SelectedPage + 1);
        setSelectedIndex(SelectedIndex + 1)
        setYapilan(0);

    }

    const FinishTest = async () => {
        setplayVideo(!playVideo);
        setStartTimer(!startTimer);

        let profilePoint = parseFloat(profileData.point);
        let newP = 0;

        if (TotalPoint < 50) {
            if (profilePoint <= 10000) {
                newP = 99999 - parseFloat(profilePoint);
            }

        } else if (TotalPoint >= 50 && TotalPoint <= 100) {
            if (profilePoint >= 10001 && profilePoint <= 15000) {
                newP = 15001 - parseFloat(profilePoint);
            }
        } else if (TotalPoint >= 101) {
            if (profilePoint >= 15001 && profilePoint <= 25000) {
                newP = 25001 - parseFloat(profilePoint);
            }
        }

        let dataModel = {
            calories: 0,
            date: moment().format("DD/MM/YYYYTHH:mm:ss"),
            point: parseFloat(newP),
            time: TotalTime,
            reps: parseFloat(Yapilan)
        }

        setLoadingSave(false);
        setTimeout(() => {
            setShowAlert2(!ShowAlert2);
        }, 200);

        // await database2.ref('users_points/' + auth2.currentUser.uid).push(dataModel)
        //     .then(() => {
        //         dispatch(actions.fetchUserData(profileData.userId));
        //         setLoadingSave(false);
        //         props.navigation.goBack();
        //         setTimeout(() => {
        //             Alert.alert('Tebrikler', "Test tamamlandı ve kaydedildi.", [
        //                 { text: 'Tamam', onPress: () => null, style: 'default' }
        //             ]);
        //         }, 200);
        //     })
        //     .catch((err) => {
        //         setLoadingSave(false);
        //         setTimeout(() => {
        //             Alert.alert('Hata', String(err.message));
        //         }, 300);
        //     })

        console.log('data:', dataModel)

    }

    useLayoutEffect(() => {
        if (Exams !== undefined && Exams.length !== 0) {
            getVideo();
        } else {
            setTimeout(() => {
                Alert.alert('Hata', 'Bu testin içeriği şu an boş.', [
                    { text: 'Geri Dön', onPress: () => props.navigation.goBack(), style: 'cancel' }
                ])
            }, 400);
        }
    }, [])

    useEffect(() => {
        if (startTimer === true) {
            setTimeout(() => {
                if (Testler[SelectedIndex].time_type === "up") {
                    if (initialTime === Testler[SelectedIndex].time) {
                        setplayVideo(false);
                        setStartTimer(false);
                    } else {
                        setInitialTime(initialTime + 1);
                    }
                } else {
                    if (initialTime === 0) {
                        setplayVideo(false);
                        setStartTimer(false);
                    } else {
                        setInitialTime(initialTime - 1);
                    }
                }
            }, 1000);
        }
    }, [initialTime, startTimer]);



    return (
        <ImageBackground style={{ height: height, width: width }} resizeMode="cover" source={require('../../img/bg.jpg')}>

            <SafeAreaView style={styles.container}>
                <SpinnerLoading Loading={Loading} />
                <SpinnerLoading Loading={VideoLoading} />
                <SpinnerLoading Loading={LoadingSave} />

                <View style={styles.header} >
                    <TouchableOpacity onPress={() => setShowAlert(true)} style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                        <Icon name="keyboard-arrow-left" color="#FFF" size={42} style={{ marginRight: 10 }} />
                        <Text style={styles.headerText}>Testler</Text>
                    </TouchableOpacity>

                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <Icon name="timer" color="#FFF" size={24} />
                        <Text style={styles.headerTimerText}>{String(initialTime)} sn.</Text>
                    </View>
                </View>

                <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} style={styles.container}>

                    <StatusBar barStyle="light-content" />

                    <SCLAlert
                        theme="warning"
                        show={ShowAlert}
                        title="Testten Çık"
                        subtitle="Testten çıkmak istiyor musunuz?"
                    >
                        <SCLAlertButton theme="warning" onPress={() => {
                            setShowAlert(false);
                            props.navigation.goBack();
                        }}>Testten Çık</SCLAlertButton>
                        <SCLAlertButton theme="default" onPress={() => setShowAlert(!ShowAlert)}>Vazgeç</SCLAlertButton>
                    </SCLAlert>

                    <SCLAlert
                        theme="success"
                        show={ShowAlert2}
                        title="Test Tamamlandı"
                        subtitle="Tebrikler, test tamamlandı ve kaydedildi."
                    >
                        <SCLAlertButton theme="success" onPress={() => {
                            setShowAlert2(!ShowAlert2);
                            props.navigation.goBack();
                        }}>Tamam</SCLAlertButton>
                    </SCLAlert>

                    <View style={{ justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, marginTop: 20 }}>
                        {SelectedPage === 0 &&
                            <InfoSection />
                        }
                        {SelectedPage === 1 &&
                            <View style={{
                                width: '100%'
                            }}>
                                {!Loading && !Testler[SelectedIndex] !== undefined &&
                                    <>
                                        <Text style={{
                                            fontFamily: 'SFProDisplay-Medium',
                                            fontSize: 22,
                                            color: '#FFF',
                                            textAlign: 'center',
                                            marginBottom: 20
                                        }}>{Testler[SelectedIndex].name}</Text>
                                        <Video
                                            key={Testler[SelectedIndex].id}
                                            resizeMode="contain"
                                            useNativeControls
                                            repeat={playVideo}
                                            paused={!playVideo}
                                            shouldPlay={false}
                                            source={{ uri: Testler[SelectedIndex].video.url }}
                                            style={{ height: 200, width: '100%', marginBottom: 10, borderRadius: 12 }}
                                            playInBackground={false}
                                            playWhenInactive={false}
                                            onBuffer={self.onBuffer}
                                            onEnd={self.onEnd}
                                            muted={true}
                                            onError={() => {
                                                setVideoLoading(false);
                                            }}
                                            onLoad={() => setVideoLoading(false)}
                                            onProgress={self.setTime}
                                            onTimedMetadata={self.onTimedMetadata}
                                            onFullscreenPlayerWillPresent={self.fullScreenPlayerWillPresent}
                                            onFullscreenPlayerDidPresent={self.fullScreenPlayerDidPresent}
                                            onFullscreenPlayerWillDismiss={self.fullScreenPlayerWillDismiss}
                                            onFullscreenPlayerDidDismiss={self.fullScreenPlayerDidDissmiss}
                                        />
                                    </>
                                }

                                <View style={{ marginBottom: 10, marginTop: 10, justifyContent: 'center', alignItems: 'center', width: '100%' }}>

                                    <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                                        <TextInput
                                            style={{
                                                borderWidth: 3,
                                                borderColor: '#202026',
                                                textAlign: 'center',
                                                padding: 10,
                                                color: "#FFF",
                                                borderRadius: 12,
                                                fontFamily: 'SFProDisplay-Medium',
                                                fontSize: 16,
                                                width: '80%',
                                                height: 60,
                                                marginBottom: 10
                                            }}
                                            textAlign="center"
                                            placeholderTextColor="#FFF"
                                            autoCorrect={false}
                                            autoCapitalize="none"
                                            allowFontScaling={false}
                                            maxLength={3}
                                            value={Yapilan}
                                            placeholder={Testler[SelectedIndex].type === "time" ? "Yapılan saniyeyi girin..." : "Yapılan tekrar sayısını girin..."}
                                            returnKeyType={"done"}
                                            onChangeText={text => setYapilan(text)}
                                            keyboardType="decimal-pad"
                                        />

                                        {Testler[SelectedIndex].type === "time" &&
                                            <Text style={{
                                                fontFamily: 'SFProDisplay-Medium',
                                                fontSize: 18,
                                                color: '#FFF'
                                            }}>/ {Testler[SelectedIndex].time} sn.</Text>
                                        }
                                    </View>

                                    <TouchableOpacity
                                        onPress={() => {
                                            setplayVideo(!playVideo);
                                            setStartTimer(!startTimer)
                                        }}
                                        style={{ marginTop: 30, width: '80%', justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                                        <Icon name={startTimer ? "pause" : "play-arrow"} size={20} color="#FFF" />
                                        <Text style={{
                                            marginLeft: 10,
                                            fontFamily: 'SFProDisplay-Medium',
                                            fontSize: 18,
                                            color: '#FFF'
                                        }}>{startTimer ? "Duraklat" : "Devam Et"}</Text>
                                    </TouchableOpacity>
                                </View>

                            </View>
                        }
                        {SelectedPage === 2 &&
                            <InfoSection2 />
                        }
                        {SelectedPage === 3 &&
                            <View style={{
                                width: '100%'
                            }}>
                                {!Loading && !Testler[SelectedIndex] !== undefined &&
                                    <>
                                        <Text style={{
                                            fontFamily: 'SFProDisplay-Medium',
                                            fontSize: 22,
                                            color: '#FFF',
                                            textAlign: 'center',
                                            marginBottom: 20
                                        }}>{Testler[SelectedIndex].name}</Text>
                                        <Video
                                            key={Testler[SelectedIndex].id}
                                            resizeMode="contain"
                                            useNativeControls
                                            repeat={playVideo}
                                            paused={!playVideo}
                                            shouldPlay={false}
                                            source={{ uri: Testler[SelectedIndex].video.url }}
                                            style={{ height: 200, width: '100%', marginBottom: 10, borderRadius: 12 }}
                                            playInBackground={false}
                                            playWhenInactive={false}
                                            onBuffer={self.onBuffer}
                                            onEnd={self.onEnd}
                                            muted={true}
                                            onError={() => {
                                                setVideoLoading(false);
                                            }}
                                            onLoad={() => setVideoLoading(false)}
                                            onProgress={self.setTime}
                                            onTimedMetadata={self.onTimedMetadata}
                                            onFullscreenPlayerWillPresent={self.fullScreenPlayerWillPresent}
                                            onFullscreenPlayerDidPresent={self.fullScreenPlayerDidPresent}
                                            onFullscreenPlayerWillDismiss={self.fullScreenPlayerWillDismiss}
                                            onFullscreenPlayerDidDismiss={self.fullScreenPlayerDidDissmiss}
                                        />
                                    </>
                                }

                                <View style={{ marginBottom: 10, marginTop: 10, justifyContent: 'center', alignItems: 'center', width: '100%' }}>

                                    <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                                        <TextInput
                                            style={{
                                                borderWidth: 3,
                                                borderColor: '#202026',
                                                textAlign: 'center',
                                                padding: 10,
                                                color: "#FFF",
                                                borderRadius: 12,
                                                fontFamily: 'SFProDisplay-Medium',
                                                fontSize: 16,
                                                width: '80%',
                                                height: 60,
                                                marginBottom: 10
                                            }}
                                            textAlign="center"
                                            placeholderTextColor="#FFF"
                                            autoCorrect={false}
                                            autoCapitalize="none"
                                            allowFontScaling={false}
                                            maxLength={3}
                                            value={Yapilan}
                                            placeholder={Testler[SelectedIndex].type === "time" ? "Yapılan saniyeyi girin..." : "Yapılan tekrar sayısını girin..."}
                                            returnKeyType={"done"}
                                            onChangeText={text => setYapilan(text)}
                                            keyboardType="decimal-pad"
                                        />

                                        {Testler[SelectedIndex].type === "time" ?
                                            <Text style={{
                                                fontFamily: 'SFProDisplay-Medium',
                                                fontSize: 18,
                                                color: '#FFF'
                                            }}>/ {Testler[SelectedIndex].time} sn.</Text>
                                            : <Text style={{
                                                fontFamily: 'SFProDisplay-Medium',
                                                fontSize: 18,
                                                color: '#FFF'
                                            }}>/ {Testler[SelectedIndex].set} tekrar</Text>
                                        }

                                        <TouchableOpacity
                                            onPress={() => {
                                                setplayVideo(!playVideo);
                                                setStartTimer(!startTimer)
                                            }}
                                            style={{ marginTop: 30, width: '80%', justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                                            <Icon name={startTimer ? "pause" : "play-arrow"} size={20} color="#FFF" />
                                            <Text style={{
                                                marginLeft: 10,
                                                fontFamily: 'SFProDisplay-Medium',
                                                fontSize: 18,
                                                color: '#FFF'
                                            }}>{startTimer ? "Duraklat" : "Devam Et"}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                            </View>
                        }

                        {SelectedPage === 4 &&
                            <InfoSection2 />
                        }
                        {SelectedPage === 5 &&
                            <View style={{
                                width: '100%'
                            }}>
                                {!Loading && !Testler[SelectedIndex] !== undefined &&
                                    <>
                                        <Text style={{
                                            fontFamily: 'SFProDisplay-Medium',
                                            fontSize: 22,
                                            color: '#FFF',
                                            textAlign: 'center',
                                            marginBottom: 20
                                        }}>{Testler[SelectedIndex].name}</Text>
                                        <Video
                                            key={Testler[SelectedIndex].id}
                                            resizeMode="contain"
                                            useNativeControls
                                            repeat={playVideo}
                                            paused={!playVideo}
                                            shouldPlay={false}
                                            source={{ uri: Testler[SelectedIndex].video.url }}
                                            style={{ height: 200, width: '100%', marginBottom: 10, borderRadius: 12 }}
                                            playInBackground={false}
                                            playWhenInactive={false}
                                            onBuffer={self.onBuffer}
                                            onEnd={self.onEnd}
                                            muted={true}
                                            onError={() => {
                                                setVideoLoading(false);
                                            }}
                                            onLoad={() => setVideoLoading(false)}
                                            onProgress={self.setTime}
                                            onTimedMetadata={self.onTimedMetadata}
                                            onFullscreenPlayerWillPresent={self.fullScreenPlayerWillPresent}
                                            onFullscreenPlayerDidPresent={self.fullScreenPlayerDidPresent}
                                            onFullscreenPlayerWillDismiss={self.fullScreenPlayerWillDismiss}
                                            onFullscreenPlayerDidDismiss={self.fullScreenPlayerDidDissmiss}
                                        />
                                    </>
                                }

                                <View style={{ marginBottom: 10, marginTop: 10, justifyContent: 'center', alignItems: 'center', width: '100%' }}>

                                    <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                                        <TextInput
                                            style={{
                                                borderWidth: 3,
                                                borderColor: '#202026',
                                                textAlign: 'center',
                                                padding: 10,
                                                color: "#FFF",
                                                borderRadius: 12,
                                                fontFamily: 'SFProDisplay-Medium',
                                                fontSize: 16,
                                                width: '80%',
                                                height: 60,
                                                marginBottom: 10
                                            }}
                                            textAlign="center"
                                            placeholderTextColor="#FFF"
                                            autoCorrect={false}
                                            autoCapitalize="none"
                                            allowFontScaling={false}
                                            maxLength={3}
                                            value={Yapilan}
                                            placeholder={Testler[SelectedIndex].type === "time" ? "Yapılan saniyeyi girin..." : "Yapılan tekrar sayısını girin..."}
                                            returnKeyType={"done"}
                                            onChangeText={text => setYapilan(text)}
                                            keyboardType="decimal-pad"
                                        />

                                        {Testler[SelectedIndex].type === "time" &&
                                            <Text style={{
                                                fontFamily: 'SFProDisplay-Medium',
                                                fontSize: 18,
                                                color: '#FFF'
                                            }}>/ {Testler[SelectedIndex].time} sn.</Text>
                                        }

                                        <TouchableOpacity
                                            onPress={() => {
                                                setplayVideo(!playVideo);
                                                setStartTimer(!startTimer)
                                            }}
                                            style={{ marginTop: 30, width: '80%', justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                                            <Icon name={startTimer ? "pause" : "play-arrow"} size={20} color="#FFF" />
                                            <Text style={{
                                                marginLeft: 10,
                                                fontFamily: 'SFProDisplay-Medium',
                                                fontSize: 18,
                                                color: '#FFF'
                                            }}>{startTimer ? "Duraklat" : "Devam Et"}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                            </View>
                        }
                    </View>
                </ScrollView>
            </SafeAreaView>

            <View style={{
                flexDirection: 'row',
                width: '100%',
                height: 60,
                backgroundColor: '#000',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <TouchableOpacity onPress={() => {
                    if (SelectedPage === 0) {
                        setInitialTime(0);
                        setSelectedPage(1);
                        setYapilan(0);

                        setplayVideo(true)
                        setInitialTime(Testler[SelectedIndex].time_type === "down" ? Testler[SelectedIndex].time - 1 : 1);
                        setStartTimer(true);
                    }
                    if (SelectedPage === 1) {
                        if (Yapilan !== 0 && Yapilan !== "") {
                            CompleteTest(Testler[SelectedIndex])
                        } else {
                            Alert.alert('Hata', 'Yapılan sayıyı girmediniz.');
                        }
                    }

                    if (SelectedPage === 2) {
                        setInitialTime(0);
                        setSelectedPage(3);
                        setYapilan(0);

                        setplayVideo(true)
                        setInitialTime(Testler[SelectedIndex].time_type === "down" ? Testler[SelectedIndex].time - 1 : 1);
                        setStartTimer(true);
                    }

                    if (SelectedPage === 3) {
                        if (Yapilan !== 0 && Yapilan !== "") {
                            CompleteTest(Testler[SelectedIndex])
                        } else {
                            Alert.alert('Hata', 'Yapılan sayıyı girmediniz.');
                        }
                    }

                    if (SelectedPage === 4) {
                        setInitialTime(0);
                        setSelectedPage(5);
                        setYapilan(0);

                        setplayVideo(true)
                        setInitialTime(Testler[SelectedIndex].time_type === "down" ? Testler[SelectedIndex].time - 1 : 1);
                        setStartTimer(true);
                    }

                    if (SelectedPage === 5) {
                        if (Yapilan !== 0 && Yapilan !== "") {
                            const Type = Testler[SelectedIndex].type
                            let point = 0;

                            if (Type === "time") {
                                point = parseFloat(Yapilan).toFixed(0) / 10;
                                setTotalPoint(TotalPoint + point);
                            } else {
                                point = 1 * parseFloat(Yapilan).toFixed(0);
                                setTotalPoint(TotalPoint + point);
                            }

                            FinishTest();
                        } else {
                            Alert.alert('Hata', 'Yapılan sayıyı girmediniz.');
                        }
                    }
                }} style={{
                    width: '100%',
                    height: 60,
                    backgroundColor: 'yellow',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Text style={{
                        fontFamily: 'SFProDisplay-Bold',
                        justifyContent: 'flex-start',
                        fontSize: 16,
                        color: '#000',
                        marginRight: 5
                    }}>{SelectedPage === 0 && "Testi Başlat"}
                        {SelectedPage === 1 && "Sonraki Teste Geç"}
                        {SelectedPage === 2 && "Testi Başlat"}
                        {SelectedPage === 3 && "Sonraki Teste Geç"}
                        {SelectedPage === 4 && "Testi Başlat"}
                        {SelectedPage === 5 && "Testi Bitir"}
                    </Text>
                </TouchableOpacity>
            </View>

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
    },
    headerTimerText: {
        fontFamily: 'SFProDisplay-Medium',
        marginLeft: 5,
        fontSize: 18,
        color: '#FFF'
    }
})

export default Testler;