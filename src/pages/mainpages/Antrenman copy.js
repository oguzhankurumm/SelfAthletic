import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Image, StatusBar, TouchableOpacity, TouchableHighlight, Dimensions, ImageBackground, SafeAreaView, ScrollView, FlatList, Alert } from 'react-native';
import { database2 } from '../../config/config';
import { useSelector } from 'react-redux';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import SpinnerLoading from '../../components/SpinnerLoading';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Sidebar from '../../components/Sidebar';
import moment from 'moment';
import 'moment/locale/tr';
moment.locale('tr');
import LinearGradient from 'react-native-linear-gradient';
import CalendarStrip from 'react-native-calendar-strip';
import axios from 'axios';

const { height, width } = Dimensions.get("window");

const Antrenman = ({ navigation }) => {
    const profileData = useSelector(state => state.user.users);

    const [Loading, setLoading] = useState(true);
    const [SaveLoading, setSaveLoading] = useState(false);
    const [TotalProgress, setTotalProgress] = useState(30); //hedeflerin ortalaması alınacak

    const [ShowSideModal, setShowSideModal] = useState(false);
    const [VideoList, setVideoList] = useState([]);
    const [isFavorited, setisFavorited] = useState(false);
    const [WorkoutKey, setWorkoutKey] = useState(null);

    const [MyHistory, setMyHistory] = useState([]);
    const [markedDatesArray, setmarkedDatesArray] = useState([]);
    const [isWorkoutDay, setisWorkoutDay] = useState(false);
    const [SelectedDate, setSelectedDate] = useState(moment())

    let datesBlacklist = [{
        start: moment().add(1, 'days'),
        end: moment().add(10, 'days')
    }];

    const getVideo = (newWorkouts) => {
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
                        setVideoList(videoList);
                        setLoading(false);
                    } else {
                        setLoading(false);
                    }
                })
                .catch((err) => {
                    setLoading(false);
                    setTimeout(() => {
                        Alert.alert('Hata', 'Videolar yüklenemedi, lütfen internet bağlantınızı kontrol edin.');
                    }, 200);
                })
        })
    }

    const addFavorites = () => {
        const myMoveList = VideoList;
        if (isFavorited !== true) {
            setLoading(true);

            database2.ref('users').child(profileData.userId + '/favorites/workouts').push({
                date: moment().format("DD/MM/YYYYTHH:mm:ss"),
                moves: myMoveList,
                workouttype: 'special'
            })
                .then(() => {
                    setLoading(false);
                    setisFavorited(true);
                    setTimeout(() => {
                        Alert.alert('Başarılı', 'Antrenman favorilerinize eklendi.');
                    }, 200);
                })
                .catch((err) => {
                    setLoading(false);
                    setisFavorited(false);
                    setTimeout(() => {
                        Alert.alert('Hata', 'Bir hata oluştu, lütfen daha sonra tekrar deneyin.');
                    }, 200);
                })
        } else {
            setLoading(false);
            setisFavorited(false);
            setTimeout(() => {
                Alert.alert('Hata', 'Bu hareket zaten favorilerinize eklenmiş.');
            }, 200);
        }
    }

    useEffect(() => {
        getMyWorkouts();
    }, [])

    const getSelectedDay = async (date) => {
        let selectedDays = profileData.workoutDays !== undefined ? profileData.workoutDays : 'Yok';
        var oneDate = moment(moment(), 'DD-MM-YYYY');
        var dayName = oneDate.format('dddd');
        const isWd = MyHistory.filter(q => q.date === moment(date).format("DD/MM/YYYY"));

        setVideoList([])
        setLoading(true);

        if (isWd.length !== 0) {
            setisWorkoutDay(true);
            setSelectedDate(date)
            MyHistory.forEach((wData) => {
                getVideo(wData.moves);
                setWorkoutKey(wData.key);
            })
        } else if (moment(date).format("DD/MM/YYYY") === moment().format("DD/MM/YYYY")) {
            var wd = selectedDays.filter(q => q === dayName);
            if (wd.length !== 0) {
                setSelectedDate(date)
                setisWorkoutDay(true);
                setLoading(false);
            } else {
                setisWorkoutDay(false);
                setLoading(false);
            }
        } else {
            setLoading(false);
            setisWorkoutDay(false);
            setTimeout(() => {
                Alert.alert('Antrenman Yok', 'Seçili günde antrenman kaydı bulunamadı.', [
                    { text: 'Kapat', style: 'cancel' }
                ]);
            }, 200);
        }
    }

    const createWorkout = () => {
        setLoading(true);
        let cronicProblems = profileData.questions?.cronicproblems !== undefined ? profileData.questions?.cronicproblems : 'Yok';
        let selectedDays = profileData.workoutDays !== undefined ? profileData.workoutDays : 'Yok';
        let Target = profileData.questions?.target !== undefined ? profileData.questions?.target : 'Yok';

        var oneDate = moment(moment(), 'DD-MM-YYYY');
        var dayName = oneDate.format('dddd');

        if (selectedDays !== 'Yok') {
            var wd = selectedDays.filter(q => q === dayName);
            if (wd.length !== 0) {

                let StatikList = [];
                let MobiliteList = [];
                let KuvvetList = [];
                let CoreList = [];

                database2.ref('workouts').once('value')
                    .then((snapshot) => {
                        snapshot.forEach((item) => {
                            var move = item.val();

                            //SEVİYE 1 İÇİN BAŞLANGIÇ KAS KÜTLESİ
                            if (profileData.point < 10000 && Target === "Kas Kütlesi Artışı" && move.notfor[0] !== cronicProblems && move.notfor[1] !== cronicProblems && move.notfor[2] !== cronicProblems && move.notfor[3] !== cronicProblems) {
                                if (move.category === "Core Egzersizi" && CoreList.length < 3) {
                                    if (move.category === "Core Egzersizi" && move.type === "time") {
                                        CoreList.push({
                                            ...item.val(),
                                            id: item.key,
                                            set: 3,
                                            pause: 60,
                                            time: 15
                                        })
                                    } else {
                                        CoreList.push({
                                            ...item.val(),
                                            id: item.key,
                                            set: 3,
                                            pause: 60,
                                            reps: 10
                                        })
                                    }
                                }

                                if (move.category === "Mobilite ve Dinamik Isınma" && MobiliteList.length < 3) {
                                    if (move.category === "Mobilite ve Dinamik Isınma" && move.type === "time") {
                                        MobiliteList.push({
                                            ...item.val(),
                                            id: item.key,
                                            set: 3,
                                            pause: 60,
                                            time: 10
                                        })
                                    } else {
                                        MobiliteList.push({
                                            ...item.val(),
                                            id: item.key,
                                            set: 3,
                                            pause: 60,
                                            reps: 10
                                        })
                                    }
                                }

                                if (move.category == "Alt Vücut" && KuvvetList.length < 3) {
                                    KuvvetList.push({
                                        ...item.val(),
                                        id: item.key,
                                        set: 4,
                                        pause: 60,
                                        reps: 10
                                    })
                                }

                                if (move.category === "Üst Vücut" && KuvvetList.length < 3) {
                                    KuvvetList.push({
                                        ...item.val(),
                                        id: item.key,
                                        set: 4,
                                        pause: 60,
                                        reps: 10
                                    })
                                }

                                if (move.category === "Statik Stretching" && StatikList.length < 8) {
                                    StatikList.push({
                                        ...item.val(),
                                        id: item.key,
                                        set: 3,
                                        pause: 60,
                                        time: 10
                                    })
                                }

                            }

                            //SEVİYE 1 İÇİN KAS KÜTLESİ SON

                            // SEVİYE 1 İÇİN YAĞ ORANI AZALTMA BAŞLANGIÇ
                            if (profileData.point < 10000 && Target === "Yağ Oranı Azaltma" && move.notfor[0] !== cronicProblems && move.notfor[1] !== cronicProblems && move.notfor[2] !== cronicProblems && move.notfor[3] !== cronicProblems) {
                                if (move.category === "Core Egzersizi" && CoreList.length < 4) {
                                    if (move.category === "Core Egzersizi" && move.type === "time") {
                                        CoreList.push({
                                            ...item.val(),
                                            id: item.key,
                                            set: 3,
                                            pause: 30,
                                            time: 15
                                        })
                                    } else {
                                        CoreList.push({
                                            ...item.val(),
                                            id: item.key,
                                            set: 3,
                                            pause: 30,
                                            reps: 10
                                        })
                                    }
                                }

                                if (move.category === "Mobilite ve Dinamik Isınma" && MobiliteList.length < 3) {
                                    if (move.category === "Mobilite ve Dinamik Isınma" && move.type === "time") {
                                        MobiliteList.push({
                                            ...item.val(),
                                            id: item.key,
                                            set: 2,
                                            pause: 30,
                                            time: 10
                                        })
                                    } else {
                                        MobiliteList.push({
                                            ...item.val(),
                                            id: item.key,
                                            set: 2,
                                            pause: 30,
                                            reps: 10
                                        })
                                    }
                                }

                                if (move.category == "Alt Vücut" && KuvvetList.length < 4) {
                                    KuvvetList.push({
                                        ...item.val(),
                                        id: item.key,
                                        set: 2,
                                        pause: 30,
                                        reps: 15
                                    })
                                }

                                if (move.category === "Üst Vücut" && KuvvetList.length < 4) {
                                    KuvvetList.push({
                                        ...item.val(),
                                        id: item.key,
                                        set: 2,
                                        pause: 30,
                                        reps: 15
                                    })
                                }

                                if (move.category === "Statik Stretching" && StatikList.length < 8) {
                                    StatikList.push({
                                        ...item.val(),
                                        id: item.key,
                                        set: 2,
                                        pause: 30,
                                        time: 10
                                    })
                                }

                            }

                            // SEVİYE 1 İÇİN YAĞ ORANI AZALTMA SON

                            // SEVİYE 1 İÇİN FİT OLMA BAŞLANGIÇ
                            if (profileData.point < 10000 && Target === "Fit Olma" && move.notfor[0] !== cronicProblems && move.notfor[1] !== cronicProblems && move.notfor[2] !== cronicProblems && move.notfor[3] !== cronicProblems) {
                                if (move.category === "Core Egzersizi" && CoreList.length < 5) {
                                    if (move.category === "Core Egzersizi" && move.type === "time") {
                                        CoreList.push({
                                            ...item.val(),
                                            id: item.key,
                                            set: 3,
                                            pause: 45,
                                            time: 15
                                        })
                                    } else {
                                        CoreList.push({
                                            ...item.val(),
                                            id: item.key,
                                            set: 3,
                                            pause: 45,
                                            reps: 10
                                        })
                                    }
                                }

                                if (move.category === "Mobilite ve Dinamik Isınma" && MobiliteList.length < 3) {
                                    if (move.category === "Mobilite ve Dinamik Isınma" && move.type === "time") {
                                        MobiliteList.push({
                                            ...item.val(),
                                            id: item.key,
                                            set: 3,
                                            pause: 45,
                                            time: 10
                                        })
                                    } else {
                                        MobiliteList.push({
                                            ...item.val(),
                                            id: item.key,
                                            set: 3,
                                            pause: 45,
                                            reps: 10
                                        })
                                    }
                                }

                                if (move.category == "Alt Vücut" && KuvvetList.length < 2) {
                                    KuvvetList.push({
                                        ...item.val(),
                                        id: item.key,
                                        set: 4,
                                        pause: 45,
                                        reps: 10
                                    })
                                }

                                if (move.category === "Üst Vücut" && KuvvetList.length < 3) {
                                    KuvvetList.push({
                                        ...item.val(),
                                        id: item.key,
                                        set: 4,
                                        pause: 45,
                                        reps: 15
                                    })
                                }

                                if (move.category === "Statik Stretching" && StatikList.length < 8) {
                                    StatikList.push({
                                        ...item.val(),
                                        id: item.key,
                                        set: 3,
                                        pause: 45,
                                        time: 10
                                    })
                                }

                            }

                            // SEVİYE 1 İÇİN FİT OLMA SON

                            /////// SEVİYE 2 //////

                            /// KAS KÜTLES ARTIŞI SEVİYE 2 BAŞLANGIÇ

                            if (profileData.point >= 10001 && profileData.point <= 15000 && Target === "Kas Kütlesi Artışı" && move.notfor[0] !== cronicProblems && move.notfor[1] !== cronicProblems && move.notfor[2] !== cronicProblems && move.notfor[3] !== cronicProblems) {
                                if (move.category === "Core Egzersizi" && CoreList.length < 3) {
                                    if (move.category === "Core Egzersizi" && move.type === "time") {
                                        CoreList.push({
                                            ...item.val(),
                                            id: item.key,
                                            set: 3,
                                            pause: 60,
                                            time: 15
                                        })
                                    } else {
                                        CoreList.push({
                                            ...item.val(),
                                            id: item.key,
                                            set: 3,
                                            pause: 60,
                                            reps: 15
                                        })
                                    }
                                }

                                if (move.category === "Mobilite ve Dinamik Isınma" && MobiliteList.length < 3) {
                                    if (move.category === "Mobilite ve Dinamik Isınma" && move.type === "time") {
                                        MobiliteList.push({
                                            ...item.val(),
                                            id: item.key,
                                            set: 3,
                                            pause: 60,
                                            time: 10
                                        })
                                    } else {
                                        MobiliteList.push({
                                            ...item.val(),
                                            id: item.key,
                                            set: 3,
                                            pause: 60,
                                            reps: 10
                                        })
                                    }
                                }

                                if (move.category == "Alt Vücut" && KuvvetList.length < 4) {
                                    KuvvetList.push({
                                        ...item.val(),
                                        id: item.key,
                                        set: 4,
                                        pause: 60,
                                        reps: 10
                                    })
                                }

                                if (move.category === "Üst Vücut" && KuvvetList.length < 4) {
                                    KuvvetList.push({
                                        ...item.val(),
                                        id: item.key,
                                        set: 4,
                                        pause: 60,
                                        reps: 10
                                    })
                                }

                                if (move.category === "Statik Stretching" && StatikList.length < 8) {
                                    StatikList.push({
                                        ...item.val(),
                                        id: item.key,
                                        set: 3,
                                        pause: 60,
                                        time: 10
                                    })
                                }

                            }

                            //SEVİYE 2 İÇİN KAS KÜTLESİ SON

                            // SEVİYE 2 İÇİN YAĞ ORANI AZALTMA BAŞLANGIÇ
                            if (profileData.point >= 10001 && profileData.point <= 15000 && Target === "Yağ Oranı Azaltma" && move.notfor[0] !== cronicProblems && move.notfor[1] !== cronicProblems && move.notfor[2] !== cronicProblems && move.notfor[3] !== cronicProblems) {
                                if (move.category === "Core Egzersizi" && CoreList.length < 3) {
                                    if (move.category === "Core Egzersizi" && move.type === "time") {
                                        CoreList.push({
                                            ...item.val(),
                                            id: item.key,
                                            set: 3,
                                            pause: 30,
                                            time: 15
                                        })
                                    } else {
                                        CoreList.push({
                                            ...item.val(),
                                            id: item.key,
                                            set: 3,
                                            pause: 30,
                                            reps: 10
                                        })
                                    }
                                }

                                if (move.category === "Mobilite ve Dinamik Isınma" && MobiliteList.length < 3) {
                                    if (move.category === "Mobilite ve Dinamik Isınma" && move.type === "time") {
                                        MobiliteList.push({
                                            ...item.val(),
                                            id: item.key,
                                            set: 2,
                                            pause: 30,
                                            time: 10
                                        })
                                    } else {
                                        MobiliteList.push({
                                            ...item.val(),
                                            id: item.key,
                                            set: 2,
                                            pause: 30,
                                            reps: 10
                                        })
                                    }
                                }

                                if (move.category == "Alt Vücut" && KuvvetList.length < 4) {
                                    KuvvetList.push({
                                        ...item.val(),
                                        id: item.key,
                                        set: 3,
                                        pause: 30,
                                        reps: 15
                                    })
                                }

                                if (move.category === "Üst Vücut" && KuvvetList.length < 4) {
                                    KuvvetList.push({
                                        ...item.val(),
                                        id: item.key,
                                        set: 3,
                                        pause: 30,
                                        reps: 10
                                    })
                                }

                                if (move.category === "Statik Stretching" && StatikList.length < 8) {
                                    StatikList.push({
                                        ...item.val(),
                                        id: item.key,
                                        set: 2,
                                        pause: 30,
                                        time: 10
                                    })
                                }

                            }

                            // SEVİYE 2 İÇİN YAĞ ORANI AZALTMA SON

                            // SEVİYE 2 İÇİN FİT OLMA BAŞLANGIÇ
                            if (profileData.point >= 10001 && profileData.point <= 15000 && Target === "Fit Olma" && move.notfor[0] !== cronicProblems && move.notfor[1] !== cronicProblems && move.notfor[2] !== cronicProblems && move.notfor[3] !== cronicProblems) {
                                if (move.category === "Core Egzersizi" && CoreList.length < 6) {
                                    if (move.category === "Core Egzersizi" && move.type === "time") {
                                        CoreList.push({
                                            ...item.val(),
                                            id: item.key,
                                            set: 3,
                                            pause: 30,
                                            time: 15
                                        })
                                    } else {
                                        CoreList.push({
                                            ...item.val(),
                                            id: item.key,
                                            set: 3,
                                            pause: 30,
                                            reps: 10
                                        })
                                    }
                                }

                                if (move.category === "Mobilite ve Dinamik Isınma" && MobiliteList.length < 3) {
                                    if (move.category === "Mobilite ve Dinamik Isınma" && move.type === "time") {
                                        MobiliteList.push({
                                            ...item.val(),
                                            id: item.key,
                                            set: 2,
                                            pause: 30,
                                            time: 10
                                        })
                                    } else {
                                        MobiliteList.push({
                                            ...item.val(),
                                            id: item.key,
                                            set: 2,
                                            pause: 30,
                                            reps: 10
                                        })
                                    }
                                }

                                if (move.category == "Alt Vücut" && KuvvetList.length < 4) {
                                    KuvvetList.push({
                                        ...item.val(),
                                        id: item.key,
                                        set: 3,
                                        pause: 30,
                                        reps: 15
                                    })
                                }

                                if (move.category === "Üst Vücut" && KuvvetList.length < 4) {
                                    KuvvetList.push({
                                        ...item.val(),
                                        id: item.key,
                                        set: 3,
                                        pause: 30,
                                        reps: 15
                                    })
                                }

                                if (move.category === "Statik Stretching" && StatikList.length < 8) {
                                    StatikList.push({
                                        ...item.val(),
                                        id: item.key,
                                        set: 2,
                                        pause: 45,
                                        time: 10
                                    })
                                }

                            }

                            // SEVİYE 2 İÇİN FİT OLMA SON


                            /////// SEVİYE 3 //////

                            /// KAS KÜTLES ARTIŞI SEVİYE 3 BAŞLANGIÇ

                            if (profileData.point >= 15001 && profileData.point <= 25000 && Target === "Kas Kütlesi Artışı" && move.notfor[0] !== cronicProblems && move.notfor[1] !== cronicProblems && move.notfor[2] !== cronicProblems && move.notfor[3] !== cronicProblems) {
                                if (move.category === "Core Egzersizi" && CoreList.length < 3) {
                                    if (move.category === "Core Egzersizi" && move.type === "time") {
                                        CoreList.push({
                                            ...item.val(),
                                            id: item.key,
                                            set: 3,
                                            pause: 60,
                                            time: 15
                                        })
                                    } else {
                                        CoreList.push({
                                            ...item.val(),
                                            id: item.key,
                                            set: 3,
                                            pause: 60,
                                            reps: 15
                                        })
                                    }
                                }

                                if (move.category === "Mobilite ve Dinamik Isınma" && MobiliteList.length < 3) {
                                    if (move.category === "Mobilite ve Dinamik Isınma" && move.type === "time") {
                                        MobiliteList.push({
                                            ...item.val(),
                                            id: item.key,
                                            set: 3,
                                            pause: 60,
                                            time: 10
                                        })
                                    } else {
                                        MobiliteList.push({
                                            ...item.val(),
                                            id: item.key,
                                            set: 3,
                                            pause: 60,
                                            reps: 10
                                        })
                                    }
                                }

                                if (move.category == "Alt Vücut" && KuvvetList.length < 4) {
                                    KuvvetList.push({
                                        ...item.val(),
                                        id: item.key,
                                        set: 4,
                                        pause: 60,
                                        reps: 12
                                    })
                                }

                                if (move.category === "Üst Vücut" && KuvvetList.length < 4) {
                                    KuvvetList.push({
                                        ...item.val(),
                                        id: item.key,
                                        set: 4,
                                        pause: 60,
                                        reps: 12
                                    })
                                }

                                if (move.category === "Statik Stretching" && StatikList.length < 8) {
                                    StatikList.push({
                                        ...item.val(),
                                        id: item.key,
                                        set: 3,
                                        pause: 60,
                                        time: 10
                                    })
                                }

                            }

                            //SEVİYE 3 İÇİN KAS KÜTLESİ SON

                            // SEVİYE 3 İÇİN YAĞ ORANI AZALTMA BAŞLANGIÇ
                            if (profileData.point >= 15001 && profileData.point <= 25000 && Target === "Yağ Oranı Azaltma" && move.notfor[0] !== cronicProblems && move.notfor[1] !== cronicProblems && move.notfor[2] !== cronicProblems && move.notfor[3] !== cronicProblems) {
                                if (move.category === "Core Egzersizi" && CoreList.length < 3) {
                                    if (move.category === "Core Egzersizi" && move.type === "time") {
                                        CoreList.push({
                                            ...item.val(),
                                            id: item.key,
                                            set: 3,
                                            pause: 30,
                                            time: 15
                                        })
                                    } else {
                                        CoreList.push({
                                            ...item.val(),
                                            id: item.key,
                                            set: 3,
                                            pause: 30,
                                            reps: 10
                                        })
                                    }
                                }

                                if (move.category === "Mobilite ve Dinamik Isınma" && MobiliteList.length < 3) {
                                    if (move.category === "Mobilite ve Dinamik Isınma" && move.type === "time") {
                                        MobiliteList.push({
                                            ...item.val(),
                                            id: item.key,
                                            set: 2,
                                            pause: 30,
                                            time: 10
                                        })
                                    } else {
                                        MobiliteList.push({
                                            ...item.val(),
                                            id: item.key,
                                            set: 2,
                                            pause: 30,
                                            reps: 10
                                        })
                                    }
                                }

                                if (move.category == "Alt Vücut" && KuvvetList.length < 4) {
                                    KuvvetList.push({
                                        ...item.val(),
                                        id: item.key,
                                        set: 4,
                                        pause: 30,
                                        reps: 12
                                    })
                                }

                                if (move.category === "Üst Vücut" && KuvvetList.length < 4) {
                                    KuvvetList.push({
                                        ...item.val(),
                                        id: item.key,
                                        set: 4,
                                        pause: 30,
                                        reps: 12
                                    })
                                }

                                if (move.category === "Statik Stretching" && StatikList.length < 8) {
                                    StatikList.push({
                                        ...item.val(),
                                        id: item.key,
                                        set: 2,
                                        pause: 30,
                                        time: 10
                                    })
                                }

                            }

                            // SEVİYE 2 İÇİN YAĞ ORANI AZALTMA SON

                            // SEVİYE 2 İÇİN FİT OLMA BAŞLANGIÇ
                            if (profileData.point >= 15001 && profileData.point <= 25000 && Target === "Fit Olma" && move.notfor[0] !== cronicProblems && move.notfor[1] !== cronicProblems && move.notfor[2] !== cronicProblems && move.notfor[3] !== cronicProblems) {
                                if (move.category === "Core Egzersizi" && CoreList.length < 6) {
                                    if (move.category === "Core Egzersizi" && move.type === "time") {
                                        CoreList.push({
                                            ...item.val(),
                                            id: item.key,
                                            set: 4,
                                            pause: 45,
                                            time: 25
                                        })
                                    } else {
                                        CoreList.push({
                                            ...item.val(),
                                            id: item.key,
                                            set: 4,
                                            pause: 45,
                                            reps: 15
                                        })
                                    }
                                }

                                if (move.category === "Mobilite ve Dinamik Isınma" && MobiliteList.length < 3) {
                                    if (move.category === "Mobilite ve Dinamik Isınma" && move.type === "time") {
                                        MobiliteList.push({
                                            ...item.val(),
                                            id: item.key,
                                            set: 3,
                                            pause: 45,
                                            time: 10
                                        })
                                    } else {
                                        MobiliteList.push({
                                            ...item.val(),
                                            id: item.key,
                                            set: 3,
                                            pause: 45,
                                            reps: 10
                                        })
                                    }
                                }

                                if (move.category == "Alt Vücut" && KuvvetList.length < 3) {
                                    KuvvetList.push({
                                        ...item.val(),
                                        id: item.key,
                                        set: 4,
                                        pause: 45,
                                        reps: 10
                                    })
                                }

                                if (move.category === "Üst Vücut" && KuvvetList.length < 3) {
                                    KuvvetList.push({
                                        ...item.val(),
                                        id: item.key,
                                        set: 4,
                                        pause: 45,
                                        reps: 10
                                    })
                                }

                                if (move.category === "Statik Stretching" && StatikList.length < 8) {
                                    StatikList.push({
                                        ...item.val(),
                                        id: item.key,
                                        set: 3,
                                        pause: 45,
                                        time: 10
                                    })
                                }

                            }

                            // SEVİYE 2 İÇİN FİT OLMA SON

                        })

                        let newList = [...KuvvetList, ...StatikList, ...CoreList, ...MobiliteList]

                        setSaveLoading(true);

                        database2.ref('users/' + profileData.userId + '/workouts').push({
                            date: moment().format('DD/MM/YYYY'),
                            completed: false,
                            moves: newList
                        })
                            .then((response) => {
                                database2.ref(response.path).once('value')
                                    .then((res) => {
                                        getVideo(res.val().moves);
                                        setWorkoutKey(res.key);
                                        setSaveLoading(false);
                                    })
                                    .catch((err) => {
                                        setSaveLoading(false);
                                        setLoading(false);
                                    })
                            })
                            .catch((err) => {
                                setSaveLoading(false);
                                setLoading(false);;
                            })
                    })
                    .catch((err) => {
                        setSaveLoading(false);
                        setLoading(false);
                    })
            } else {
                setLoading(false);
                setSaveLoading(false);
                setTimeout(() => {
                    Alert.alert('Hata', 'Bugün antrenman yok.', [
                        { text: 'Günleri Değiştir', onPress: () => navigation.navigate('Settings'), style: 'default', },
                        { text: 'Kapat', style: 'cancel' }
                    ]);
                }, 200);
            }
        } else {
            setLoading(false);
            setTimeout(() => {
                Alert.alert('Hata', 'Antrenman günü seçilmemiş, lütfen ayarlardan antrenman günü seçin.', [
                    { text: 'Ayarlara Git', onPress: () => navigation.navigate('AntrenmanGunleri'), style: 'default' },
                    { text: 'Vazgeç', style: 'cancel' }
                ])
            }, 200);

        }
    }

    const getMyWorkouts = async () => {
        setLoading(true);

        await database2.ref('users/' + profileData.userId + '/workouts').once('value')
            .then(snapshot => {
                if (snapshot.val() !== null) {
                    var MyList = [];

                    snapshot.forEach((work) => {
                        MyList.push({
                            ...work.val(),
                            id: work.key
                        })

                        markedDatesArray.push({
                            date: moment(work.val().date, "DD/MM/YYYY").format("YYYY-MM-DD"),
                            dots: [
                                {
                                    color: work.val().completed === true ? 'yellow' : '#d3d3d3',
                                },
                            ],
                        });
                    })

                    setMyHistory(MyList);

                    var isWd = MyList.filter(q => q.date === moment().format("DD/MM/YYYY"));

                    if (isWd.length !== 0) {
                        MyList.forEach((wData) => {
                            getVideo(wData.moves);
                            setWorkoutKey(wData.key);
                        })
                    } else if (VideoList.length === 0 && isWorkoutDay === true) {
                        setLoading(false);
                        createWorkout();
                    } else {
                        setLoading(false);
                    }
                }
            })
            .catch((err) => {
                setLoading(false);
            })
    }

    const closeModal = () => {
        setShowSideModal(!ShowSideModal);
    }

    return (
        <ImageBackground style={{ height: height, width: width }} resizeMode="cover" source={require('../../img/bg.jpg')}>
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="light-content" />
                <SpinnerLoading Loading={Loading} />
                <SpinnerLoading Loading={SaveLoading} />
                <Sidebar navigation={navigation} opened={ShowSideModal} onClose={() => closeModal()} />

                <View style={styles.header} >
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => setShowSideModal(!ShowSideModal)}>
                            <Icon name="menu" color="#FFF" size={32} style={{ marginRight: 15 }} />
                        </TouchableOpacity>
                        <Text style={styles.headerText}>Antrenman</Text>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>

                        <TouchableHighlight onPress={() => navigation.navigate('FeedList')}>
                            <Icon name="comment" color="#FFF" size={28} style={{ marginRight: 20 }} />
                        </TouchableHighlight>

                        <TouchableHighlight onPress={() => navigation.navigate('Settings')}>
                            <Icon name="settings" color="#FFF" size={28} />
                        </TouchableHighlight>

                    </View>
                </View>

                <ScrollView style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%', paddingHorizontal: 30, marginTop: 20 }}>
                        <View style={{ width: '50%', justifyContent: 'center', alignItems: 'baseline' }}>

                            <View style={{ width: 130, justifyContent: 'center', alignItems: 'center' }}>
                                <AnimatedCircularProgress
                                    size={120}
                                    width={4}
                                    rotation={90}
                                    fill={TotalProgress}
                                    tintColor="red"
                                    backgroundColor="#2D2D2D">
                                    {(fill) => (
                                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                            <Text style={styles.circleHeaderText}>%{fill}</Text>
                                        </View>
                                    )}
                                </AnimatedCircularProgress>
                            </View>

                            <View style={{ position: 'absolute', width: 130, justifyContent: 'center', alignItems: 'center' }}>
                                <AnimatedCircularProgress
                                    size={130}
                                    width={4}
                                    rotation={90}
                                    fill={TotalProgress + 20}
                                    tintColor="yellow"
                                    backgroundColor="#2D2D2D">
                                </AnimatedCircularProgress>
                            </View>
                        </View>
                        <View style={{ width: '50%', justifyContent: 'center', alignItems: 'baseline', flexDirection: 'column' }}>
                            <View>
                                <Text style={styles.targetHeader}>Kalori</Text>
                                <Text style={styles.targetText}>150 / {String(profileData.targets?.calorie !== undefined ? profileData.targets.calorie : 0)}</Text>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={styles.targetSubText}>Yapılan</Text>
                                    <Text style={styles.targetSubText}> - Hedef</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={{ width: '100%', paddingHorizontal: 10 }}>
                        {!Loading &&
                            <CalendarStrip
                                scrollable={false}
                                datesBlacklist={datesBlacklist}
                                selectedDate={SelectedDate}
                                // showMonth={false}
                                onDateSelected={(val) => getSelectedDay(val)}
                                // datesWhitelist={datesWhitelist}
                                // iconStyle={{ padding: 10 }}
                                style={{ height: 100, paddingTop: 20, paddingBottom: 10 }}
                                daySelectionAnimation={{ type: 'background', duration: 200, borderWidth: 1, borderHighlightColor: 'white' }}
                                calendarHeaderStyle={{ color: 'white' }}
                                dateNumberStyle={{ color: 'white' }}
                                dateNameStyle={{ color: 'white' }}
                                highlightDateNumberStyle={{ color: 'yellow' }}
                                highlightDateNameStyle={{ color: 'yellow' }}
                                disabledDateNameStyle={{ color: 'grey' }}
                                disabledDateNumberStyle={{ color: 'grey' }}
                                // iconContainer={{ flex: 0.1 }}
                                markedDates={markedDatesArray}
                                iconRight={null}
                                iconLeft={null}
                            />
                        }
                    </View>

                    <View style={{ paddingHorizontal: 30, flexDirection: 'row', paddingVertical: 10, justifyContent: 'space-between', alignItems: 'center' }}>
                        {/* <TouchableOpacity onPress={() => addFavorites()}
                                style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                                <Icon name={isFavorited === true ? "favorite" : "favorite-outline"} color="yellow" size={26} />
                                <Text style={{
                                    fontFamily: 'SFProDisplay-Medium',
                                    fontSize: 15,
                                    color: 'yellow',
                                    marginLeft: 10
                                }}
                                >Favori</Text>
                            </TouchableOpacity> */}

                        {!Loading &&
                            <TouchableOpacity onPress={() => getMyWorkouts()}
                                style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                                <Icon name="refresh" color="yellow" size={26} />
                                <Text style={{
                                    fontFamily: 'SFProDisplay-Medium',
                                    fontSize: 15,
                                    color: 'yellow',
                                    marginLeft: 10
                                }}
                                >Yenile</Text>
                            </TouchableOpacity>
                        }

                        {!Loading && VideoList.length !== 0 &&
                            <TouchableOpacity onPress={() => {
                                if (VideoList.length !== 0) {
                                    navigation.navigate('WorkoutSpecial', { VideoList: VideoList, key: WorkoutKey })
                                } else {
                                    Alert.alert('Hata', 'Bu antrenmanda hiç video yok.');
                                }
                            }}
                                style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                                <Text style={{
                                    fontFamily: 'SFProDisplay-Medium',
                                    fontSize: 15,
                                    color: 'yellow',
                                    marginRight: 10
                                }}
                                >Hemen Başla</Text>
                                <Icon name="keyboard-arrow-right" color="yellow" size={26} />
                            </TouchableOpacity>
                        }

                    </View>

                    {!Loading && VideoList.length !== 0 &&
                        <>
                            <FlatList style={{ height: 'auto', paddingHorizontal: 30, marginBottom: 100 }}
                                scrollEnabled={true}
                                data={VideoList}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={(workouts) => {
                                    var item = workouts.item;
                                    return (item &&
                                        <TouchableOpacity key={item.id} onPress={() => navigation.navigate('WorkoutDetails', { item: item })}
                                            style={{
                                                height: 'auto',
                                                width: '100%',
                                                borderRadius: 18,
                                                marginTop: 20
                                            }}>
                                            <Image
                                                resizeMode="cover"
                                                source={{ uri: item.thumb }}
                                                style={{
                                                    width: '100%',
                                                    height: 150,
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
                                                    height: 150
                                                }}
                                            />
                                            <View style={{ position: 'absolute', top: 15, paddingHorizontal: 15 }}>
                                                <Text style={{
                                                    fontFamily: 'SFProDisplay-Bold',
                                                    fontSize: 20,
                                                    color: '#FFF',
                                                    marginBottom: 8
                                                }}>{item.title}</Text>
                                            </View>

                                            <View style={{
                                                flexDirection: 'row',
                                                position: 'absolute',
                                                width: '100%',
                                                bottom: 15,
                                                paddingHorizontal: 15,
                                                justifyContent: 'space-between'
                                            }}>

                                                <View style={{
                                                    flexDirection: 'row',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    marginRight: 10
                                                }}>
                                                    {item.type === "time" ?
                                                        <>
                                                            <Icon name="timer" color="#FFF" size={20} />
                                                            <Text numberOfLines={2} style={{
                                                                fontFamily: 'SFProDisplay-Medium',
                                                                fontSize: 13,
                                                                color: '#FFF',
                                                                marginLeft: 5
                                                            }}>{item.set + ' Set, ' + item.time + ' Saniye'}</Text>
                                                        </>
                                                        :
                                                        <>
                                                            <Icon name="replay" color="#FFF" size={20} />
                                                            <Text numberOfLines={2} style={{
                                                                fontFamily: 'SFProDisplay-Medium',
                                                                fontSize: 13,
                                                                color: '#FFF',
                                                                marginLeft: 5
                                                            }}>{item.set + ' Set, ' + item.reps + ' Tekrar'}</Text>
                                                        </>
                                                    }
                                                </View>

                                                {item.level === 0 &&
                                                    <View style={{
                                                        flexDirection: 'row',
                                                        justifyContent: 'center',
                                                        alignItems: 'center'
                                                    }}>
                                                        <Icon name="bar-chart" color="#FFF" size={20} />
                                                        <Text style={{
                                                            fontFamily: 'SFProDisplay-Medium',
                                                            fontSize: 14,
                                                            color: '#FFF',
                                                            marginLeft: 5
                                                        }}>Başlangıç Seviyesi</Text>
                                                    </View>
                                                }

                                                {/* {item.level === 1 && */}
                                                {/* <View style={{
                                                    flexDirection: 'row',
                                                    justifyContent: 'center',
                                                    alignItems: 'center'
                                                }}>
                                                    <Icon name="bar-chart" color="#FFF" size={20} />
                                                    <Text style={{
                                                        fontFamily: 'SFProDisplay-Medium',
                                                        fontSize: 14,
                                                        color: '#FFF',
                                                        marginLeft: 5
                                                    }}>Orta Seviye</Text>
                                                </View> */}
                                                {/* } */}
                                                {/* 
                                            {item.level === 2 &&
                                                <View style={{
                                                    flexDirection: 'row',
                                                    justifyContent: 'center',
                                                    alignItems: 'center'
                                                }}>
                                                    <Icon name="bar-chart" color="#FFF" size={20} />
                                                    <Text style={{ fontFamily: 'SFProDisplay-Medium', fontSize: 14, color: '#FFF', marginLeft: 5 }}>Zor</Text>
                                                </View>
                                            }

                                            {item.level === 3 &&
                                                <View style={{
                                                    flexDirection: 'row',
                                                    justifyContent: 'center',
                                                    alignItems: 'center'
                                                }}>
                                                    <Icon name="bar-chart" color="#FFF" size={20} />
                                                    <Text style={{
                                                        fontFamily: 'SFProDisplay-Medium',
                                                        fontSize: 14,
                                                        color: '#FFF',
                                                        marginLeft: 5
                                                    }}>Profesyonel Seviye</Text>
                                                </View>
                                            } */}
                                            </View>
                                        </TouchableOpacity>
                                    )
                                }}
                            />
                        </>
                    }

                    {/* {!Loading && VideoList.length === 0 && isWorkoutDay === true &&
                        <View style={{ paddingHorizontal: 30, flexDirection: 'column', paddingVertical: 10, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{
                                marginTop: 10,
                                fontFamily: 'SFProDisplay-Medium',
                                fontSize: 15,
                                color: 'yellow',
                            }}>Bugün için antrenman oluşturulmamış.</Text>

                            <TouchableOpacity
                                onPress={() => createWorkout()}
                                style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20, backgroundColor: 'yellow', paddingVertical: 15, paddingHorizontal: 20, borderRadius: 18 }}>
                                <Text style={{
                                    fontFamily: 'SFProDisplay-Medium',
                                    fontSize: 15,
                                    color: '#000',
                                }}
                                >Özel Programımı Oluştur</Text>
                            </TouchableOpacity>
                        </View>} */}
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
        paddingHorizontal: 30
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
    targetHeader: {
        fontFamily: 'SFProDisplay-Medium',
        fontSize: 22,
        color: '#FFF',
        marginBottom: 5
    },
    targetText: {
        fontFamily: 'SFProDisplay-Medium',
        fontSize: 20,
        color: '#FFF'
    },
    targetSubText: {
        marginTop: 5,
        fontFamily: 'SFProDisplay-Medium',
        fontSize: 13,
        color: '#FFF'
    },
})
export default Antrenman;