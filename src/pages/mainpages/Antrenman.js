import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Image, StatusBar, TouchableOpacity, TouchableHighlight, Dimensions, ImageBackground, SafeAreaView, ScrollView, FlatList, Alert } from 'react-native';
import { database } from '../../config/config';
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
import { SCLAlert, SCLAlertButton } from 'react-native-scl-alert'

const { height, width } = Dimensions.get("window");

const Antrenman = ({ navigation }) => {
    const profileData = useSelector(state => state.user.users);
    const fitnessData = useSelector(state => state.health.health);

    const [Loading, setLoading] = useState(true);
    const [SaveLoading, setSaveLoading] = useState(false);

    const [ShowSideModal, setShowSideModal] = useState(false);
    const [VideoList, setVideoList] = useState([]);
    const [Workout, setWorkout] = useState([]);
    const [WorkoutKey, setWorkoutKey] = useState(null);

    const [FavoritedList, setFavoritedList] = useState([]);

    const [MyHistory, setMyHistory] = useState([]);
    const [markedDatesArray, setmarkedDatesArray] = useState([]);
    const [SelectedDate, setSelectedDate] = useState(moment());


    const [totalKcal, settotalKcal] = useState(0);
    const [TotalPoint, setTotalPoint] = useState(0);
    const [isCompleted, setisCompleted] = useState(false);

    const [ShowAlert, setShowAlert] = useState(false);
    const [AlertSuccessTitle, setAlertSuccessTitle] = useState("");
    const [AlertSuccessSubTitle, setAlertSuccessSubTitle] = useState("");

    let datesBlacklist = [{
        start: moment().add(1, 'days'),
        end: moment().add(10, 'days')
    }];

    const CreateNewOne = async () => {
        const dateNow = moment().format("DD-MM-YYYY");

        await database().ref(`users/${profileData.userId}/workouts/${dateNow}`).remove()
            .then(() => {
                createWorkout();
            })
            .catch(err => {
                createWorkout();
            })
    }

    const getVideo = async (newWorkouts) => {
        let videoList = [];
        let getL = newWorkouts;
        let newL = []

        Object.values(getL).forEach((item, i) => {
            newL.push({ ...item, index: i })
        })

        newL.forEach((move) => {
            axios.get(`https://player.vimeo.com/video/${move.video}/config`)
                .then((res) => {
                    if (res.status === 200) {
                        videoList.push({
                            size: res.data.request.files.progressive[2].width,
                            url: res.data.request.files.progressive[2].url,
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

    const getFavorites = async () => {
        var workoutList = [];

        await database().ref(`users/${profileData.userId}/favorites/workouts`).once("value")
            .then((snapshot) => {
                if (snapshot.val() !== undefined && snapshot.val() !== null) {
                    snapshot.forEach((item) => {
                        if (item.val().type === "wod") {
                            workoutList.push({
                                ...item.val(),
                                id: item.key
                            });
                        } else {
                            workoutList.push({
                                ...item.val(),
                                id: item.key
                            });
                        }
                        setFavoritedList(workoutList);
                    })
                } else {
                    setFavoritedList([]);
                }
            })
            .catch((err) => {
                setFavoritedList([]);
            })
    }

    const addFavorites = (item) => {
        const myMoveList = VideoList;
        setSaveLoading(true);
        if (FavoritedList.filter(q => q.id === Workout.id).length === 0) {

            const nowDate = moment().format("DD-MM-YYYY");
            const Target = profileData.questions?.target !== undefined ? profileData.questions?.target : 'Yok';
            let BannerDescription = ""

            switch (Target) {
                case "Kas Kütlesi Artışı":
                    BannerDescription = "Dizayn edilen bu antrenman programı mevcut kas kütlesi ve kuvvetin geliştirilmesini sağlamaktadır. Programlamada yer alan egzersizlerin sıralaması maksimum oranda kas kütlesi gelişiminin sağlanması için bir gün tamamen üst vücut egzersizlerinden oluşurken, diğer gün tamamen alt vücut egzersizlerinden oluşmaktadır.";
                    break;
                case "Yağ Oranı Azaltma":
                    BannerDescription = "Metabolik olarak daha hızlı ve daha ince bir görünüşe sahip olmak için dizayn edilen bu programda yağ oranınız azalırken aynı zamanda daha fonksiyonel ve fit bir fiziksel yapıya da sahip olacaksınız.";
                    break;
                case "Formda Kalma":
                    BannerDescription = "Daha sıkı ve atletik bir fiziksel görünüm kazanmanız için dizayn edilen bu antrenman programı, mevcut yağ oranınız düşmesini sağlarken, aynı zamanda da daha kuvvetli ve dayanıklı olmanızı sağlayacaktır.";
                    break;
                default:
                    BannerDescription = "";
                    break;
            }

            database().ref('users').child(profileData.userId + '/favorites/workouts/' + nowDate).set({
                date: moment().format("DD/MM/YYYYTHH:mm:ss"),
                bannerDescription: BannerDescription,
                moves: myMoveList,
                workouttype: 'special'
            })
                .then(() => {
                    getFavorites();
                    setSaveLoading(false);
                    setAlertSuccessTitle("Başarılı");
                    setAlertSuccessSubTitle("Antrenman favorilerinize eklendi.")
                    setTimeout(() => {
                        setShowAlert(true);
                    }, 200);
                })
                .catch((err) => {
                    setSaveLoading(false);
                    setTimeout(() => {
                        Alert.alert('Hata', 'Bir hata oluştu, lütfen daha sonra tekrar deneyin.');
                    }, 200);
                })
        } else {
            database().ref('users').child(profileData.userId + '/favorites/workouts/' + item.id).remove()
                .then(() => {
                    setFavoritedList(FavoritedList.filter(q => q.id !== Workout.id))
                    setSaveLoading(false);
                    setAlertSuccessTitle("Başarılı");
                    setAlertSuccessSubTitle("Antrenman favorilerinizden kaldırıldı.");
                    setTimeout(() => {
                        setShowAlert(true);
                    }, 200);
                })
                .catch((err) => {
                    setSaveLoading(false);
                    setTimeout(() => {
                        Alert.alert('Hata', 'Bir hata oluştu, lütfen daha sonra tekrar deneyin.');
                    }, 200);
                })
        }
    }


    useEffect(() => {
        getMyWorkouts();
        getFavorites();
    }, [])

    const getSelectedDay = async (date) => {
        setLoading(true);

        let selectedDays = profileData.workoutDays !== undefined ? profileData.workoutDays : 'Yok';
        var oneDate = moment(moment(), 'DD-MM-YYYY');
        var dayName = oneDate.format('dddd');
        const isWd = MyHistory[moment(date).format("DD-MM-YYYY")];
        if (isWd !== undefined) {
            setSelectedDate(date)
            setWorkout(isWd);
            getVideo(isWd.moves);
            setWorkoutKey(isWd.id);

            let point = 0;
            var kcal = 0;

            Object.values(isWd.moves).forEach((wrk) => {

                if (wrk.type === "reps") {
                    if (wrk.set && wrk.reps !== undefined) {
                        point += parseFloat(wrk.set) * parseFloat(wrk.reps);
                    }
                    if (wrk.calorie !== undefined) {
                        kcal += parseFloat(wrk.calorie);
                    }
                } else {
                    if (wrk.time !== undefined) {
                        point += parseFloat(wrk.time) / parseFloat(10);
                    }
                    if (wrk.calorie !== undefined) {
                        kcal += parseFloat(wrk.calorie);
                    }
                }
            })
            settotalKcal(kcal);
            setTotalPoint(point)

        } else if (moment(date).format("DD/MM/YYYY") === MyHistory[moment(date).format("DD-MM-YYYY")]) {
            var wd = selectedDays.filter(q => q === dayName);
            if (wd.length !== 0) {
                setSelectedDate(date)
                setLoading(false);
            } else {
                setLoading(false);
            }
        } else {
            setLoading(false);
            setTimeout(() => {
                Alert.alert('Antrenman Yok', 'Seçili güne ait antrenman kaydı bulunamadı.', [
                    { text: 'Kapat', style: 'cancel' }
                ]);
            }, 200);
        }
    }

    const createWorkout = async () => {
        setLoading(true);
        let cronicProblems = profileData.questions?.cronicproblems !== undefined ? profileData.questions?.cronicproblems : 'Yok';
        let selectedDays = profileData.workoutDays !== undefined ? profileData.workoutDays : 'Yok';
        let Target = profileData.questions?.target !== undefined ? profileData.questions?.target : 'Yok';

        var oneDate = moment(moment(), 'DD-MM-YYYY');
        var dayName = oneDate.format('dddd');
        var BannerDescription = ""
        let oncekiGun = "Alt Vücut"

        switch (Target) {
            case "Kas Kütlesi Artışı":

                BannerDescription = "Dizayn edilen bu antrenman programı mevcut kas kütlesi ve kuvvetin geliştirilmesini sağlamaktadır. Programlamada yer alan egzersizlerin sıralaması maksimum oranda kas kütlesi gelişiminin sağlanması için bir gün tamamen üst vücut egzersizlerinden oluşurken, diğer gün tamamen alt vücut egzersizlerinden oluşmaktadır.";
                break;
            case "Yağ Oranı Azaltma":
                BannerDescription = "Metabolik olarak daha hızlı ve daha ince bir görünüşe sahip olmak için dizayn edilen bu programda yağ oranınız azalırken aynı zamanda daha fonksiyonel ve fit bir fiziksel yapıya da sahip olacaksınız.";
                break;
            case "Formda Kalma":
                BannerDescription = "Daha sıkı ve atletik bir fiziksel görünüm kazanmanız için dizayn edilen bu antrenman programı, mevcut yağ oranınız düşmesini sağlarken, aynı zamanda da daha kuvvetli ve dayanıklı olmanızı sağlayacaktır.";
                break;

            default:
                BannerDescription = "";
                break;
        }


        if (selectedDays !== 'Yok') {
            var wd = selectedDays.filter(q => q === dayName);
            if (wd.length !== 0) {
                let StatikList = [];
                let MobiliteList = [];
                let KuvvetList = [];
                let CoreList = [];

                let mevcutList = [];

                function shuffle(a) {
                    var j, x, i;
                    for (i = a.length - 1; i > 0; i--) {
                        j = Math.floor(Math.random() * (i + 1));
                        x = a[i];
                        a[i] = a[j];
                        a[j] = x;
                    }
                    return a;
                }

                let allWorkoutArr = [];
                let workoutArr = []
                await database().ref('workouts').once('value')
                    .then((snapshot) => {
                        snapshot.forEach((item) => {
                            allWorkoutArr.push({
                                ...item.val(),
                                id: item.key
                            })
                        })
                        return workoutArr = shuffle(allWorkoutArr);

                    })
                    .catch((err) => {
                        setSaveLoading(false);
                        setLoading(false);
                    })

                let filteredA = cronicProblems !== "Yok" ? workoutArr.filter(item => !Object.values(item.notfor).includes(cronicProblems)) : workoutArr;
                await database().ref('users/' + profileData.userId + '/workouts').once('value')
                    .then(snapshot => {
                        var ind = 0;
                        snapshot.forEach((work) => {
                            if (work.val().moves !== undefined) {
                                mevcutList[ind] = {
                                    ...work.val()
                                }
                                ind = ind + 1
                            }
                        })
                        if (Object.values(mevcutList[mevcutList.length - 1].moves) !== undefined && Object.values(mevcutList[mevcutList.length - 1].moves.includes("Alt Vücut"))) {
                            oncekiGun = "Alt Vücut"
                        } else {
                            oncekiGun = "Üst Vücut"
                        }
                    })
                    .catch((err) => console.log('errorrr', err))

                filteredA.forEach((item) => {
                    var move = item;

                    //SEVİYE 1 İÇİN BAŞLANGIÇ KAS KÜTLESİ
                    if (profileData.point < 10000 && Target === "Kas Kütlesi Artışı") {


                        if (move.category === "Core Egzersizi" && CoreList.length < 3) {
                            if (move.category === "Core Egzersizi" && move.type === "time") {
                                CoreList.push({
                                    ...move,
                                    calorie: 15 * 3,
                                    completed: false,
                                    id: move.id,
                                    set: 3,
                                    pause: 60,
                                    time: 15
                                })
                            } else {
                                CoreList.push({
                                    ...move,
                                    calorie: 10 * 3,
                                    completed: false,
                                    id: move.id,
                                    set: 3,
                                    pause: 60,
                                    reps: 10
                                })
                            }
                        }

                        if (move.category === "Mobilite ve Dinamik Isınma" && MobiliteList.length < 3) {
                            if (move.category === "Mobilite ve Dinamik Isınma" && move.type === "time") {
                                MobiliteList.push({
                                    ...move,
                                    calorie: 10 * 3,
                                    completed: false,
                                    id: move.id,
                                    set: 3,
                                    pause: 60,
                                    time: 10
                                })
                            } else {
                                MobiliteList.push({
                                    ...move,
                                    calorie: 10 * 3,
                                    completed: false,
                                    id: move.id,
                                    set: 3,
                                    pause: 60,
                                    reps: 10
                                })
                            }
                        }

                        if (oncekiGun === "Alt Vücut") {
                            if (move.category == "Alt Vücut" && KuvvetList.length < 6) {
                                KuvvetList.push({
                                    ...move,
                                    calorie: 10 * 4,
                                    completed: false,
                                    id: move.id,
                                    set: 4,
                                    pause: 60,
                                    reps: 10
                                })
                            }
                        } else {
                            if (move.category === "Üst Vücut" && KuvvetList.length < 6) {
                                KuvvetList.push({
                                    ...move,
                                    calorie: 10 * 4,
                                    completed: false,
                                    id: move.id,
                                    set: 4,
                                    pause: 60,
                                    reps: 10
                                })
                            }
                        }


                        if (move.category === "Statik Stretching" && StatikList.length <= 8) {
                            StatikList.push({
                                ...move,
                                calorie: 10 * 3,
                                completed: false,
                                id: move.id,
                                set: 3,
                                pause: 60,
                                time: 10
                            })
                        }

                    }

                    //SEVİYE 1 İÇİN KAS KÜTLESİ SON

                    // SEVİYE 1 İÇİN YAĞ ORANI AZALTMA BAŞLANGIÇ
                    if (profileData.point < 10000 && Target === "Yağ Oranı Azaltma") {

                        if (move.category === "Core Egzersizi" && CoreList.length < 4 && CoreList.filter(q => q.name === move.name).length === 0) {
                            if (move.category === "Core Egzersizi" && move.type === "time") {
                                CoreList.push({
                                    ...move,
                                    calorie: 15 * 3,
                                    completed: false,
                                    id: move.id,
                                    set: 3,
                                    pause: 30,
                                    time: 15
                                })
                            } else {
                                CoreList.push({
                                    ...move,
                                    calorie: 10 * 3,
                                    completed: false,
                                    id: move.id,
                                    set: 3,
                                    pause: 30,
                                    reps: 10
                                })
                            }
                        }

                        if (move.category === "Mobilite ve Dinamik Isınma" && MobiliteList.length < 3 && MobiliteList.filter(q => q.name === move.name).length === 0) {
                            if (move.category === "Mobilite ve Dinamik Isınma" && move.type === "time") {
                                MobiliteList.push({
                                    ...move,
                                    calorie: 10 * 2,
                                    completed: false,
                                    id: move.id,
                                    set: 2,
                                    pause: 30,
                                    time: 10
                                })
                            } else {
                                MobiliteList.push({
                                    ...move,
                                    calorie: 10 * 2,
                                    completed: false,
                                    id: move.id,
                                    set: 2,
                                    pause: 30,
                                    reps: 10
                                })
                            }
                        }

                        if (KuvvetList.length < 8) {
                            if (move.category === "Alt Vücut" && KuvvetList.filter(q => q.name === move.name).length === 0 && KuvvetList.filter(q => q.category === "Alt Vücut").length < 4) {
                                KuvvetList.push({
                                    ...move,
                                    calorie: 15 * 2,
                                    completed: false,
                                    id: move.id,
                                    set: 2,
                                    pause: 30,
                                    reps: 15
                                })
                            }

                            if (move.category === "Üst Vücut" && KuvvetList.filter(q => q.name === move.name).length === 0 && KuvvetList.filter(q => q.category === "Üst Vücut").length < 4) {
                                KuvvetList.push({
                                    ...move,
                                    calorie: 15 * 2,
                                    completed: false,
                                    id: move.id,
                                    set: 2,
                                    pause: 30,
                                    reps: 15
                                })
                            }
                        }

                        if (move.category === "Statik Stretching" && StatikList.length < 8 && KuvvetList.filter(q => q.name === move.name).length === 0) {
                            StatikList.push({
                                ...move,
                                calorie: 10 * 2,
                                completed: false,
                                id: move.id,
                                set: 2,
                                pause: 30,
                                time: 10
                            })
                        }

                    }

                    // SEVİYE 1 İÇİN YAĞ ORANI AZALTMA SON

                    // SEVİYE 1 İÇİN FİT OLMA BAŞLANGIÇ
                    if (profileData.point < 10000 && Target === "Formda Kalma") {
                        if (move.category === "Core Egzersizi" && CoreList.length < 5) {
                            if (move.category === "Core Egzersizi" && move.type === "time") {
                                CoreList.push({
                                    ...move,
                                    calorie: 15 * 3,
                                    completed: false,
                                    id: move.id,
                                    set: 3,
                                    pause: 45,
                                    time: 15
                                })
                            } else {
                                CoreList.push({
                                    ...move,
                                    calorie: 10 * 3,
                                    completed: false,
                                    id: move.id,
                                    set: 3,
                                    pause: 45,
                                    reps: 10
                                })
                            }
                        }

                        if (move.category === "Mobilite ve Dinamik Isınma" && MobiliteList.length < 3) {
                            if (move.category === "Mobilite ve Dinamik Isınma" && move.type === "time") {
                                MobiliteList.push({
                                    ...move,
                                    calorie: 10 * 3,
                                    completed: false,
                                    id: move.id,
                                    set: 3,
                                    pause: 45,
                                    time: 10
                                })
                            } else {
                                MobiliteList.push({
                                    ...move,
                                    calorie: 10 * 3,
                                    completed: false,
                                    id: move.id,
                                    set: 3,
                                    pause: 45,
                                    reps: 10
                                })
                            }
                        }

                        if (KuvvetList.length < 5) {
                            if (move.category === "Alt Vücut" && KuvvetList.filter(q => q.name === move.name).length === 0 && KuvvetList.filter(q => q.category === "Alt Vücut").length < 2) {
                                KuvvetList.push({
                                    ...move,
                                    calorie: 10 * 4,
                                    completed: false,
                                    id: move.id,
                                    set: 4,
                                    pause: 45,
                                    reps: 10
                                })
                            }

                            if (move.category === "Üst Vücut" && KuvvetList.filter(q => q.name === move.name).length === 0 && KuvvetList.filter(q => q.category === "Üst Vücut").length < 3) {
                                KuvvetList.push({
                                    ...move,
                                    calorie: 15 * 4,
                                    completed: false,
                                    id: move.id,
                                    set: 4,
                                    pause: 45,
                                    reps: 15
                                })
                            }
                        }

                        if (move.category === "Statik Stretching" && StatikList.length < 8) {
                            StatikList.push({
                                ...move,
                                calorie: 10 * 3,
                                completed: false,
                                id: move.id,
                                set: 3,
                                pause: 45,
                                time: 10
                            })
                        }

                    }

                    // SEVİYE 1 İÇİN FİT OLMA SON

                    /////// SEVİYE 2 //////

                    /// KAS KÜTLES ARTIŞI SEVİYE 2 BAŞLANGIÇ

                    if (profileData.point >= 10001 && profileData.point <= 15000 && Target === "Kas Kütlesi Artışı") {
                        if (move.category === "Core Egzersizi" && CoreList.length < 3) {
                            if (move.category === "Core Egzersizi" && move.type === "time") {
                                CoreList.push({
                                    ...move,
                                    calorie: 15 * 3,
                                    completed: false,
                                    id: move.id,
                                    set: 3,
                                    pause: 60,
                                    time: 15
                                })
                            } else {
                                CoreList.push({
                                    ...move,
                                    calorie: 15 * 3,
                                    completed: false,
                                    id: move.id,
                                    set: 3,
                                    pause: 60,
                                    reps: 15
                                })
                            }
                        }

                        if (move.category === "Mobilite ve Dinamik Isınma" && MobiliteList.length < 3) {
                            if (move.category === "Mobilite ve Dinamik Isınma" && move.type === "time") {
                                MobiliteList.push({
                                    ...move,
                                    calorie: 10 * 3,
                                    completed: false,
                                    id: move.id,
                                    set: 3,
                                    pause: 60,
                                    time: 10
                                })
                            } else {
                                MobiliteList.push({
                                    ...move,
                                    calorie: 10 * 3,
                                    completed: false,
                                    id: move.id,
                                    set: 3,
                                    pause: 60,
                                    reps: 10
                                })
                            }
                        }

                        if (oncekiGun === "Alt Vücut") {
                            if (move.category == "Alt Vücut" && KuvvetList.length < 8) {
                                KuvvetList.push({
                                    ...move,
                                    calorie: 10 * 4,
                                    completed: false,
                                    id: move.id,
                                    set: 4,
                                    pause: 60,
                                    reps: 10
                                })
                            }
                        } else {
                            if (move.category === "Üst Vücut" && KuvvetList.length < 4) {
                                KuvvetList.push({
                                    ...move,
                                    calorie: 10 * 4,
                                    completed: false,
                                    id: move.id,
                                    set: 4,
                                    pause: 60,
                                    reps: 10
                                })
                            }
                        }


                        if (move.category === "Statik Stretching" && StatikList.length < 8) {
                            StatikList.push({
                                ...move,
                                calorie: 10 * 3,
                                completed: false,
                                id: move.id,
                                set: 3,
                                pause: 60,
                                time: 10
                            })
                        }

                    }

                    //SEVİYE 2 İÇİN KAS KÜTLESİ SON

                    // SEVİYE 2 İÇİN YAĞ ORANI AZALTMA BAŞLANGIÇ
                    if (profileData.point >= 10001 && profileData.point <= 15000 && Target === "Yağ Oranı Azaltma") {
                        if (move.category === "Core Egzersizi" && CoreList.length < 3) {
                            if (move.category === "Core Egzersizi" && move.type === "time") {
                                CoreList.push({
                                    ...move,
                                    calorie: 15 * 3,
                                    completed: false,
                                    id: move.id,
                                    set: 3,
                                    pause: 30,
                                    time: 15
                                })
                            } else {
                                CoreList.push({
                                    ...move,
                                    calorie: 10 * 3,
                                    completed: false,
                                    id: move.id,
                                    set: 3,
                                    pause: 30,
                                    reps: 10
                                })
                            }
                        }

                        if (move.category === "Mobilite ve Dinamik Isınma" && MobiliteList.length < 3) {
                            if (move.category === "Mobilite ve Dinamik Isınma" && move.type === "time") {
                                MobiliteList.push({
                                    ...move,
                                    calorie: 10 * 2,
                                    completed: false,
                                    id: move.id,
                                    set: 2,
                                    pause: 30,
                                    time: 10
                                })
                            } else {
                                MobiliteList.push({
                                    ...move,
                                    calorie: 10 * 2,
                                    completed: false,
                                    id: move.id,
                                    set: 2,
                                    pause: 30,
                                    reps: 10
                                })
                            }
                        }

                        if (KuvvetList.length < 8) {
                            if (move.category === "Alt Vücut" && KuvvetList.filter(q => q.name === move.name).length === 0 && KuvvetList.filter(q => q.category === "Alt Vücut").length < 4) {
                                KuvvetList.push({
                                    ...move,
                                    calorie: 15 * 3,
                                    completed: false,
                                    id: move.id,
                                    set: 3,
                                    pause: 30,
                                    reps: 15
                                })
                            }

                            if (move.category === "Üst Vücut" && KuvvetList.filter(q => q.name === move.name).length === 0 && KuvvetList.filter(q => q.category === "Üst Vücut").length < 4) {
                                KuvvetList.push({
                                    ...move,
                                    calorie: 10 * 3,
                                    completed: false,
                                    id: move.id,
                                    set: 3,
                                    pause: 30,
                                    reps: 10
                                })
                            }
                        }

                        if (move.category === "Statik Stretching" && StatikList.length < 8) {
                            StatikList.push({
                                ...move,
                                calorie: 10 * 2,
                                completed: false,
                                id: move.id,
                                set: 2,
                                pause: 30,
                                time: 10
                            })
                        }

                    }

                    // SEVİYE 2 İÇİN YAĞ ORANI AZALTMA SON

                    // SEVİYE 2 İÇİN FİT OLMA BAŞLANGIÇ
                    if (profileData.point >= 10001 && profileData.point <= 15000 && Target === "Formda Kalma") {
                        if (move.category === "Core Egzersizi" && CoreList.length < 5) {
                            if (move.category === "Core Egzersizi" && move.type === "time") {
                                CoreList.push({
                                    ...move,
                                    calorie: 15 * 3,
                                    completed: false,
                                    id: move.id,
                                    set: 3,
                                    pause: 30,
                                    time: 15
                                })
                            } else {
                                CoreList.push({
                                    ...move,
                                    calorie: 10 * 3,
                                    completed: false,
                                    id: move.id,
                                    set: 3,
                                    pause: 30,
                                    reps: 10
                                })
                            }
                        }

                        if (move.category === "Mobilite ve Dinamik Isınma" && MobiliteList.length < 4) {
                            if (move.category === "Mobilite ve Dinamik Isınma" && move.type === "time") {
                                MobiliteList.push({
                                    ...move,
                                    calorie: 10 * 2,
                                    completed: false,
                                    id: move.id,
                                    set: 2,
                                    pause: 30,
                                    time: 10
                                })
                            } else {
                                MobiliteList.push({
                                    ...move,
                                    calorie: 10 * 2,
                                    completed: false,
                                    id: move.id,
                                    set: 2,
                                    pause: 30,
                                    reps: 10
                                })
                            }
                        }

                        if (KuvvetList.length < 8) {
                            if (move.category === "Alt Vücut" && KuvvetList.filter(q => q.name === move.name).length === 0 && KuvvetList.filter(q => q.category === "Alt Vücut").length < 4) {
                                KuvvetList.push({
                                    ...move,
                                    calorie: 15 * 3,
                                    completed: false,
                                    id: move.id,
                                    set: 3,
                                    pause: 30,
                                    reps: 15
                                })
                            }

                            if (move.category === "Üst Vücut" && KuvvetList.filter(q => q.name === move.name).length === 0 && KuvvetList.filter(q => q.category === "Üst Vücut").length < 4) {
                                KuvvetList.push({
                                    ...move,
                                    calorie: 15 * 3,
                                    completed: false,
                                    id: move.id,
                                    set: 3,
                                    pause: 30,
                                    reps: 15
                                })
                            }
                        }

                        if (move.category === "Statik Stretching" && StatikList.length < 8) {
                            StatikList.push({
                                ...move,
                                calorie: 10 * 2,
                                completed: false,
                                id: move.id,
                                set: 2,
                                pause: 45,
                                time: 10
                            })
                        }

                    }

                    // SEVİYE 2 İÇİN FİT OLMA SON


                    /////// SEVİYE 3 //////

                    /// KAS KÜTLES ARTIŞI SEVİYE 3 BAŞLANGIÇ

                    if (profileData.point >= 15001 && Target === "Kas Kütlesi Artışı") {
                        if (move.category === "Core Egzersizi" && CoreList.length < 3) {
                            if (move.category === "Core Egzersizi" && move.type === "time") {
                                CoreList.push({
                                    ...move,
                                    calorie: 15 * 3,
                                    completed: false,
                                    id: move.id,
                                    set: 3,
                                    pause: 60,
                                    time: 15
                                })
                            } else {
                                CoreList.push({
                                    ...move,
                                    calorie: 15 * 3,
                                    completed: false,
                                    id: move.id,
                                    set: 3,
                                    pause: 60,
                                    reps: 15
                                })
                            }
                        }

                        if (move.category === "Mobilite ve Dinamik Isınma" && MobiliteList.length < 3) {
                            if (move.category === "Mobilite ve Dinamik Isınma" && move.type === "time") {
                                MobiliteList.push({
                                    ...move,
                                    calorie: 10 * 3,
                                    completed: false,
                                    id: move.id,
                                    set: 3,
                                    pause: 60,
                                    time: 10
                                })
                            } else {
                                MobiliteList.push({
                                    ...move,
                                    calorie: 10 * 3,
                                    completed: false,
                                    id: move.id,
                                    set: 3,
                                    pause: 60,
                                    reps: 10
                                })
                            }
                        }

                        if (oncekiGun === "Alt Vücut") {
                            if (move.category == "Alt Vücut" && KuvvetList.length < 8) {
                                KuvvetList.push({
                                    ...move,
                                    calorie: 12 * 4,
                                    completed: false,
                                    id: move.id,
                                    set: 4,
                                    pause: 60,
                                    reps: 12
                                })
                            }
                        } else {
                            if (move.category === "Üst Vücut" && KuvvetList.length < 8) {
                                KuvvetList.push({
                                    ...move,
                                    calorie: 12 * 4,
                                    completed: false,
                                    id: move.id,
                                    set: 4,
                                    pause: 60,
                                    reps: 12
                                })
                            }
                        }


                        if (move.category === "Statik Stretching" && StatikList.length < 8) {
                            StatikList.push({
                                ...move,
                                calorie: 10 * 3,
                                completed: false,
                                id: move.id,
                                set: 3,
                                pause: 60,
                                time: 10
                            })
                        }

                    }

                    //SEVİYE 3 İÇİN KAS KÜTLESİ SON

                    // SEVİYE 3 İÇİN YAĞ ORANI AZALTMA BAŞLANGIÇ
                    if (profileData.point >= 15001 && Target === "Yağ Oranı Azaltma") {
                        if (move.category === "Core Egzersizi" && CoreList.length < 3) {
                            if (move.category === "Core Egzersizi" && move.type === "time") {
                                CoreList.push({
                                    ...move,
                                    calorie: 15 * 3,
                                    completed: false,
                                    id: move.id,
                                    set: 3,
                                    pause: 30,
                                    time: 15
                                })
                            } else {
                                CoreList.push({
                                    ...move,
                                    calorie: 10 * 3,
                                    completed: false,
                                    id: move.id,
                                    set: 3,
                                    pause: 30,
                                    reps: 10
                                })
                            }
                        }

                        if (move.category === "Mobilite ve Dinamik Isınma" && MobiliteList.length < 3) {
                            if (move.category === "Mobilite ve Dinamik Isınma" && move.type === "time") {
                                MobiliteList.push({
                                    ...move,
                                    calorie: 10 * 2,
                                    completed: false,
                                    id: move.id,
                                    set: 2,
                                    pause: 30,
                                    time: 10
                                })
                            } else {
                                MobiliteList.push({
                                    ...move,
                                    calorie: 10 * 2,
                                    completed: false,
                                    id: move.id,
                                    set: 2,
                                    pause: 30,
                                    reps: 10
                                })
                            }
                        }

                        if (KuvvetList.length < 8) {
                            if (move.category === "Alt Vücut" && KuvvetList.filter(q => q.name === move.name).length === 0 && KuvvetList.filter(q => q.category === "Alt Vücut").length < 4) {
                                KuvvetList.push({
                                    ...move,
                                    calorie: 12 * 4,
                                    completed: false,
                                    id: move.id,
                                    set: 4,
                                    pause: 30,
                                    reps: 12
                                })
                            }

                            if (move.category === "Üst Vücut" && KuvvetList.filter(q => q.name === move.name).length === 0 && KuvvetList.filter(q => q.category === "Üst Vücut").length < 4) {
                                KuvvetList.push({
                                    ...move,
                                    calorie: 12 * 4,
                                    completed: false,
                                    id: move.id,
                                    set: 4,
                                    pause: 30,
                                    reps: 12
                                })
                            }
                        }

                        if (move.category === "Statik Stretching" && StatikList.length < 8) {
                            StatikList.push({
                                ...move,
                                calorie: 10 * 2,
                                completed: false,
                                id: move.id,
                                set: 2,
                                pause: 30,
                                time: 10
                            })
                        }

                    }

                    // SEVİYE 2 İÇİN YAĞ ORANI AZALTMA SON

                    // SEVİYE 2 İÇİN FİT OLMA BAŞLANGIÇ
                    if (profileData.point >= 15001 && Target === "Formda Kalma") {
                        if (move.category === "Core Egzersizi" && CoreList.length < 6) {
                            if (move.category === "Core Egzersizi" && move.type === "time") {
                                CoreList.push({
                                    ...move,
                                    calorie: 25 * 4,
                                    completed: false,
                                    id: move.id,
                                    set: 4,
                                    pause: 45,
                                    time: 25
                                })
                            } else {
                                CoreList.push({
                                    ...move,
                                    calorie: 15 * 4,
                                    completed: false,
                                    id: move.id,
                                    set: 4,
                                    pause: 45,
                                    reps: 15
                                })
                            }
                        }

                        if (move.category === "Mobilite ve Dinamik Isınma" && MobiliteList.length < 3) {
                            if (move.category === "Mobilite ve Dinamik Isınma" && move.type === "time") {
                                MobiliteList.push({
                                    ...move,
                                    calorie: 10 * 3,
                                    completed: false,
                                    id: move.id,
                                    set: 3,
                                    pause: 45,
                                    time: 10
                                })
                            } else {
                                MobiliteList.push({
                                    ...move,
                                    calorie: 10 * 3,
                                    completed: false,
                                    id: move.id,
                                    set: 3,
                                    pause: 45,
                                    reps: 10
                                })
                            }
                        }

                        if (KuvvetList.length < 6) {
                            if (move.category === "Alt Vücut" && KuvvetList.filter(q => q.name === move.name).length === 0 && KuvvetList.filter(q => q.category === "Alt Vücut").length < 3) {
                                KuvvetList.push({
                                    ...move,
                                    calorie: 10 * 4,
                                    completed: false,
                                    id: move.id,
                                    set: 4,
                                    pause: 45,
                                    reps: 10
                                })
                            }

                            if (move.category === "Üst Vücut" && KuvvetList.filter(q => q.name === move.name).length === 0 && KuvvetList.filter(q => q.category === "Üst Vücut").length < 3) {
                                KuvvetList.push({
                                    ...move,
                                    calorie: 10 * 4,
                                    completed: false,
                                    id: move.id,
                                    set: 4,
                                    pause: 45,
                                    reps: 10
                                })
                            }
                        }

                        if (move.category === "Statik Stretching" && StatikList.length < 8) {
                            StatikList.push({
                                ...move,
                                calorie: 10 * 3,
                                completed: false,
                                id: move.id,
                                set: 3,
                                pause: 45,
                                time: 10
                            })
                        }

                    }

                    // SEVİYE 2 İÇİN FİT OLMA SON

                })

                let newKL = [];
                let indAlt = 0;
                let indUst = 1;

                if (KuvvetList.length !== 0) {
                    KuvvetList.forEach(item => {
                        if (item.category === "Alt Vücut") {
                            newKL.push({ ...item, index: indAlt });
                            indAlt = indAlt + 1
                        } else {
                            newKL.push({ ...item, index: indUst });
                            indUst = indUst + 1
                        }
                    })
                }


                var statikLen = StatikList.length;

                let newList = [...StatikList.slice(0, statikLen / 2), ...MobiliteList, ...CoreList, ...newKL.sort((a, b) => a.index - b.index), ...StatikList.slice(statikLen / 2, statikLen)]
                var pushDate = moment().format('DD-MM-YYYY')

                setSaveLoading(true);

                await database().ref('users/' + profileData.userId + '/workouts/' + String(pushDate)).set({
                    bannerDescription: BannerDescription,
                    moves: newList
                })
                    .then((response) => {
                        database().ref('users/' + profileData.userId + '/workouts/' + String(pushDate)).once('value')
                            .then((res) => {
                                getVideo(res.val().moves);
                                setWorkout(res.val());
                                setWorkoutKey(res.key);
                                setSaveLoading(false);
                            })
                            .catch((err) => {
                                console.log('err: ', err)
                                setSaveLoading(false);
                                setLoading(false);
                            })
                    })
                    .catch((err) => {
                        console.log('err: ', err)
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

        await database().ref('users/' + profileData.userId + '/workouts').once('value')
            .then(snapshot => {
                if (snapshot.val() !== null && snapshot.val() !== undefined) {
                    var MyList = [];
                    snapshot.forEach((work) => {
                        if (work.val().length !== 0 && work.val() !== undefined && work.val().moves !== undefined) {
                            MyList[work.key] = {
                                ...work.val(),
                                completed: work.val().completed !== undefined ? work.val().completed : false,
                                id: work.key
                            }

                            markedDatesArray.push({
                                date: moment(work.key, "DD-MM-YYYY").format("YYYY-MM-DD"),
                                completed: work.val().completed !== undefined && work.val().completed === true ? true : false,
                                dots: [
                                    {
                                        color: work.val().completed !== undefined && work.val().completed === true ? '#00FF00' : '#9D9D9D',
                                    },
                                ],
                            });
                        }
                    })

                    setMyHistory(MyList);

                    var isWd = MyList[moment().format("DD-MM-YYYY")];

                    if (isWd !== undefined && isWd.moves !== undefined) {
                        let point = 0;
                        var kcal = 0;

                        Object.values(isWd.moves).forEach((wrk) => {

                            if (wrk.type === "reps") {
                                if (wrk.set && wrk.reps !== undefined) {
                                    point += parseFloat(wrk.set) * parseFloat(wrk.reps);
                                }
                                if (wrk.calorie !== undefined) {
                                    kcal += parseFloat(wrk.calorie);
                                }
                            } else {
                                if (wrk.time !== undefined) {
                                    point += parseFloat(wrk.time) / parseFloat(10);
                                }
                                if (wrk.calorie !== undefined) {
                                    kcal += parseFloat(wrk.calorie);
                                }
                            }
                        })
                        settotalKcal(kcal);
                        setTotalPoint(point)
                        getVideo(isWd.moves);
                        setWorkout(isWd);
                        setWorkoutKey(isWd.id);
                    } else {
                        createWorkout();
                    }
                } else {
                    createWorkout();
                }

            })
            .catch((err) => {
                console.log('null workouts: ', err)
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

                <SCLAlert
                    theme="success"
                    show={ShowAlert}
                    title={AlertSuccessTitle}
                    subtitle={AlertSuccessSubTitle}
                    onRequestClose={() => setShowAlert(!ShowAlert)}
                >
                    <SCLAlertButton theme="success" onPress={() => setShowAlert(!ShowAlert)}>Tamam</SCLAlertButton>
                </SCLAlert>

                <View style={styles.header} >
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => setShowSideModal(!ShowSideModal)}>
                            <Icon name="menu" color="#FFF" size={32} style={{ marginRight: 15 }} />
                        </TouchableOpacity>
                        <Text style={styles.headerText}>Antrenman</Text>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>

                        <TouchableHighlight onPress={() => navigation.navigate('Feed')}>
                            <Icon name="comment" color="#FFF" size={28} style={{ marginRight: 20 }} />
                        </TouchableHighlight>

                        <TouchableHighlight onPress={() => navigation.navigate('Settings')}>
                            <Icon name="settings" color="#FFF" size={28} />
                        </TouchableHighlight>

                    </View>
                </View>

                <ScrollView style={{ width: '100%', height: height }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', width: '100%', marginTop: 10 }}>

                        <View style={{ width: width / 2, justifyContent: 'center', alignItems: 'center' }}>
                            <AnimatedCircularProgress
                                size={width / 2.5}
                                width={4}
                                rotation={90}
                                fill={100}
                                tintColor="#376F19"
                                backgroundColor="#4D4D4D">
                                {(fill) => (
                                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={styles.headerText}>Bugün</Text>
                                        <Text style={styles.circleHeaderText}>{fitnessData.calories.length !== 0 ? parseFloat(fitnessData.calories[0].quantity).toFixed(0) : 0}</Text>
                                        <Text style={styles.targetHeader}>Kalori</Text>
                                    </View>
                                )}
                            </AnimatedCircularProgress>
                        </View>

                        <View style={{ width: width / 2, justifyContent: 'center', alignItems: 'center' }}>
                            <AnimatedCircularProgress
                                size={width / 2.5}
                                width={4}
                                rotation={90}
                                fill={100}
                                tintColor="yellow"
                                backgroundColor="#4D4D4D">
                                {(fill) => (
                                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={styles.headerText}>Bugün</Text>
                                        <Text style={styles.circleHeaderText}>{fitnessData.steps.length !== 0 ? parseFloat(fitnessData.steps[7].quantity).toFixed(0) : 0}</Text>
                                        <Text style={styles.targetHeader}>Adım</Text>
                                    </View>
                                )}
                            </AnimatedCircularProgress>
                        </View>
                    </View>

                    <View style={{ width: '100%', paddingHorizontal: 10 }}>
                        {!Loading &&
                            <CalendarStrip
                                scrollable={true}
                                datesBlacklist={datesBlacklist}
                                selectedDate={SelectedDate}
                                maxDate={moment()}
                                minDate={moment().subtract(31, 'days')}
                                showMonth={false}
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

                    {!Loading && !isCompleted ?
                        <>
                            <View style={{ paddingHorizontal: 20, flexDirection: 'row', paddingVertical: 10, justifyContent: 'space-between', alignItems: 'center' }}>
                                {!Loading &&

                                    <TouchableOpacity onPress={() => addFavorites(Workout)}
                                        style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                                        <Icon name={FavoritedList.filter(q => q.id === Workout.id).length !== 0 ? "favorite" : "favorite-outline"} color="yellow" size={26} />
                                        <Text style={{
                                            fontFamily: 'SFProDisplay-Medium',
                                            fontSize: 15,
                                            color: 'yellow',
                                            marginLeft: 10
                                        }}
                                        >Favori</Text>
                                    </TouchableOpacity>
                                }

                                {!Loading &&
                                    <TouchableOpacity onPress={() => CreateNewOne()}
                                        style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                                        <Icon name="refresh" color="yellow" size={26} />
                                        <Text style={{
                                            fontFamily: 'SFProDisplay-Medium',
                                            fontSize: 15,
                                            color: 'yellow',
                                            marginLeft: 10
                                        }}
                                        >Yeni Antrenman Oluştur</Text>
                                    </TouchableOpacity>
                                }

                            </View>

                            {!Loading && VideoList.length > 1 &&
                                <>
                                    <FlatList style={{ flex: 1, flexGrow: 1, paddingHorizontal: 20 }}
                                        scrollEnabled={false}
                                        contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
                                        data={VideoList}
                                        ListHeaderComponent={() => {
                                            let workoutTime = VideoList.reduce(function (prev, current) {
                                                let calcDuration = parseFloat(current.duration) * parseFloat(current.set);
                                                return prev + +calcDuration;
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
                                                                }}>{totalKcal} kcal</Text>
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
                                                                }}>{TotalPoint} puan</Text>
                                                            </View>
                                                        </View>

                                                    </View>

                                                    <TouchableOpacity onPress={() => {
                                                        if (VideoList.length !== 0) {
                                                            navigation.navigate('WorkoutSpecial', { VideoList: VideoList, key: WorkoutKey })
                                                        } else if (Workout.completed === true) {
                                                            Alert.alert('Uyarı', 'Bu antrenman zaten tamamlanmış.');
                                                        }
                                                        else {
                                                            Alert.alert('Hata', 'Bu antrenmanda hiç video yok.');
                                                        }
                                                    }}
                                                        style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                                                        <Text style={{
                                                            fontFamily: 'SFProDisplay-Medium',
                                                            fontSize: 15,
                                                            color: 'yellow',
                                                            marginRight: 10
                                                        }}
                                                        >Hemen Başla</Text>
                                                        <Icon name="keyboard-arrow-right" color="yellow" size={26} />
                                                    </TouchableOpacity>
                                                </>
                                            )
                                        }}
                                        keyExtractor={(item, index) => index.toString()}
                                        renderItem={(workouts) => {
                                            var item = workouts.item;
                                            return (item &&
                                                <TouchableOpacity key={item.id} onPress={() => navigation.navigate('MoveThumb', { item: item })}
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
                        </>
                        :
                        <>
                            {!Loading &&
                                <View style={{ height: 'auto', paddingHorizontal: 40, marginBottom: 20, marginTop: 30, justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                                    <Icon name="tag-faces" size={64} color="#4D4D4D" />
                                    <Text style={[styles.headerText, { color: '#4D4D4D', fontSize: 16, textAlign: 'center', marginTop: 10 }]}>Tebrikler! Seçili günün antrenmanını tamamladınız.</Text>
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
export default Antrenman;