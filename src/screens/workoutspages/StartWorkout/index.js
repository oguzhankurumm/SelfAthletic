import React, { useState, useEffect, useRef } from 'react'
import { View, Text, Dimensions, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';
import 'moment/locale/tr';
moment.locale('tr');
import WorkoutLayout from '../../../components/workout-layout';
import Carousel from 'react-native-snap-carousel';
import { Timer } from 'react-native-element-timer';
import Video from 'react-native-video';
import styles from './style';
import ModalTimer from '../../../components/workouts/mola-timer';
import themeColors from '../../../styles/colors';

const { width, height } = Dimensions.get("window");

const StartWorkout = (props) => {
    const [Loading, setLoading] = useState(false);
    const Data = props.route.params.data;
    const [Workouts, setWorkouts] = useState(Data.workout);
    const [TotalKcal, setTotalKcal] = useState(0);
    const [TotalPoint, setTotalPoint] = useState(0);
    const [CurrentSet, setCurrentSet] = useState(1);
    const [initialTime, setInitialTime] = useState(0);
    const [RemaningTime, setRemaningTime] = useState(0);
    const [SelectedIndex, setSelectedIndex] = useState(0);
    const [ShowFirstTimer, setShowFirstTimer] = useState(false);
    const [ShowMolaTimer, setShowMolaTimer] = useState(false);
    const [breakDuration, setbreakDuration] = useState(30);
    const [ShowFinishAlert, setShowFinishAlert] = useState(false);
    const [PlayVideo, setPlayVideo] = useState(false);
    const _carousel = useRef(null);
    const timerRef = useRef(null);
    const myVideo = useRef(null);

    useEffect(() => {
        setTimeout(() => {
            setShowFirstTimer(true);
        }, 500);
    }, [])

    const changeTime = (e) => {
        if (e !== undefined && e !== null) {
            setInitialTime(e);
        }
    }

    const updateLastIndex = async (e) => {
        setSelectedIndex(e);
        _carousel.current.snapToItem(parseFloat(e));
    }

    const _renderItem = ({ item, index }) => {
        return (
            <>
                <View
                    key={index}
                    style={{ height }}
                >
                    <View style={styles.renderContainer}>
                        <View style={{ width: '100%', height: 220 }}>
                            <Video
                                ref={myVideo}
                                shouldPlay={false}
                                resizeMode="contain"
                                useNativeControls
                                repeat={true}
                                paused={!PlayVideo}
                                source={{ uri: item.videoData.url }}
                                style={{ height: '100%', width: '100%' }}
                                playInBackground={false}
                                playWhenInactive={false}
                                muted={true}
                            />
                        </View>
                        {item.name !== undefined && item.name !== "" && item.name !== null &&
                            <View style={styles.boxStyle}>
                                <View style={styles.boxLeft}>
                                    <Text style={styles.boxTitle}>{item.name}</Text>
                                </View>
                                <View style={styles.boxRight}>
                                    <Text style={styles.boxSubtitle}>{CurrentSet}/{item.values.set} Set, {item.type === "reps" ? String(item.values.repeat) : String(item.values.time)} {item.type === "reps" ? "Tekrar" : "Saniye"}</Text>
                                </View>
                            </View>
                        }

                        <View style={styles.boxStyle}>
                            <Text style={[styles.boxTitle, { color: themeColors.white, fontWeight: '500', textAlign: 'justify' }]}>{item.info}</Text>
                        </View>
                    </View>
                </View>
            </>
        );
    }

    const GoBack = () => {
        props.navigation.goBack();
    }

    const increaseMove = () => {
        const currentWorkout = Workouts[SelectedIndex];

        setbreakDuration(currentWorkout.values.pause);
        if (CurrentSet === currentWorkout.values.set) {
            if (currentWorkout.type === "reps") {
                setTotalPoint(TotalPoint + parseFloat(1));
            } else {
                setTotalPoint(TotalPoint + parseFloat(currentWorkout.values.time) / 10);
            }
            setTotalKcal(TotalKcal + parseFloat(currentWorkout.values.calorie / currentWorkout.values.set))
            updateLastIndex(SelectedIndex + 1);
            setCurrentSet(1);
            setShowMolaTimer(true);
        } else {
            setTotalKcal(TotalKcal + parseFloat(currentWorkout.values.calorie / currentWorkout.values.set))
            if (currentWorkout.type === "reps") {
                setTotalPoint(TotalPoint + parseFloat(1));
            } else {
                setTotalPoint(TotalPoint + parseFloat(currentWorkout.values.time) / 10);
            }
            setCurrentSet(CurrentSet + 1);
            setShowMolaTimer(true);
        }
    }

    const decreaseMove = () => {
        const currentWorkout = Workouts[SelectedIndex];
        const previousWorkout = Workouts[SelectedIndex - 1];

        setbreakDuration(currentWorkout.values.pause);
        if (CurrentSet === currentWorkout.values.set) {
            setTotalPoint(TotalPoint - parseFloat(1));
            updateLastIndex(SelectedIndex - 1);
            setCurrentSet(1);
        } else if (CurrentSet === 1) {
            updateLastIndex(SelectedIndex - 1);
            if (currentWorkout.type === "reps") {
                setTotalPoint(TotalPoint - parseFloat(previousWorkout.values.set));
            } else {
                setTotalPoint(TotalPoint - parseFloat(parseFloat(previousWorkout.values.time * previousWorkout.values.set) / 10));
            }
            setTotalKcal(TotalKcal - parseFloat(previousWorkout.values.calorie))
        } else {
            setTotalKcal(TotalKcal - parseFloat(currentWorkout.values.calorie / currentWorkout.values.set))
            if (currentWorkout.type === "reps") {
                setTotalPoint(TotalPoint - parseFloat(1));
            } else {
                setTotalPoint(TotalPoint - parseFloat(currentWorkout.values.time) / 10);
            }
            setCurrentSet(CurrentSet - 1);
        }
    }

    return (
        <WorkoutLayout Loading={Loading}>
            <ModalTimer ShowMolaTimer={ShowFirstTimer} duration={5} onComplete={() => {
                setPlayVideo(true);
                timerRef.current.start();
                setShowFirstTimer(!ShowFirstTimer);
            }} />
            <ModalTimer ShowMolaTimer={ShowMolaTimer} duration={breakDuration} onComplete={() => {
                setShowMolaTimer(!ShowMolaTimer);
            }} />
            {!Loading && Workouts.length > 0 &&
                <>
                    <View style={{ marginHorizontal: 20 }}>
                        <View style={styles.headerBoxStyle}>
                            <View style={{ alignItems: 'flex-start' }}>
                                <View style={styles.iconContainer}>
                                    <Icon name="directions-run" color="#FFF" size={24} />
                                    <Text style={styles.iconText}>{parseFloat(TotalKcal).toFixed(0)} kcal</Text>
                                </View>

                                <View style={styles.iconContainer}>
                                    <Icon name="star" color="#FFF" size={24} />
                                    <Text style={styles.iconText}>{parseFloat(TotalPoint).toFixed(0)} puan</Text>
                                </View>
                            </View>
                            <View style={{ alignItems: 'flex-end' }}>
                                <Text style={styles.headerText}>Egzersiz {SelectedIndex + 1} / {Workouts.length + 1}</Text>
                                <Timer
                                    ref={timerRef}
                                    textStyle={styles.countdownText}
                                    seconds={initialTime}
                                    onTimes={changeTime}
                                />
                            </View>
                        </View>
                    </View>

                    <Carousel
                        ref={_carousel}
                        onSnapToItem={(e) => updateLastIndex(e)}
                        data={Workouts}
                        renderItem={_renderItem}
                        sliderWidth={width}
                        itemWidth={width / 1.1}
                        layout={'default'}
                        scrollEnabled={false}
                        style={{ paddingHorizontal: 10 }}
                        removeClippedSubviews={false}
                    />

                    <View style={styles.bottomBox}>
                        <Pressable
                            disabled={SelectedIndex === 0 && CurrentSet === 1 ? true : false}
                            onPress={decreaseMove} style={styles.arrowButton}>
                            <Icon name="skip-previous" color={SelectedIndex === 0 && CurrentSet === 1 ? "#999" : "#FFF"} size={32} />
                        </Pressable>

                        <Pressable onPress={() => setPlayVideo(!PlayVideo)} style={styles.pauseButton}>
                            <Icon name={PlayVideo ? "pause" : "play-arrow"} color="#242424" size={32} />
                        </Pressable>

                        <Pressable onPress={increaseMove}
                            style={styles.arrowButton}>
                            <Icon name="skip-next" color="#FFF" size={32} />
                        </Pressable>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, height: 50 }}>
                        <Pressable
                            style={styles.bottomButton}
                            onPress={() => {
                                timerRef.current.pause();
                                props.navigation.navigate('EndWorkout', {
                                    data: Data, workouts: Workouts, values: { TotalKcal, TotalPoint, initialTime }
                                })
                            }}>
                            <Text style={styles.bottomTitleLeft}>Antrenmanı Tamamla</Text>
                        </Pressable>
                        <View style={{ alignItems: 'flex-end', justifyContent: 'center', width: '50%' }}>
                            <Text style={styles.bottomSubtitle}>Sonraki Hareket</Text>
                            <Text numberOfLines={2} style={styles.bottomTitle}>{String(Workouts[SelectedIndex + 1].name).length > 40 ? String(Workouts[SelectedIndex + 1].name).slice(0, 40) + '...' : String(Workouts[SelectedIndex + 1].name)} • {Workouts[SelectedIndex + 1].set} Set </Text>
                        </View>
                    </View>
                </>
            }
        </WorkoutLayout >
    )
}

export default StartWorkout;