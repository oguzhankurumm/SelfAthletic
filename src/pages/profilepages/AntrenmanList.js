import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Image, StatusBar, TouchableOpacity, TouchableHighlight, Dimensions, ImageBackground, SafeAreaView, FlatList, Alert } from 'react-native';
import SpinnerLoading from '../../components/SpinnerLoading';
import Icon from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';
import 'moment/locale/tr';
moment.locale('tr');
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import { SCLAlert, SCLAlertButton } from 'react-native-scl-alert'

const { height, width } = Dimensions.get("window");

const AntrenmanList = props => {

    const [Loading, setLoading] = useState(true);

    const [VideoList, setVideoList] = useState([]);
    const [Workout, setWorkout] = useState(props.route.params.item);
    const [WorkoutType, setWorkoutType] = useState(props.route.params.type ? props.route.params.type : 0)

    const [ShowAlert, setShowAlert] = useState(false);
    const [AlertSuccessTitle, setAlertSuccessTitle] = useState("");
    const [AlertSuccessSubTitle, setAlertSuccessSubTitle] = useState("");


    const getVideo = async (newWorkouts) => {
        let videoList = [];
        let getL = newWorkouts;
        let newL = []

        getL.map((item, i) => {
            newL.push({ ...item, index: i })
        })

        newL.forEach((move) => {
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
                    setTimeout(() => {
                        Alert.alert('Hata', 'Bazı videolar yüklenemedi, lütfen internet bağlantınızı kontrol edin.');
                    }, 200);
                })
        })
        const int = setInterval(() => {
            if (videoList.length === newWorkouts.length) {
                setVideoList(videoList.sort((a, b) => a.index - b.index))
                setLoading(false);
                clearInterval(int)
            }
        }, 500);
    }


    useEffect(() => {
        getMyWorkouts();
    }, [])


    const getMyWorkouts = async () => {
        setLoading(true);

        if (Workout !== undefined) {
            getVideo(Workout.moves);
        }

    }

    return (
        <ImageBackground style={{ height: height, width: width }} resizeMode="cover" source={require('../../img/bg.jpg')}>
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="light-content" />
                <SpinnerLoading Loading={Loading} />

                <SCLAlert
                    theme="success"
                    show={ShowAlert}
                    title={AlertSuccessTitle}
                    subtitle={AlertSuccessSubTitle}
                >
                    <SCLAlertButton theme="success" onPress={() => setShowAlert(!ShowAlert)}>Tamam</SCLAlertButton>
                </SCLAlert>

                <View style={styles.header} >
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => props.navigation.goBack()}>
                            <Icon name="keyboard-arrow-left" color="#FFF" size={42} style={{ marginRight: 5 }} />
                        </TouchableOpacity>
                        <Text style={styles.headerText}>Antrenman Listesi</Text>
                    </View>
                </View>

                <View style={{ flex: 1 }}>

                    {!Loading && VideoList.length > 1 &&
                        <>
                            <FlatList style={{ height: 'auto', width: width, paddingHorizontal: 20 }}
                                scrollEnabled={true}
                                data={VideoList}
                                ListHeaderComponent={() => {
                                    let workoutTime = VideoList.reduce(function (prev, current) {
                                        return prev + +parseFloat(current.duration)
                                    }, 0)
                                    return (
                                        <>
                                            <View style={{
                                                height: 'auto',
                                                width: '100%',
                                                borderRadius: 18,
                                                marginTop: 10,
                                                marginBottom: 10
                                            }}>
                                                <Image
                                                    resizeMode="cover"
                                                    source={{ uri: 'https://www.lanochefithall.com/assets/img/usenme.jpg' }}
                                                    style={{
                                                        width: '100%',
                                                        height: 250,
                                                        borderRadius: 18
                                                    }}
                                                />
                                                <LinearGradient
                                                    start={{ x: 1, y: 1 }}
                                                    end={{ x: 1, y: 1 }}
                                                    colors={['rgba(0,0,0,0.6)', 'transparent']}
                                                    style={{
                                                        position: 'absolute',
                                                        borderRadius: 18,
                                                        width: '100%',
                                                        height: 250
                                                    }}
                                                />
                                                <View style={{ position: 'absolute', top: 15, paddingHorizontal: 20 }}>
                                                    <Text style={{
                                                        fontFamily: 'SFProDisplay-Medium',
                                                        fontSize: 14,
                                                        textAlign: 'justify',
                                                        lineHeight: 18,
                                                        color: '#FFF',
                                                    }}>{String(Workout.bannerDescription !== undefined && Workout.bannerDescription)}</Text>
                                                </View>

                                                <View style={{
                                                    flexDirection: 'row',
                                                    width: '100%',
                                                    justifyContent: 'space-between',
                                                    paddingHorizontal: 20,
                                                    position: 'absolute',
                                                    bottom: 15
                                                }}>

                                                    <View style={{
                                                        flexDirection: 'row',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        marginRight: 10
                                                    }}>
                                                        <Icon name="timer" color="#FFF" size={20} />
                                                        <Text style={{
                                                            fontFamily: 'SFProDisplay-Medium',
                                                            fontSize: 13,
                                                            color: '#FFF',
                                                            marginLeft: 5
                                                        }}>{moment.utc(workoutTime * 1000).format('mm:ss')} dk.</Text>
                                                    </View>

                                                    <View style={{
                                                        flexDirection: 'row',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        marginRight: 10
                                                    }}>
                                                        <Icon name="directions-run" color="#FFF" size={20} />
                                                        <Text style={{
                                                            fontFamily: 'SFProDisplay-Medium',
                                                            fontSize: 13,
                                                            color: '#FFF',
                                                            marginLeft: 5
                                                        }}>{Workout.kcal} kcal</Text>
                                                    </View>

                                                    <View style={{
                                                        flexDirection: 'row',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        marginRight: 10
                                                    }}>
                                                        <Icon name="star" color="#FFF" size={20} />
                                                        <Text style={{
                                                            fontFamily: 'SFProDisplay-Medium',
                                                            fontSize: 13,
                                                            color: '#FFF',
                                                            marginLeft: 5
                                                        }}>{Workout.point} puan</Text>
                                                    </View>
                                                </View>

                                            </View>

                                            <TouchableOpacity onPress={() => {
                                                if (VideoList.length !== 0) {
                                                    props.navigation.navigate('WorkoutSpecial', { VideoList: VideoList, key: Workout.id, type: WorkoutType })
                                                } else if (Workout.completed === true) {
                                                    Alert.alert('Uyarı', 'Bu antrenman zaten tamamlanmış.');
                                                }
                                                else {
                                                    Alert.alert('Hata', 'Bu antrenmanda hiç video yok.');
                                                }
                                            }}
                                                style={{ paddingVertical: 15, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                                <Text style={{
                                                    fontFamily: 'SFProDisplay-Medium',
                                                    fontSize: 15,
                                                    color: 'yellow',
                                                    marginRight: 10
                                                }}
                                                >Antrenmanı Yap</Text>
                                                <Icon name="keyboard-arrow-right" color="yellow" size={26} />
                                            </TouchableOpacity>
                                        </>
                                    )
                                }}
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
                                                    {item.type === "time" ?
                                                        <View style={{ marginTop: 5, flexDirection: 'row', width: '100%', alignItems: 'center' }}>
                                                            <Icon name="timer" color="#FFF" size={20} />
                                                            <Text numberOfLines={2} style={{
                                                                fontFamily: 'SFProDisplay-Medium',
                                                                fontSize: 13,
                                                                color: '#FFF',
                                                                marginLeft: 5
                                                            }}>{item.set + ' Set, ' + item.time + ' Saniye'}</Text>
                                                        </View>
                                                        :
                                                        <View style={{ marginTop: 5, flexDirection: 'row', width: '100%', alignItems: 'center' }}>
                                                            <Icon name="replay" color="#FFF" size={20} />
                                                            <Text numberOfLines={2} style={{
                                                                fontFamily: 'SFProDisplay-Medium',
                                                                fontSize: 13,
                                                                color: '#FFF',
                                                                marginLeft: 5
                                                            }}>{item.set + ' Set, ' + item.reps + ' Tekrar'}</Text>
                                                        </View>
                                                    }

                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    )
                                }}
                            />
                        </>
                    }
                </View>
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
    },
    circleHeaderText: {
        fontFamily: 'SFProDisplay-Medium',
        fontSize: 28,
        color: '#FFF'
    },
    circleSubText: {
        marginTop: 15,
        textAlign: 'center',
        fontFamily: 'SFProDisplay-Medium',
        fontSize: 12,
        color: '#FFF'
    },
    targetHeader: {
        textAlign: 'center',
        fontFamily: 'SFProDisplay-Medium',
        fontSize: 16,
        color: '#FFF',
        marginBottom: 5
    },
    targetText: {
        marginTop: 10,
        textAlign: 'center',
        fontFamily: 'SFProDisplay-Medium',
        fontSize: 16,
        color: '#FFF'
    },
    targetSubText: {
        marginTop: 5,
        textAlign: 'center',
        fontFamily: 'SFProDisplay-Medium',
        fontSize: 12,
        color: '#FFF'
    },
})
export default AntrenmanList;