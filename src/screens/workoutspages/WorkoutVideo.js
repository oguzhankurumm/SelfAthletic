import React, { useState, useEffect, useLayoutEffect } from 'react'
import { View, Text, StyleSheet, StatusBar, Image, SafeAreaView, ScrollView, Alert, TouchableOpacity, ImageBackground, Animated, TouchableHighlight, Dimensions, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SpinnerLoading from '../../components/SpinnerLoading';
import Video from 'react-native-video';
import Modal from 'react-native-modal';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'
import moment from 'moment';
import { database, auth } from '../../config/config';
import { SCLAlert, SCLAlertButton } from 'react-native-scl-alert';
import { activateKeepAwake, deactivateKeepAwake } from "@sayem314/react-native-keep-awake";

const { height, width } = Dimensions.get("window");

const WorkoutVideo = props => {
    activateKeepAwake();

    const [Loading, setLoading] = useState(true);
    const [VideoLoading, setVideoLoading] = useState(false);
    const [LoadingSave, setLoadingSave] = useState(false);

    const [SelectedMove, setSelectedMove] = useState(props.route.params.VideoList !== null && props.route.params.VideoList !== undefined ? props.route.params.VideoList[0] : []);
    const [SelectedIndex, setSelectedIndex] = useState(0);
    const [VideoList, setVideoList] = useState(props.route.params.VideoList !== null && props.route.params.VideoList !== undefined ? props.route.params.VideoList : []);
    const [Workouts, setWorkouts] = useState(props.route.params.Workouts !== null && props.route.params.Workouts !== undefined ? props.route.params.Workouts : []);

    const [finishDisabled, setfinishDisabled] = useState(false);
    const [FinishModal, setFinishModal] = useState(false);

    const [CompletedList, setCompletedList] = useState([]);
    const [TotalPoint, setTotalPoint] = useState(0);
    const [TotalKcal, setTotalKcal] = useState(0);

    const [playVideo, setplayVideo] = useState(false);

    const [ShowModal, setShowModal] = useState(false);

    const [initialTime, setInitialTime] = React.useState(0);
    const [startTimer, setStartTimer] = React.useState(false);
    const [MolaTimerDuration, setMolaTimerDuration] = useState(SelectedMove.pause ? SelectedMove.pause : 10);
    const [ShowMolaTimer, setShowMolaTimer] = useState(false);
    const [ShowNextAlert, setShowNextAlert] = useState(false);
    const [ShowEndAlert, setShowEndAlert] = useState(false);

    const [MevcutSet, setMevcutSet] = useState(1);
    const [ShowAlert, setShowAlert] = useState(false);
    const [SelectedTimer, setSelectedTimer] = useState(SelectedMove.type === "time" ? SelectedMove.time : 0);
    const [StartSelectedTimer, setStartSelectedTimer] = useState(false);

    const changeMove = (index) => {

        if (index !== VideoList.length && index !== -1 && index !== VideoList.length) {
            setSelectedIndex(index)
            setVideoLoading(false);
            setSelectedMove(VideoList[index])
        }

        if (index === VideoList.length) {
            setShowEndAlert(true);
        }

    }

    const completeMove = () => {
        var newItem = SelectedMove;

        var caloriesForMove = 0;
        var pointForMove = 0;

        if (newItem.type === "reps") {
            caloriesForMove = parseFloat(newItem.reps);
            pointForMove = parseFloat(newItem.reps);
            setTotalPoint(TotalPoint + pointForMove)
            setTotalKcal(TotalKcal + caloriesForMove);
        } else {
            caloriesForMove = parseFloat(parseFloat(newItem.time) / parseFloat(1)) / parseFloat(newItem.set);
            pointForMove = parseFloat(parseFloat(newItem.time) / parseFloat(10)) / parseFloat(newItem.set);
            setTotalPoint(TotalPoint + pointForMove)
            setTotalKcal(TotalKcal + caloriesForMove);
        }

        if (newItem.set === MevcutSet) {
            setMevcutSet(1);
            changeMove(SelectedIndex + 1);
        } else {
            setMevcutSet(MevcutSet + 1);
        };

        setMolaTimerDuration(newItem.pause ? newItem.pause : 15)
        setplayVideo(false);
        setShowMolaTimer(true);

    }

    const showThumb = (index) => {
        props.navigation.navigate('MoveThumb', { item: VideoList[index] })
    }

    const completeTraining = async () => {
        setStartTimer(false);
        setLoadingSave(true);
        setfinishDisabled(true);

        let sum = CompletedList.reduce(function (prev, current) {
            return prev + +parseFloat(current.point)
        }, 0);

        var data = {
            calories: parseFloat(Workouts.calories),
            date: moment().format("DD/MM/YYYYTHH:mm:ss"),
            time: parseFloat(initialTime),
            point: parseFloat(sum),
            workoutid: Workouts.id
        }

        await database().ref('users_points' + '/' + auth().currentUser.uid + '/' + Workouts.id).set(data)
            .then(() => {
                setLoadingSave(false);
                setTimeout(() => {
                    props.navigation.navigate('Home');
                }, 500);
            })
            .catch((err) => {
                setLoadingSave(false);
                setfinishDisabled(false);
                setTimeout(() => {
                    Alert.alert('Hata', String(err.message));
                }, 300);
            })
    }

    const MolaTimer = () => (
        <CountdownCircleTimer
            isPlaying={ShowMolaTimer}
            duration={MolaTimerDuration}
            onComplete={() => {
                setShowMolaTimer(!ShowMolaTimer);
                setplayVideo(true)
            }}
            colors={[
                ['green', 0.4],
                ['yellow', 0.4]
            ]}
        >
            {({ remainingTime, animatedColor }) => (
                <Animated.Text style={{ fontFamily: 'SFProDisplay-Bold', fontSize: 18, color: animatedColor }}>
                    {remainingTime}
                </Animated.Text>
            )}
        </CountdownCircleTimer>
    )

    const UrgeWithPleasureComponent = () => (
        <CountdownCircleTimer
            isPlaying={ShowModal}
            duration={5}
            onComplete={() => {
                setShowModal(!ShowModal);
                setplayVideo(true)
                setInitialTime(1);
                setStartTimer(true);
            }}
            colors={[
                ['green', 0.4],
                ['yellow', 0.4]
            ]}
        >
            {({ remainingTime, animatedColor }) => (
                <Animated.Text style={{ fontFamily: 'SFProDisplay-Bold', fontSize: 18, color: animatedColor }}>
                    {remainingTime}
                </Animated.Text>
            )}
        </CountdownCircleTimer>
    )

    useLayoutEffect(() => {
        if (VideoList.length !== 0) {
            // console.log('Workouts: ', props.route.params.VideoList[0])
            setLoading(false);
            setTimeout(() => {
                setShowModal(true);
            }, 1000);
        } else {
            setTimeout(() => {
                setLoading(false);
                Alert.alert('Hata', 'Videolar yüklenemedi.')
            }, 3000);
        }
    }, [])

    useEffect(() => {
        if (startTimer === true) {
            setTimeout(() => {
                setInitialTime(initialTime + 1);
            }, 1000);
        }
    }, [initialTime, startTimer]);

    return (
        <ImageBackground style={{ height: height, width: width }} resizeMode="cover" source={require('../../assets/img/bg.jpg')}>
            <StatusBar barStyle="light-content" />

            <SafeAreaView style={styles.container}>
                <SpinnerLoading Loading={Loading} />
                <SpinnerLoading color="yellow" text="Antrenman kaydediliyor..." Loading={LoadingSave} />
                <SpinnerLoading Loading={VideoLoading} />

                <SCLAlert
                    theme="warning"
                    show={ShowAlert}
                    title="Antrenmandan Çık"
                    subtitle="Çıkarsanız kaydedilmeyecektir."
                >
                    <SCLAlertButton theme="warning" onPress={() => {
                        setShowAlert(false);
                        props.navigation.goBack();
                    }}>Kaydetmeden Çık</SCLAlertButton>
                    <SCLAlertButton theme="default" onPress={() => setShowAlert(!ShowAlert)}>Vazgeç</SCLAlertButton>
                </SCLAlert>

                <SCLAlert
                    theme="warning"
                    show={ShowEndAlert}
                    title="Antrenmanı Bitir"
                    subtitle="Antrenman bitirilsin mi?"
                >
                    <SCLAlertButton theme="warning" onPress={() => {
                        setShowEndAlert(false);
                        completeTraining()
                    }}>Evet, Bitir</SCLAlertButton>
                    <SCLAlertButton theme="default" onPress={() => setShowEndAlert(!ShowEndAlert)}>Vazgeç</SCLAlertButton>
                </SCLAlert>

                <SCLAlert
                    theme="warning"
                    show={ShowNextAlert}
                    title="Hareketi Atla"
                    subtitle="Hareket atlansın mı?"
                >
                    <SCLAlertButton theme="warning" onPress={() => {
                        setShowNextAlert(false);
                        changeMove(SelectedIndex + 1);
                    }}>Evet, Atla</SCLAlertButton>
                    <SCLAlertButton theme="default" onPress={() => setShowNextAlert(!ShowNextAlert)}>Vazgeç</SCLAlertButton>
                </SCLAlert>

                <Modal style={{ marginTop: 'auto' }}
                    animationIn="fadeIn"
                    animationOut="fadeOut"
                    isVisible={ShowModal}
                    animationInTiming={500}
                    animationOutTiming={500}
                    backdropOpacity={0.7}
                >
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <UrgeWithPleasureComponent />
                    </View>
                </Modal>

                <Modal style={{ marginTop: 'auto' }}
                    animationIn="fadeIn"
                    animationOut="fadeOut"
                    isVisible={ShowMolaTimer}
                    animationInTiming={500}
                    animationOutTiming={500}
                    backdropOpacity={0.7}
                >
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <MolaTimer />

                        <TouchableOpacity
                            style={{ marginTop: 30, backgroundColor: 'yellow', borderRadius: 18, paddingVertical: 10, paddingHorizontal: 20, justifyContent: 'center', alignItems: 'center' }}
                            onPress={() => {
                                setShowMolaTimer(!ShowMolaTimer);
                                setplayVideo(true);
                                setStartTimer(true);
                            }}>
                            <Text style={{ fontFamily: 'SFProDisplay-Medium', fontSize: 16, color: '#000' }}>Dinlenmeyi Atla</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>

                <View style={styles.header} >
                    <TouchableOpacity onPress={() => setShowAlert(true)} style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                        <Icon name="keyboard-arrow-left" color="#FFF" size={42} style={{ marginRight: 15 }} />
                        <Text style={styles.headerText}>Antrenman</Text>
                    </TouchableOpacity>

                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                        <Icon name="star" color="#FFF" size={24} />
                        <Text style={[styles.headerTimerText, { marginRight: 15 }]}>{String(TotalPoint)}</Text>

                        <Icon name="timer" color="#FFF" size={24} />
                        <Text style={styles.headerTimerText}>{String(initialTime)}</Text>
                    </View>
                </View>

                <View style={styles.container}>

                    <View style={{ justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, marginTop: 20 }}>

                        {!Loading &&
                            <>
                                <View style={{
                                    height: 'auto',
                                    width: '100%',
                                    borderRadius: 18
                                }}>
                                </View>

                                <View style={{ width: '100%' }}>
                                    <View style={{
                                        width: '100%',
                                        height: 200
                                    }}>
                                        {SelectedMove !== null &&
                                            <Video
                                                resizeMode="contain"
                                                useNativeControls
                                                repeat={playVideo}
                                                paused={!playVideo}
                                                shouldPlay={false}
                                                source={{ uri: SelectedMove.url }}
                                                style={{ height: 200, width: SelectedMove.width }}
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
                                        }
                                    </View>

                                </View>

                                <View style={{ width: '100%', marginTop: 20 }}>
                                    {!Loading && VideoList.length !== 0 &&
                                        < FlatList
                                            style={{ paddingBottom: 20, width: '100%' }}
                                            contentContainerStyle={{ paddingBottom: 80 }}
                                            scrollEnabled={true}
                                            showsHorizontalScrollIndicator={false}
                                            showsVerticalScrollIndicator={false}
                                            data={VideoList}
                                            keyExtractor={(item, index) => index.toString()}
                                            ListHeaderComponentStyle={{ marginBottom: 20, width: '100%' }}
                                            ListHeaderComponent={() => {
                                                return (
                                                    <>
                                                        <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,255,0,0.05)', padding: 10, borderRadius: 12 }}>
                                                            <View style={{ justifyContent: 'flex-start', alignItems: 'baseline' }}>
                                                                <Text style={{
                                                                    fontFamily: 'SFProDisplay-Bold',
                                                                    fontSize: 15,
                                                                    color: 'yellow',
                                                                    marginBottom: 5
                                                                }}>{SelectedMove.title}
                                                                </Text>
                                                                <Text style={{
                                                                    fontFamily: 'SFProDisplay-Medium',
                                                                    fontSize: 15,
                                                                    color: 'yellow',
                                                                }}>{parseFloat(SelectedIndex) + 1} / {VideoList.length}
                                                                </Text>
                                                            </View>

                                                            <TouchableOpacity onPress={() => Alert.alert('Bilgi', SelectedMove.info)}>
                                                                <Icon name="info-outline" color='white' size={20} />
                                                            </TouchableOpacity>
                                                        </View>

                                                        <View style={{ marginTop: 20, flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>

                                                            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                                                {SelectedMove.type === "reps" ?
                                                                    <>
                                                                        <Icon name="replay" color="#FFF" size={28} />
                                                                        <Text style={{
                                                                            fontFamily: 'SFProDisplay-Medium',
                                                                            fontSize: 15,
                                                                            color: '#FFF',
                                                                            marginLeft: 5
                                                                        }}>{String(SelectedMove.reps)} Tekrar, {String(SelectedMove.set)} /
                                                                            <Text style={{
                                                                                fontFamily: 'SFProDisplay-Bold',
                                                                                fontSize: 15,
                                                                                color: 'yellow'
                                                                            }}> {MevcutSet}
                                                                                <Text style={{
                                                                                    fontFamily: 'SFProDisplay-Medium',
                                                                                    fontSize: 15,
                                                                                    color: '#FFF'
                                                                                }}> Set </Text></Text>
                                                                        </Text>
                                                                    </>
                                                                    :
                                                                    <>
                                                                        <Icon name="timer" color="#FFF" size={26} />
                                                                        <Text style={{
                                                                            fontFamily: 'SFProDisplay-Medium',
                                                                            fontSize: 15,
                                                                            color: '#FFF',
                                                                            marginLeft: 5
                                                                        }}>{String(SelectedTimer)} Saniye</Text>
                                                                    </>
                                                                }
                                                            </View>

                                                            <View style={{
                                                                flexDirection: 'row',
                                                                justifyContent: 'space-between',
                                                                alignItems: 'center'
                                                            }}>
                                                                <TouchableOpacity style={{ marginRight: 10 }}
                                                                    onPress={() => setShowNextAlert(true)}>
                                                                    <Icon name="skip-next" color='white' size={38} />
                                                                </TouchableOpacity>

                                                                <TouchableOpacity
                                                                    onPress={() => completeMove()}>
                                                                    <Icon name="check" color='white' size={32} />
                                                                </TouchableOpacity>
                                                            </View>
                                                        </View>
                                                    </>
                                                )
                                            }}
                                            renderItem={({ item, index }) => (
                                                <TouchableOpacity
                                                    onPress={() => showThumb(index)}
                                                    style={{
                                                        padding: 10,
                                                        backgroundColor: item.id === SelectedMove.id ? '#2D2D2D' : null,
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

                                                            <Text style={{
                                                                marginTop: 5,
                                                                fontFamily: 'SFProDisplay-Medium',
                                                                fontSize: 12,
                                                                color: '#FFF'
                                                            }}>{String(item.set)} Set, {item.type !== 'time' ? String(item.reps) + ' Tekrar' : String(item.time) + ' Saniye'}</Text>


                                                        </View>
                                                    </View>
                                                </TouchableOpacity>
                                            )}

                                        />
                                    }
                                </View>
                            </>
                        }
                    </View>
                </View>
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
                    setFinishModal(true);
                    setStartTimer(false);
                    setShowEndAlert(true);
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
                    }}>Antrenmanı Bitir</Text>
                </TouchableOpacity>
            </View>

        </ImageBackground >
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    linearGradient: {
        position: 'absolute',
        top: 0,
        width: '100%',
        height: height
    },
    titleStyle: {
        fontFamily: 'SFProDisplay-Bold',
        justifyContent: 'flex-start',
        fontSize: 22,
        color: '#FFF'
    },
    subTitleStyle: {
        fontFamily: 'SFProDisplay-Medium',
        justifyContent: 'flex-start',
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
        fontSize: 20,
        color: '#FFF'
    }
})

export default WorkoutVideo;