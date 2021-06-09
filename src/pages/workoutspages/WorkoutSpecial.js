import React, { useState, useEffect, useLayoutEffect } from 'react'
import { View, Text, StyleSheet, StatusBar, Image, SafeAreaView, ScrollView, Alert, TouchableOpacity, ImageBackground, Animated, Dimensions, FlatList, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SpinnerLoading from '../../components/SpinnerLoading';
import Video from 'react-native-video';
import Modal from 'react-native-modal';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'
import moment from 'moment';
import { database2, auth2 } from '../../config/config';
import { KeyboardAwareView } from 'react-native-keyboard-aware-view'
import { SCLAlert, SCLAlertButton } from 'react-native-scl-alert';

const { height, width } = Dimensions.get("window");

const WorkoutVideo = props => {

    const [Loading, setLoading] = useState(true);
    const [VideoLoading, setVideoLoading] = useState(false);
    const [LoadingSave, setLoadingSave] = useState(false);

    const [VideoList, setVideoList] = useState(props.route.params.VideoList !== null && props.route.params.VideoList !== undefined ? props.route.params.VideoList.filter(item => item.completed === false) : []);
    const [SelectedMove, setSelectedMove] = useState(VideoList !== null && VideoList !== undefined && VideoList[0]);
    const [SelectedIndex, setSelectedIndex] = useState(0);
    const [WorkoutKey, setWorkoutKey] = useState(props.route.params.key ? props.route.params.key : '');

    const [playVideo, setplayVideo] = useState(false);

    const [ShowModal, setShowModal] = useState(true);
    const [FinishModal, setFinishModal] = useState(false);

    const [initialTime, setInitialTime] = React.useState(0);
    const [startTimer, setStartTimer] = React.useState(false);

    const [MolaTimerDuration, setMolaTimerDuration] = useState(SelectedMove.pause ? SelectedMove.pause : 10);
    const [ShowMolaTimer, setShowMolaTimer] = useState(false);
    const [TotalKcal, setTotalKcal] = useState(0);
    const [TotalPoint, setTotalPoint] = useState(0);
    const [MevcutSet, setMevcutSet] = useState(1);
    const [ShowPopup, setShowPopup] = useState(false);

    const [WorkoutType, setWorkoutType] = useState(props.route.params.type ? props.route.params.type : 0);

    const [ShowAlert, setShowAlert] = useState(false);

    const ShowFinishModal = () => {
        setFinishModal(!FinishModal);

        const newItem = SelectedMove;

        const path = WorkoutType === 0 ? `users/${auth2.currentUser.uid}/workouts/${WorkoutKey}/moves` : `users/${auth2.currentUser.uid}/favorites/workouts/${WorkoutKey}/moves`

        database2.ref(path).orderByChild("id").equalTo(newItem.id)
            .once('value')
            .then((res) => {
                let number = Object.keys(res.val())[1]
                database2.ref(`${res.ref.path}/${number}`).update({
                    completed: true
                })
                    .then(() => console.log('ok'))
                    .catch((err) => console.log('update err:', err))
            })
            .catch((err) => console.log('hata: ', err))

    }

    const changeMove = (index) => {

        if (index !== VideoList.length && index !== -1 && index !== VideoList.length) {
            if (VideoList[index].completed === true) {
                setSelectedIndex(index + 1)
                setVideoLoading(false);
                setSelectedMove(VideoList[index + 1])
            } else {
                setSelectedIndex(index)
                setVideoLoading(false);
                setSelectedMove(VideoList[index])
            }
        } else if (index === VideoList.length) {
            Alert.alert('Tamamlandı', 'Antrenman bitirilsin mi?', [
                { text: 'Vazgeç', style: 'destructive' },
                { text: 'Evet', onPress: () => ShowFinishModal(), style: 'default' },
            ])
        }

    }

    const completeMove = async () => {
        var newItem = SelectedMove;

        if (newItem.completed === true) {
            setMevcutSet(1);
            changeMove(SelectedIndex + 1);
        } else {
            if (newItem.set === MevcutSet) {
                var caloriesForMove = 0;
                var pointForMove = 0;

                if (newItem.type === "reps") {
                    caloriesForMove = parseFloat(parseFloat(newItem.set) * parseFloat(newItem.reps));
                    pointForMove = parseFloat(newItem.set) * parseFloat(newItem.reps);
                    setTotalPoint(TotalPoint + pointForMove)
                    setTotalKcal(TotalKcal + caloriesForMove);
                } else {
                    caloriesForMove = parseFloat(newItem.time) / parseFloat(1);
                    pointForMove = parseFloat(newItem.time) / parseFloat(10);
                    setTotalPoint(TotalPoint + pointForMove)
                    setTotalKcal(TotalKcal + caloriesForMove);
                }
                if (SelectedIndex !== VideoList.length && SelectedIndex !== -1 && SelectedIndex !== VideoList.length) {

                } else {
                    setMevcutSet(1);
                    changeMove(SelectedIndex + 1);
                }

                const options = VideoList

                options.forEach((newitem) => {
                    if (newitem.completed === false) {
                        newitem.completed === true;
                    }
                })

                var tempItem = newItem;
                tempItem.completed = true;
                const tempArr = [...VideoList];
                setVideoList(tempArr);

                const path = WorkoutType === 0 ? `users/${auth2.currentUser.uid}/workouts/${WorkoutKey}/moves` : `users/${auth2.currentUser.uid}/favorites/workouts/${WorkoutKey}/moves`

                database2.ref(path).orderByChild("id").equalTo(newItem.id)
                    .once('value')
                    .then((res) => {
                        let number = Object.keys(res.val())[0]
                        database2.ref(`${res.ref.path}/${number}`).update({
                            completed: true
                        })
                            .then(() => console.log('ok'))
                            .catch((err) => console.log('update err:', err))
                    })
                    .catch((err) => console.log('hata: ', err))

            } else {
                setMevcutSet(MevcutSet + 1)
            };
            if (SelectedIndex === VideoList.length - 1 && SelectedMove.set === MevcutSet) {

            } else {
                setMolaTimerDuration(newItem.pause ? newItem.pause : 15)
                setplayVideo(false);
                setStartTimer(false);
                setShowMolaTimer(true);
            }
        }


    }

    const completeTraining = () => {

        setplayVideo(false);
        setStartTimer(false);
        setLoadingSave(true);

        var caloriesForMove = 0;
        var pointForMove = 0;

        VideoList.forEach((newItem) => {
            if (newItem.type === "reps") {
                caloriesForMove += parseFloat(newItem.yapilanset !== undefined && newItem.yapilanset !== 0 ? newItem.yapilanset : 1) * parseFloat(newItem.yapilanreps !== undefined ? newItem.yapilanreps : 1);
                pointForMove += parseFloat(newItem.yapilanset !== undefined && newItem.yapilanset !== 0 ? newItem.yapilanset : 1) * parseFloat(newItem.yapilanreps !== undefined ? newItem.yapilanreps : 1);
            } else {
                caloriesForMove += parseFloat(newItem.yapilantime !== undefined && newItem.yapilantime !== 0 ? newItem.yapilantime : 1) / parseFloat(1);
                pointForMove += parseFloat(newItem.yapilantime !== undefined && newItem.yapilantime !== 0 ? newItem.yapilantime : 1) / parseFloat(10);
            }
        })

        var data = {
            calories: parseFloat(caloriesForMove),
            date: moment().format("DD/MM/YYYYTHH:mm:ss"),
            time: parseFloat(initialTime),
            point: parseFloat(pointForMove),
            workoutid: WorkoutKey,
            workouttype: 'special'
        }

        const path = WorkoutType === 0 ? `users/${auth2.currentUser.uid}/workouts/${WorkoutKey}` : `users/${auth2.currentUser.uid}/favorites/workouts/${WorkoutKey}`

        database2.ref(path).once('value')
            .then((res) => {
                const olditem = res.val();
                if (olditem.completedDate !== undefined && olditem.completed !== undefined) {
                    database2.ref(path)
                        .update({
                            calories: parseFloat(olditem.calories) + parseFloat(caloriesForMove),
                            completed: true,
                            completedDate: moment().format("DD/MM/YYYYTHH:mm:ss"),
                            time: parseFloat(olditem.time) + parseFloat(initialTime),
                            point: parseFloat(olditem.point) + parseFloat(pointForMove)
                        })
                        .then(async () => {
                            await database2.ref('users_points/' + auth2.currentUser.uid + '/' + WorkoutKey).set(data)
                                .then(() => {
                                    setLoadingSave(false);
                                    props.navigation.navigate('Home');
                                    setTimeout(() => {
                                        Alert.alert('Tebrikler', 'Antrenmanı başarıyla tamamladınız.', [
                                            { text: 'Tamam', onPress: () => null, style: 'default' }
                                        ]);
                                    }, 200);
                                })
                                .catch((err) => {
                                    setLoadingSave(false);
                                    setTimeout(() => {
                                        Alert.alert('Hata', String(err.message));
                                    }, 300);
                                })
                        })
                        .catch((err) => {
                            setLoading(false);
                            setLoadingSave(false);
                            setTimeout(() => {
                                Alert.alert('Hata', String(err.message));
                            }, 200);
                        })
                } else {
                    database2.ref(path)
                        .update({
                            calories: parseFloat(caloriesForMove),
                            completed: true,
                            completedDate: moment().format("DD/MM/YYYYTHH:mm:ss"),
                            time: parseFloat(initialTime),
                            point: parseFloat(pointForMove)
                        })
                        .then(async () => {
                            await database2.ref('users_points/' + auth2.currentUser.uid + '/' + WorkoutKey).set(data)
                                .then(() => {
                                    setLoadingSave(false);
                                    props.navigation.navigate('Home');
                                    setTimeout(() => {
                                        Alert.alert('Tebrikler', 'Antrenmanı başarıyla tamamladınız.', [
                                            { text: 'Tamam', onPress: () => null, style: 'default' }
                                        ]);
                                    }, 200);
                                })
                                .catch((err) => {
                                    setLoadingSave(false);
                                    setTimeout(() => {
                                        Alert.alert('Hata', String(err.message));
                                    }, 300);
                                })
                        })
                        .catch((err) => {
                            setLoading(false);
                            setLoadingSave(false);
                            setTimeout(() => {
                                Alert.alert('Hata', String(err.message));
                            }, 200);
                        })
                }
            })
    }

    const showThumb = (index) => {
        props.navigation.navigate('MoveThumb', { item: VideoList[index] })
    }

    const MolaTimer = () => (
        <CountdownCircleTimer
            isPlaying={ShowMolaTimer}
            duration={MolaTimerDuration}
            onComplete={() => {
                setShowMolaTimer(!ShowMolaTimer);
                setplayVideo(true)
                setStartTimer(true);
                changeMove(SelectedIndex + 1)
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
        if (VideoList.length === props.route.params.VideoList.length) {
            setLoading(false);
        } else {
            setTimeout(() => {
                setLoading(false);
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
        <ImageBackground style={{ height: height, width: width }} resizeMode="cover" source={require('../../img/bg.jpg')}>
            <StatusBar barStyle="light-content" />

            <SafeAreaView style={styles.container}>
                <SpinnerLoading Loading={Loading} />
                <SpinnerLoading color="yellow" text="Antrenman kaydediliyor..." Loading={LoadingSave} />
                <SpinnerLoading Loading={VideoLoading} />

                <SCLAlert
                    theme="warning"
                    show={ShowAlert}
                    title="Antrenmandan Çık"
                    subtitle="Antrenmandan çıkmak istiyor musunuz?"
                >
                    <SCLAlertButton theme="warning" onPress={() => {
                        setShowAlert(false);
                        props.navigation.goBack();
                    }}>Antrenmandan Çık</SCLAlertButton>
                    <SCLAlertButton theme="default" onPress={() => setShowAlert(!ShowAlert)}>Vazgeç</SCLAlertButton>
                </SCLAlert>

                <Modal style={{ marginTop: 'auto' }}
                    animationIn="fadeIn"
                    animationOut="fadeOut"
                    isVisible={ShowPopup}
                    animationInTiming={500}
                    animationOutTiming={500}
                    backdropOpacity={0.7}
                >
                    <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#000', borderColor: '#FFF', borderWidth: 2, padding: 20, borderRadius: 20 }}>

                        <View style={{ paddingVertical: 5, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={styles.popupText}>{SelectedMove !== undefined ? SelectedMove.info : ""}</Text>
                        </View>

                        <TouchableOpacity onPress={() => setShowPopup(!ShowPopup)} style={{ marginTop: 20, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={[styles.popupText, { color: '#FFF' }]}>Kapat</Text>
                        </TouchableOpacity>

                    </View>
                </Modal>

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


                <Modal style={{ margin: 0, backgroundColor: '#000' }}
                    animationIn="fadeIn"
                    animationOut="fadeOut"
                    isVisible={FinishModal}
                    animationInTiming={500}
                    animationOutTiming={500}
                    backdropOpacity={1}
                >
                    <ImageBackground source={require('../../img/bg.jpg')} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <KeyboardAwareView animated={true} style={{ width: '100%', height: '100%' }} >
                            <View style={{ width: '100%', height: '100%', paddingHorizontal: 20 }}>

                                <View style={{ marginTop: 60, flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,255,0,0.05)', padding: 10, borderRadius: 12 }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                        <Icon name="directions-run" color="#FFF" size={24} />
                                        <Text style={[styles.headerTimerText, { fontSize: 14 }]}>{String(TotalKcal)} kalori</Text>
                                    </View>

                                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                        <Icon name="star" color="#FFF" size={24} />
                                        <Text style={[styles.headerTimerText, { fontSize: 14 }]}>{String(TotalPoint)} puan</Text>
                                    </View>

                                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                        <Icon name="timer" color="#FFF" size={24} />
                                        <Text style={[styles.headerTimerText, { fontSize: 14 }]}>{String(initialTime)} sn.</Text>
                                    </View>
                                </View>

                                <FlatList
                                    style={{ width: '100%', height: 'auto', marginTop: 15, marginBottom: 40 }}
                                    scrollEnabled={true}
                                    showsHorizontalScrollIndicator={false}
                                    showsVerticalScrollIndicator={false}
                                    data={VideoList}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={({ item, index }) => {
                                        return (
                                            <View
                                                style={{
                                                    marginBottom: 10,
                                                    padding: 20,
                                                    paddingVertical: 15,
                                                    backgroundColor: 'rgba(0,0,0,0.2)',
                                                    flexDirection: 'row',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    height: 'auto',
                                                    width: '100%',
                                                    borderRadius: 18
                                                }}>
                                                <View style={{ flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                                    <Text style={{
                                                        fontFamily: 'SFProDisplay-Bold',
                                                        fontSize: 16,
                                                        color: '#FFF',
                                                        width: '100%'
                                                    }}>{item.title}</Text>

                                                    <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, width: '100%' }}>
                                                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '50%' }}>
                                                            <TextInput
                                                                style={{
                                                                    borderWidth: 1,
                                                                    borderColor: 'white',
                                                                    textAlign: 'center',
                                                                    padding: 10,
                                                                    color: "#FFF",
                                                                    borderRadius: 12,
                                                                    fontFamily: 'SFProDisplay-Medium',
                                                                    fontSize: 14,
                                                                    marginRight: 10,
                                                                    width: 80
                                                                }}
                                                                textAlign="center"
                                                                placeholderTextColor="#FFF"
                                                                autoCorrect={false}
                                                                autoCapitalize="none"
                                                                allowFontScaling={false}
                                                                maxLength={2}
                                                                placeholder={item.type !== 'reps' ? String(item.reps) : String(item.time)}
                                                                returnKeyType={"done"}
                                                                onChangeText={text => {
                                                                    let newItem = item;
                                                                    var tempItem = newItem;

                                                                    if (newItem.type === "reps") {
                                                                        newItem.yapilanreps === text !== "" ? parseFloat(text) : parseFloat(item.reps);
                                                                    } else {
                                                                        tempItem.yapilantime = text !== "" ? parseFloat(text) : parseFloat(item.time);
                                                                    }

                                                                    const tempArr = [...VideoList];
                                                                    setVideoList(tempArr);
                                                                }}
                                                                keyboardType="decimal-pad"
                                                            />

                                                            <Text style={{
                                                                marginTop: 5,
                                                                fontFamily: 'SFProDisplay-Medium',
                                                                fontSize: 14,
                                                                color: '#FFF'
                                                            }}>{item.type !== 'time' ? String(item.reps) + ' Tekrar' : String(item.time) + ' Saniye'}</Text>
                                                        </View>

                                                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '50%' }}>
                                                            <TextInput
                                                                style={{
                                                                    borderWidth: 1,
                                                                    borderColor: 'white',
                                                                    textAlign: 'center',
                                                                    padding: 10,
                                                                    color: "#FFF",
                                                                    borderRadius: 12,
                                                                    fontFamily: 'SFProDisplay-Medium',
                                                                    fontSize: 14,
                                                                    marginRight: 10,
                                                                    width: 80
                                                                }}
                                                                textAlign="center"
                                                                placeholderTextColor="#FFF"
                                                                autoCorrect={false}
                                                                autoCapitalize="none"
                                                                allowFontScaling={false}
                                                                maxLength={2}
                                                                placeholder={String(item.set)}
                                                                returnKeyType={"done"}
                                                                onChangeText={text => {
                                                                    let newItem = item;
                                                                    var tempItem = newItem;
                                                                    tempItem.yapilanset = text !== "" ? parseFloat(text) : parseFloat(item.set);
                                                                    const tempArr = [...VideoList];
                                                                    setVideoList(tempArr);
                                                                }}
                                                                keyboardType="decimal-pad"
                                                            />

                                                            <Text style={{
                                                                marginTop: 5,
                                                                fontFamily: 'SFProDisplay-Medium',
                                                                fontSize: 14,
                                                                color: '#FFF'
                                                            }}>{String(item.set) + ' Set'}</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                        )
                                    }}

                                />
                            </View>

                            <TouchableOpacity
                                style={{ position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: 'yellow', paddingVertical: 10, justifyContent: 'center', alignItems: 'center', height: 60 }}
                                onPress={() => {
                                    completeTraining();
                                }}>
                                <Text style={{ fontFamily: 'SFProDisplay-Medium', fontSize: 16, color: '#000' }}>Bilgileri Onayla</Text>
                            </TouchableOpacity>

                        </KeyboardAwareView>
                    </ImageBackground>
                </Modal>

                <View style={styles.header} >
                    <TouchableOpacity onPress={() => setShowAlert(true)} style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                        <Icon name="keyboard-arrow-left" color="#FFF" size={42} style={{ marginRight: 15 }} />
                        <Text style={styles.headerText}>Antrenman</Text>
                    </TouchableOpacity>

                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                        <Icon name="directions-run" color="#FFF" size={24} />
                        <Text style={[styles.headerTimerText, { marginRight: 15 }]}>{String(TotalKcal)} kcal</Text>

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

                                <ScrollView
                                    style={{ width: '100%', marginTop: 20 }}
                                    showsHorizontalScrollIndicator={false}
                                    showsVerticalScrollIndicator={false}
                                >
                                    {!Loading && VideoList.length !== 0 &&
                                        <FlatList
                                            style={{ paddingBottom: 150, width: '100%' }}
                                            scrollEnabled={true}
                                            showsHorizontalScrollIndicator={false}
                                            showsVerticalScrollIndicator={false}
                                            data={VideoList}
                                            keyExtractor={(item, index) => index.toString()}
                                            ListHeaderComponentStyle={{ marginBottom: 20, width: '100%' }}
                                            stickyHeaderIndices={[0, 6, 13]}
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

                                                            <TouchableOpacity onPress={() => {
                                                                setShowPopup(!ShowPopup)
                                                            }}>
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
                                                                        }}>{String(SelectedMove.reps)} Tekrar, {String(SelectedMove.set)}/
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
                                                                        }}>{String(SelectedMove.time)} Saniye {String(SelectedMove.set)}/
                                                                        <Text style={{
                                                                                fontFamily: 'SFProDisplay-Bold',
                                                                                fontSize: 15,
                                                                                color: 'yellow'
                                                                            }}>{MevcutSet}
                                                                                <Text style={{
                                                                                    fontFamily: 'SFProDisplay-Medium',
                                                                                    fontSize: 15,
                                                                                    color: '#FFF'
                                                                                }}> Set </Text></Text>
                                                                        </Text>
                                                                    </>
                                                                }
                                                            </View>

                                                            <View style={{
                                                                flexDirection: 'row',
                                                                justifyContent: 'space-between',
                                                                alignItems: 'center'
                                                            }}>
                                                                <TouchableOpacity style={{ marginRight: 10 }}
                                                                    onPress={() => Alert.alert('Hareketi Atla', 'Hareket atlansın mı?',
                                                                        [
                                                                            { text: 'Vazgeç', onPress: () => null, style: 'destructive' },
                                                                            {
                                                                                text: 'Evet', onPress: () => {
                                                                                    changeMove(SelectedIndex + 1);
                                                                                    setMevcutSet(1);
                                                                                }, style: 'default'
                                                                            }
                                                                        ])}>
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
                                            renderItem={({ item, index }) => {
                                                console.log('itemmm: ', item)
                                                return (
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
                                                                    opacity: item.completed === true ? 0.2 : 1,
                                                                    width: 60,
                                                                    height: 60,
                                                                    borderRadius: 8
                                                                }}
                                                            />
                                                            <View style={{ marginLeft: 20 }}>

                                                                <Text numberOfLines={1} style={{
                                                                    fontFamily: 'SFProDisplay-Bold',
                                                                    fontSize: 16,
                                                                    color: item.completed === true ? '#3A3A3A' : '#FFF'
                                                                }}>{item.title}</Text>

                                                                <Text style={{
                                                                    marginTop: 5,
                                                                    fontFamily: 'SFProDisplay-Medium',
                                                                    fontSize: 12,
                                                                    color: item.completed === true ? '#3A3A3A' : '#FFF'
                                                                }}>{String(item.set)} Set, {item.type !== 'time' ? String(item.reps) + ' Tekrar' : String(item.time) + ' Saniye'}</Text>

                                                            </View>
                                                        </View>
                                                    </TouchableOpacity>
                                                )
                                            }}

                                        />
                                    }
                                </ScrollView>
                            </>
                        }
                    </View>
                </View>
            </SafeAreaView>

            {
                SelectedIndex === VideoList.length - 1 && SelectedMove.set === MevcutSet &&
                <View style={{
                    flexDirection: 'row',
                    width: '100%',
                    height: 60,
                    backgroundColor: '#000',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <TouchableOpacity onPress={() => {
                        setStartTimer(false);
                        setTimeout(() => {
                            setFinishModal(!FinishModal);
                        }, 200);
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
            }


        </ImageBackground >
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    popupText: {
        fontFamily: 'SFProDisplay-Medium',
        fontSize: 15,
        color: '#FFF',
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