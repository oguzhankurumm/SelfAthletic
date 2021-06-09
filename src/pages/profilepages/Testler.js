import React, { useState, useLayoutEffect, useEffect, useRef } from 'react'
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
import Carousel from 'react-native-snap-carousel';

const { height, width } = Dimensions.get("window");


const Testler = props => {
    const dispatch = useDispatch()

    const _carousel = useRef(null);

    const [Loading, setLoading] = useState(true);
    const [VideoLoading, setVideoLoading] = useState(false);
    const [LoadingSave, setLoadingSave] = useState(false);
    const [Exams, setExams] = useState(props.route.params.item);
    const [Testler, setTestler] = useState([]);
    const [SelectedIndex, setSelectedIndex] = useState(0);

    const [initialTime, setInitialTime] = React.useState(0);
    const [startTimer, setStartTimer] = React.useState(false);
    const [playVideo, setplayVideo] = useState(false);

    const [Yapilan, setYapilan] = useState(0);
    const profileData = useSelector(state => state.user.users);
    const [TotalPoint, setTotalPoint] = useState(0);
    const [TotalTime, setTotalTime] = useState(0);

    const [ShowAlert, setShowAlert] = useState(false);
    const [ShowAlert2, setShowAlert2] = useState(false);
    const [ShowAlert3, setShowAlert3] = useState(false);

    const [isReady, setisReady] = useState(false);
    const [isCompleted, setisCompleted] = useState(false);

    const onCarouselItemChange = index => {

        if (SelectedIndex !== Testler.length) {
            setSelectedIndex(index + 1);

            _carousel.current.snapToItem(index + 1);
            setisReady(!isReady);
            // console.log('index: ', SelectedIndex)

            if (Testler[index].type === "time") {
                Testler[index].completedTime = parseFloat(Yapilan);
            } else {
                Testler[index].completedReps = parseFloat(Yapilan);
            }

            setTimeout(() => {
                setYapilan(0);
            }, 200);
        } else {
            setisReady(false);
        }

    }

    const _renderItem = ({ item, index }) => {
        if (!isReady && SelectedIndex === index) {
            return (
                <View style={{ justifyContent: 'flex-start', alignItems: 'center', width: '100%' }}>
                    {index === 0 &&
                        <Text style={{
                            width: '100%',
                            fontFamily: 'SFProDisplay-Medium',
                            fontSize: 16,
                            color: '#FFF'
                        }}>Üç farklı testin ilk ikisinde (squat ve push up) 1 dakika içerisinde yapabildiğiniz en yüksek sayıda tekrar sayısına ulaşmanız gerekmektedir. Testi başlattıktan sonra sayaç sona erene kadar hareketi uygulamaya devam edin. Sayaç sonlandığında ise yaptığınız tekrar sayısını testin karşısındaki kutucuğa yazınız. İlk testi bitirdikten sonra kendinizi hazır hissedene kadar dinleniniz. Ardından diğer testi başlatarak aynı şekilde 1 dakika boyunca yapabildiğiniz en yüksek sayıdaki tekrar sayısına ulaşınız. Testin karşısında kutucuğa işaretledikten sonra son test olan plank testine geçiniz. Plank testinde maksimum süreniz 2 dakikadır. 2 dakika boyunca sabit olarak pozisyonunuzu korumaya çalışınız. Pozisyonunuz bozulduğunda süreyi durdurunuz. Üç testi de bu şekilde tamamlayınız.</Text>
                    }

                    <Text style={{
                        width: '100%',
                        marginTop: index === 0 ? 50 : 0,
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
                                key={Testler[index].id}
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
                                        source={{ uri: Testler[index].video.thumb !== undefined ? Testler[index].video.thumb : Testler[index].image }}
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
                                        }}>{Testler[index].name}</Text>
                                        <View style={{ marginTop: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                                            <Icon name="timer" style={{ marginLeft: -3 }} color="#FFF" size={22} />
                                            <Text numberOfLines={2} style={{
                                                fontFamily: 'SFProDisplay-Medium',
                                                fontSize: 15,
                                                color: '#FFF',
                                                marginLeft: 5
                                            }}>{Testler[index].time} Saniye</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </>
                    }

                </View >)
        } else {
            return (
                <ScrollView
                    key={index}
                    style={{ height }}
                    contentContainerStyle={{ paddingBottom: 100 }}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={{
                        width: '100%'
                    }}>
                        {!Loading && !Testler[index] !== undefined &&
                            <>
                                <Video
                                    key={Testler[index].id}
                                    resizeMode="contain"
                                    useNativeControls
                                    repeat={playVideo}
                                    paused={!playVideo}
                                    shouldPlay={false}
                                    source={{ uri: Testler[index].video.url }}
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

                                <Text style={{
                                    fontFamily: 'SFProDisplay-Medium',
                                    fontSize: 18,
                                    color: '#FFF',
                                    textAlign: 'center',
                                    marginVertical: 20
                                }}>{Testler[index].name}</Text>
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
                                    placeholder={Testler[index].type === "time" ? "Yapılan saniyeyi girin..." : "Yapılan tekrar sayısını girin..."}
                                    returnKeyType={"done"}
                                    onChangeText={text => setYapilan(text)}
                                    keyboardType="decimal-pad"
                                />

                                {Testler[index].type === "time" &&
                                    <Text style={{
                                        fontFamily: 'SFProDisplay-Medium',
                                        fontSize: 18,
                                        color: '#FFF'
                                    }}>/ {Testler[index].time} sn.</Text>
                                }
                            </View>

                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 30 }}>
                                <Text style={[styles.headerTimerText, { fontSize: 26 }]}>{String(moment.utc(initialTime * 1000).format('mm:ss'))}</Text>
                            </View>

                            {initialTime !== 0 &&
                                <TouchableOpacity
                                    onPress={() => {
                                        setplayVideo(!playVideo);
                                        setStartTimer(!startTimer);
                                    }}
                                    style={{ backgroundColor: '#202026', borderRadius: 12, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', padding: 20 }}>
                                    <Icon name={startTimer ? "pause" : "play-arrow"} size={20} color="#FFF" />
                                    <Text style={{
                                        marginLeft: 10,
                                        fontFamily: 'SFProDisplay-Medium',
                                        fontSize: 18,
                                        color: '#FFF'
                                    }}>{startTimer ? "Duraklat" : "Devam Et"}</Text>
                                </TouchableOpacity>
                            }
                        </View>

                    </View>

                </ScrollView>
            );
        }
    }

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
                                let testList = videoList.sort((a, b) => a.index - b.index)
                                setTestler(testList);

                                setInitialTime(testList[0].time);

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

    const CompleteTest = () => {
        console.log('fdslfjsdlkfjsdf complete')

        let point = 0;

        Testler.forEach((item) => {
            console.log('item: ', item);
            const Type = item.type

            if (Type === "time") {
                point = parseFloat(Yapilan).toFixed(0) / 10;
                setTotalPoint(parseFloat(TotalPoint) + parseFloat(point));
            } else {
                point = 1 * parseFloat(Yapilan).toFixed(0);
                setTotalPoint(parseFloat(TotalPoint) + parseFloat(point));
            }
        })

        FinishTest();

    }

    const FinishTest = async () => {
        setplayVideo(false);
        setStartTimer(false);

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

                    <SCLAlert
                        theme="danger"
                        show={ShowAlert3}
                        title="Uyarı"
                        subtitle="Lütfen eksik alanları doldurun."
                    >
                        <SCLAlertButton theme="danger" onPress={() => {
                            setShowAlert3(!ShowAlert3);
                        }}>Tekrar Dene</SCLAlertButton>
                    </SCLAlert>

                    <View style={{ justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, marginTop: 20 }}>
                        {!Loading &&
                            <Carousel
                                scrollEnabled={false}
                                ref={_carousel}
                                data={Testler}
                                renderItem={_renderItem}
                                sliderWidth={width}
                                itemWidth={350}
                                layout={'default'}
                                style={{ paddingHorizontal: 10 }}
                                removeClippedSubviews={false}
                            // onSnapToItem={(index) => onCarouselItemChange(index)}
                            />

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
                {SelectedIndex + 1 === Testler.length && isReady &&
                    <TouchableOpacity onPress={() => {
                        setStartTimer(false);
                        setplayVideo(false);
                        CompleteTest();
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
                        }}>Testi Bitir</Text>
                    </TouchableOpacity>
                }

                {!isCompleted &&
                    <TouchableOpacity onPress={() => {
                        if (isReady === true) {
                            if (Yapilan >= 1) {
                                onCarouselItemChange(SelectedIndex);
                                setStartTimer(false);
                                setplayVideo(false);
                            } else {
                                setShowAlert3(true);
                            }
                        } else {
                            setplayVideo(true);
                            setStartTimer(true);
                            setisReady(!isReady);
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
                        }}>{!isReady ? "Testi Başlat" : "Sonraki Teste Geç"}
                        </Text>
                    </TouchableOpacity>
                }
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