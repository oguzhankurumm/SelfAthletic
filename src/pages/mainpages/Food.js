import React, { useState, useEffect, useLayoutEffect } from 'react'
import { View, Text, Image, StyleSheet, StatusBar, TouchableOpacity, TouchableHighlight, Dimensions, ImageBackground, SafeAreaView, ScrollView, FlatList, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import { database } from '../../config/config';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import SpinnerLoading from '../../components/SpinnerLoading';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Sidebar from '../../components/Sidebar';
import moment from 'moment';
import 'moment/locale/tr';
moment.locale('tr');
import CalendarStrip from 'react-native-calendar-strip';
import Modal from 'react-native-modal';
import { SCLAlert, SCLAlertButton } from 'react-native-scl-alert';

const { height, width } = Dimensions.get("window");

const Food = ({ navigation }) => {
    const profileData = useSelector(state => state.user.users);

    const [Loading, setLoading] = useState(true);
    const [SaveLoading, setSaveLoading] = useState(false);

    const [KahvaltiList, setKahvaltiList] = useState([]);
    const [AraList1, setAraList1] = useState([]);
    const [OgleList, setOgleList] = useState([]);
    const [AraList2, setAraList2] = useState([]);
    const [AksamList, setAksamList] = useState([]);
    const [AraList3, setAraList3] = useState([]);

    const [ShowSideModal, setShowSideModal] = useState(false);

    const [AllFoodList, setAllFoodList] = useState([]);
    const [MyFoodList, setMyFoodList] = useState([]);
    const [markedDatesArray, setmarkedDatesArray] = useState([]);
    const [SelectedDate, setSelectedDate] = useState(moment());

    const [TotalKcal, setTotalKcal] = useState(0);
    const [CompletedKcal, setCompletedKcal] = useState(0);
    const [ChartKcal, setChartKcal] = useState(0);
    const [Yag, setYag] = useState(0);
    const [CompletedYag, setCompletedYag] = useState(0);
    const [ChartYag, setChartYag] = useState(0);
    const [TotalKrb, setTotalKrb] = useState(0);
    const [CompletedKrb, setCompletedKrb] = useState(0);
    const [ChartKrb, setChartKrb] = useState(0);
    const [TotalPro, setTotalPro] = useState(0);
    const [CompletedPro, setCompletedPro] = useState(0);
    const [ChartPro, setChartPro] = useState(0);

    const [ShowPopup, setShowPopup] = useState(false);
    const [SelectedFood, setSelectedFood] = useState([]);

    const [ShowAlert, setShowAlert] = useState(false);
    const [ShowSuccess, setShowSuccess] = useState(false);
    const [ShowError, setShowError] = useState(false);
    const [ShowGetWarning, setShowGetWarning] = useState(false);

    const [SelectedReplaceFood, setSelectedReplaceFood] = useState({})

    const dateNumberToday = moment().format("d");

    let PushedFoods = [];

    function filterByValue(array, string) {
        return array.filter(o => Object.values(o.category).includes(string));
    }

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

    const updateFood = async (food, newfood, category) => {
        setShowAlert(false);
        var date = moment(SelectedDate).format("DD-MM-YYYY");
        var index = SelectedReplaceFood.food.index;

        await database().ref('users/' + profileData.userId + `/foods/${String(date)}` + `/${String(category)}`).orderByChild("name").equalTo(food.name).once('value')
            .then(async (res) => {
                const path = res.ref.path;

                await database().ref(`${path}/${index}`).update(newfood)
                    .then(() => {
                        switch (SelectedReplaceFood.type) {
                            case "KahvaltiList":
                                KahvaltiList[index] = newfood;
                                break;

                            case "AraList1":
                                AraList1[index] = newfood;
                                break;

                            case "AraList2":
                                AraList2[index] = newfood;
                                break;

                            case "AraList3":
                                AraList3[index] = newfood;
                                break;

                            case "AksamList":
                                AksamList[index] = newfood;
                                break;

                            case "OgleList":
                                OgleList[index] = newfood;
                                break;

                            default:
                                break;
                        }

                        PushedFoods[newfood.id] = newfood;

                    })
                    .catch((err) => {
                        Alert.alert('Besin değiştirilemedi!', String(err));
                    })
            })
            .catch(err => Alert.alert('Besin değiştirilemedi!', String(err)))
    }

    const replaceFood = async (food) => {
        const anaList = filterByValue(AllFoodList, 'Ana');
        const araList = filterByValue(AllFoodList, 'Ara');
        const kahvaltiList = filterByValue(AllFoodList, 'Kahvalti');

        // let caseAraList = Object.values(araList).filter(function (v, i) {
        //     return (PushedFoods.filter(q => q.name === v["name"]).length === 0 && v["name"] !== food.food.item.name && v["besinSut"] === food.food.item.besinSut && v["besinEkmek"] === food.food.item.besinEkmek && v["besinMeyve"] === food.food.item.besinMeyve && v["besinSebze"] === food.food.item.besinSebze && v["besinYag"] === food.food.item.besinYag && v["besinEYP"] === food.food.item.besinEYP);
        // });

        if (food.type === "KahvaltiList") {
            let caseKahvaltiList = Object.values(kahvaltiList).filter(function (v, i) {
                return (PushedFoods.filter(q => q.name === v["name"]).length === 0 && v["name"] !== food.food.item.name && v["besinSut"] === food.food.item.besinSut && v["besinEkmek"] === food.food.item.besinEkmek && v["besinMeyve"] === food.food.item.besinMeyve && v["besinSebze"] === food.food.item.besinSebze && v["besinYag"] === food.food.item.besinYag && v["besinEYP"] === food.food.item.besinEYP);
            })

            if (caseKahvaltiList.length !== 0) {
                let newSelected = caseKahvaltiList[Math.floor(Math.random() * caseKahvaltiList.length)]
                updateFood(food.food.item, newSelected, "kahvalti");
            } else {
                setShowAlert(false);
                setTimeout(() => {
                    setShowError(true);
                }, 200);
            }

        } else if (food.type === "OgleList") {
            let caseOgleList = Object.values(anaList).filter(function (v, i) {
                return (PushedFoods.filter(q => q.name === v["name"]).length === 0 && v["name"] !== food.food.item.name && v["besinSut"] === food.food.item.besinSut && v["besinEkmek"] === food.food.item.besinEkmek && v["besinMeyve"] === food.food.item.besinMeyve && v["besinSebze"] === food.food.item.besinSebze && v["besinYag"] === food.food.item.besinYag && v["besinEYP"] === food.food.item.besinEYP);
            })

            if (caseOgleList.length !== 0) {
                let newSelected = caseOgleList[Math.floor(Math.random() * caseOgleList.length)]
                updateFood(food.food.item, newSelected, "oglelist");
            } else {
                setShowAlert(false);
                setTimeout(() => {
                    setShowError(true);
                }, 200);
            }

        } else if (food.type === "AksamList") {
            let caseAksamList = Object.values(anaList).filter(function (v, i) {
                return (PushedFoods.filter(q => q.name === v["name"]).length === 0 && v["name"] !== food.food.item.name && v["besinSut"] === food.food.item.besinSut && v["besinEkmek"] === food.food.item.besinEkmek && v["besinMeyve"] === food.food.item.besinMeyve && v["besinSebze"] === food.food.item.besinSebze && v["besinYag"] === food.food.item.besinYag && v["besinEYP"] === food.food.item.besinEYP);
            })

            if (caseAksamList.length !== 0) {
                let newSelected = caseAksamList[Math.floor(Math.random() * caseAksamList.length)]
                updateFood(food.food.item, newSelected, "aksamlist");
            } else {
                setShowAlert(false);
                setTimeout(() => {
                    setShowError(true);
                }, 200);
            }
        } else if (food.type === "AraList1" || food.type === "AraList2" || food.type === "AraList2") {
            let caseAraList = Object.values(araList).filter(function (v, i) {
                return (PushedFoods.filter(q => q.name === v["name"]).length === 0 && v["name"] !== food.food.item.name && v["besinSut"] === food.food.item.besinSut && v["besinEkmek"] === food.food.item.besinEkmek && v["besinMeyve"] === food.food.item.besinMeyve && v["besinSebze"] === food.food.item.besinSebze && v["besinYag"] === food.food.item.besinYag && v["besinEYP"] === food.food.item.besinEYP);
            })

            if (caseAraList.length !== 0) {
                let newSelected = caseAraList[Math.floor(Math.random() * caseAraList.length)]
                if (food.type === "AraList1") {
                    updateFood(food.food.item, newSelected, "aralist1");
                } else if (food.type === "AraList2") {
                    updateFood(food.food.item, newSelected, "aralist2");
                } else if (food.type === "AraList3") {
                    updateFood(food.food.item, newSelected, "aralist3");
                }
            } else {
                setShowAlert(false);
                setTimeout(() => {
                    setShowError(true);
                }, 200);
            }
        } else {
            setShowError(true);
        }
    }

    const closeModal = () => {
        setShowSideModal(!ShowSideModal);
    }

    useLayoutEffect(() => {
        getMyFoodList();
    }, [])

    useEffect(() => {
        database().ref('users/' + profileData.userId + `/foods/`).on("child_changed", function (snapshot, previousChildKey) {
            getMyFoodList();
        })
    }, [])

    const EatFood = async (food, category) => {
        setSaveLoading(true);

        var date = moment(SelectedDate).format("DD-MM-YYYY");

        if (date !== undefined) {

            await database().ref('users/' + profileData.userId + `/foods/${String(date)}` + `/${String(category)}`).orderByChild("name").equalTo(food.item.name).once('value')
                .then(async (res) => {
                    const path = res.ref.path;

                    let key = 0;

                    res.forEach((item) => {
                        key = String(item.key);
                    })

                    let completed = !res.val()[key].completed

                    await database().ref(`${path}/${key}`).update({
                        completed: completed
                    })
                        .then(() => {
                            setSaveLoading(false);

                            if (category === "kahvalti") {
                                const options = KahvaltiList

                                options.forEach((newitem) => {
                                    newitem.completed === completed;
                                })

                                var tempItem = food.item;
                                tempItem.completed = completed;
                                const tempArr = [...KahvaltiList];
                                setKahvaltiList(tempArr);

                            } else if (category === "aralist1") {
                                const options = AraList1

                                options.forEach((newitem) => {
                                    newitem.completed === completed;
                                })

                                var tempItem = food.item;
                                tempItem.completed = completed;
                                const tempArr = [...AraList1];
                                setAraList1(tempArr);

                            } else if (category === "aralist2") {
                                const options = AraList2

                                options.forEach((newitem) => {
                                    newitem.completed === completed;
                                })

                                var tempItem = food.item;
                                tempItem.completed = completed;
                                const tempArr = [...AraList2];
                                setAraList2(tempArr);

                            } else if (category === "aralist3") {
                                const options = AraList3

                                options.forEach((newitem) => {
                                    newitem.completed === completed;
                                })

                                var tempItem = food.item;
                                tempItem.completed = completed;
                                const tempArr = [...AraList3];
                                setAraList3(tempArr);

                            } else if (category === "oglelist") {
                                const options = OgleList

                                options.forEach((newitem) => {
                                    newitem.completed === completed;
                                })

                                var tempItem = food.item;
                                tempItem.completed = completed;
                                const tempArr = [...OgleList];
                                setOgleList(tempArr);
                            } else if (category === "aksamlist") {
                                const options = AksamList

                                options.forEach((newitem) => {
                                    newitem.completed === completed;
                                })

                                var tempItem = food.item;
                                tempItem.completed = completed;
                                const tempArr = [...AksamList];
                                setAksamList(tempArr);
                            }

                        })
                        .catch((err) => {
                            setSaveLoading(false);
                            console.log('food update erorr: ', err);
                        })
                })
                .catch(err => console.log('response err: ', err))


        }
    }

    const getSelectedDay = async (date) => {
        setLoading(true);
        let selectedItem = MyFoodList[date];
        if (selectedItem !== undefined) {
            setSelectedDate(date);
            setKahvaltiList(selectedItem.kahvalti !== undefined ? selectedItem.kahvalti : [])
            setAraList1(selectedItem.aralist1 !== undefined ? selectedItem.aralist1 : [])
            setOgleList(selectedItem.oglelist !== undefined ? selectedItem.oglelist : [])
            setAraList2(selectedItem.aralist2 !== undefined ? selectedItem.aralist2 : [])
            setAksamList(selectedItem.aksamlist !== undefined ? selectedItem.aksamlist : [])
            setAraList3(selectedItem.aralist3 !== undefined ? selectedItem.aralist3 : [])

            setTotalKcal(parseFloat(selectedItem.totalcalorie).toFixed(0));
            setCompletedKcal(parseFloat(selectedItem.completedcalorie).toFixed(0));
            setChartKcal(parseFloat(parseFloat(parseFloat(selectedItem.completedcalorie) / parseFloat(selectedItem.totalcalorie)) * 100).toFixed(1))

            setTotalKrb(parseFloat(selectedItem.totalkrb).toFixed(0));
            setCompletedKrb(parseFloat(selectedItem.completedkrb).toFixed(0));
            setChartKrb(parseFloat(parseFloat(parseFloat(selectedItem.completedkrb) / parseFloat(selectedItem.totalkrb)) * 100).toFixed(1))

            setTotalPro(parseFloat(selectedItem.totalpro).toFixed(0));
            setCompletedPro(parseFloat(selectedItem.completedpro).toFixed(0));
            setChartPro(parseFloat(parseFloat(parseFloat(selectedItem.completedpro) / parseFloat(selectedItem.totalpro)) * 100).toFixed(1))

            setYag(parseFloat(selectedItem.Yag).toFixed(0));
            setCompletedYag(parseFloat(selectedItem.completedyag).toFixed(0));
            setChartYag(parseFloat(parseFloat(parseFloat(selectedItem.completedyag) / parseFloat(selectedItem.Yag)) * 100).toFixed(1))

            setLoading(false);
        } else {
            setLoading(false);
            setShowGetWarning(true);
        }
    }

    const addFavorites = async (category) => {
        var date = moment(SelectedDate).format("DD-MM-YYYY")
        let obj = {}
        let cat = ""

        if (category === "kahvalti") {
            cat = "kahvalti"
            obj = KahvaltiList
        } else if (category === "aralist1") {
            cat = "aralist1"
            obj = AraList1
        } else if (category === "aralist2") {
            cat = "aralist2"
            obj = AraList2
        } else if (category === "aralist3") {
            cat = "aralist3"
            obj = AraList3
        } else if (category === "aksamlist") {
            cat = "aksamlist"
            obj = AksamList
        } else if (category === "oglelist") {
            cat = "oglelist"
            obj = OgleList
        } else {
            obj = {}
        }

        await database().ref(`users/${profileData.userId}/favorites/foods/${date}/${cat}`).set(obj)
            .then(() => {
                setShowSuccess(true);
            })
            .catch((err) => {
                setTimeout(() => {
                    Alert.alert('Hata', 'Bir hata oluştu, lütfen daha sonra tekrar deneyin.');
                }, 200);
            })
    }

    const getMyFoodList = async () => {
        setLoading(true);

        await database().ref('users/' + profileData.userId + '/foods').once('value')
            .then(async (snapshot) => {
                if (snapshot.val() !== null) {
                    var MyList = [];
                    var totalKalori = 0;
                    var completedKalori = 0;
                    var totalKrb = 0;
                    var completedKrb = 0;
                    var totalPro = 0;
                    var completedPro = 0;
                    var Yag = 0;
                    var completedYag = 0;

                    snapshot.forEach((foodlist) => {

                        var aksamlist = foodlist.val().aksamlist;
                        var aralist1 = foodlist.val().aralist1;
                        var aralist2 = foodlist.val().aralist2;
                        var aralist3 = foodlist.val().aralist3;
                        var kahvalti = foodlist.val().kahvalti;
                        var oglelist = foodlist.val().oglelist;

                        let combinedArr = []

                        if (aksamlist !== undefined) {
                            combinedArr = [...combinedArr, ...aksamlist];
                        }

                        if (aralist1 !== undefined) {
                            combinedArr = [...combinedArr, ...aralist1];
                        }

                        if (aralist2 !== undefined) {
                            combinedArr = [...combinedArr, ...aralist2];
                        }

                        if (aralist3 !== undefined) {
                            combinedArr = [...combinedArr, ...aralist3];
                        }

                        if (kahvalti !== undefined) {
                            combinedArr = [...combinedArr, ...kahvalti];
                        }

                        if (oglelist !== undefined) {
                            combinedArr = [...combinedArr, ...oglelist];
                        }

                        combinedArr.forEach((fd) => {
                            // if (fd.completed === true) {
                            //     console.log("true", fd.name)
                            // }

                            if (fd.completed !== undefined) {

                                if (fd.karbonhidrat !== undefined && fd.karbonhidrat !== 0) {
                                    totalKrb = parseFloat(totalKrb) + parseFloat(fd.karbonhidrat);
                                    if (fd.completed === true) {
                                        completedKrb = parseFloat(completedKrb) + parseFloat(fd.karbonhidrat)
                                    }
                                }

                                if (fd.kalori !== undefined && fd.kalori !== 0) {
                                    totalKalori = parseFloat(totalKalori) + parseFloat(fd.kalori);
                                    if (fd.completed === true) {
                                        completedKalori = parseFloat(completedKalori) + parseFloat(fd.kalori)
                                    }
                                }

                                if (fd.yag !== undefined && fd.yag !== 0) {
                                    Yag = parseFloat(Yag) + parseFloat(fd.yag);
                                    if (fd.completed === true) {
                                        completedYag = parseFloat(completedYag) + parseFloat(fd.yag)
                                    }
                                }

                                if (fd.protein !== undefined && fd.protein !== 0) {
                                    totalPro = parseFloat(totalPro) + parseFloat(fd.protein);
                                    if (fd.completed === true) {
                                        completedPro = parseFloat(completedPro) + parseFloat(fd.protein)
                                    }
                                }
                            }
                        })

                        let completed = Object.values(combinedArr).filter(q => q.completed === false).length === 0 ? true : false

                        MyList[foodlist.key] = {
                            ...foodlist.val(),
                            completed: completed,
                            date: foodlist.key,
                            totalcalorie: totalKalori,
                            completedcalorie: completedKalori,
                            Yag: Yag,
                            completedyag: completedYag,
                            totalkrb: totalKrb,
                            completedkrb: completedKrb,
                            totalpro: totalPro,
                            completedpro: completedPro
                        }

                        markedDatesArray.push({
                            date: moment(foodlist.key, "DD-MM-YYYY").format("YYYY-MM-DD"),
                            dots: [
                                {
                                    color: completed === false ? '#9D9D9D' : '#00FF00',
                                },
                            ],
                        });

                    })

                    setMyFoodList(MyList);

                    let today = MyList[moment().format("DD-MM-YYYY")];
                    if (today !== undefined) {

                        let fbFoodsArr = [];

                        await database().ref('foods').once('value')
                            .then((snapshot) => {
                                snapshot.forEach((item) => {
                                    fbFoodsArr.push({
                                        ...item.val(),
                                        id: item.key
                                    })
                                })
                                setAllFoodList(fbFoodsArr);

                            })
                            .catch((err) => {
                                console.log('get food err: ', err)
                                setSaveLoading(false);
                                setLoading(false);
                            })

                            setSelectedDate(moment().format("DD-MM-YYYY"));
                            setKahvaltiList(today.kahvalti !== undefined ? today.kahvalti : [])
                            setAraList1(today.aralist1 !== undefined ? today.aralist1 : [])
                            setOgleList(today.oglelist !== undefined ? today.oglelist : [])
                            setAraList2(today.aralist2 !== undefined ? today.aralist2 : [])
                            setAksamList(today.aksamlist !== undefined ? today.aksamlist : [])
                            setAraList3(today.aralist3 !== undefined ? today.aralist3 : [])
                
                            setTotalKcal(parseFloat(today.totalcalorie).toFixed(0));
                            setCompletedKcal(parseFloat(today.completedcalorie).toFixed(0));
                            setChartKcal(parseFloat(parseFloat(parseFloat(today.completedcalorie) / parseFloat(today.totalcalorie)) * 100).toFixed(1))
                
                            setTotalKrb(parseFloat(today.totalkrb).toFixed(0));
                            setCompletedKrb(parseFloat(today.completedkrb).toFixed(0));
                            setChartKrb(parseFloat(parseFloat(parseFloat(today.completedkrb) / parseFloat(today.totalkrb)) * 100).toFixed(1))
                
                            setTotalPro(parseFloat(today.totalpro).toFixed(0));
                            setCompletedPro(parseFloat(today.completedpro).toFixed(0));
                            setChartPro(parseFloat(parseFloat(parseFloat(today.completedpro) / parseFloat(today.totalpro)) * 100).toFixed(1))
                
                            setYag(parseFloat(today.Yag).toFixed(0));
                            setCompletedYag(parseFloat(today.completedyag).toFixed(0));
                            setChartYag(parseFloat(parseFloat(parseFloat(today.completedyag) / parseFloat(today.Yag)) * 100).toFixed(1))
                
                            setLoading(false);
                    } else {
                        createFoodList();
                    }
                } else {
                    createFoodList();
                }
            })
            .catch((err) => {
                console.log('hata: ', err)
                setLoading(false);
            })
    }


    const createFoodList = async () => {
        let healthProblems = profileData.questions?.healthproblems !== undefined ? profileData.questions?.healthproblems : 'Yok';
        let Nutrition = profileData.questions?.nutrition !== undefined ? profileData.questions?.nutrition : 'Yok';
        let Target = profileData.questions?.target !== undefined ? profileData.questions?.target : 'Yok';
        let Program = profileData.questions?.program !== undefined ? profileData.questions?.program : 'Yok';

        let AlgorithmList = [];
        let kahvaltiNewList = [];
        let araList1 = [];
        let araList2 = [];
        let araList3 = [];
        let ogleNewList = [];
        let aksamNewList = [];

        let fbFoodsArr = [];
        let fbFoods = [];
        let myValues = null

        //besin degerlerini algoritmadan cek
        var enerji = String(Math.round(profileData.gunlukEnerji)).replace(/\d{2}$/, '00');

        if (enerji < 1400) {
            enerji = 1400;
        } else if (Target === "Formda Kalma" && enerji >= 1900) {
            enerji = 1900
        }

        console.log('enerji : ', enerji)

        //algoritmadan gelecek olan besin degerleri

        if (Target === "Kas Kütlesi Artışı") {
            await database().ref(`algorithm/kaskutlesiartisi/${enerji}`).once('value')
                .then((snapshot) => {
                    snapshot.forEach((item) => {
                        AlgorithmList[item.key] = {
                            ...item.val()
                        }
                    })
                })
                .catch((err) => {
                    console.log('algorithm get error');
                })

            switch (parseFloat(dateNumberToday)) {
                case 1:
                    myValues = { ...AlgorithmList.s2 }
                    break;

                case 2:
                    myValues = { ...AlgorithmList.s1 }
                    break;

                case 3:
                    myValues = { ...AlgorithmList.s2 }
                    break;

                case 4:
                    myValues = { ...AlgorithmList.s1 }
                    break;

                case 5:
                    myValues = { ...AlgorithmList.s2 }
                    break;

                case 6:
                    myValues = { ...AlgorithmList.s1 }
                    break;

                case 0:
                    myValues = { ...AlgorithmList.s2 }
                    break;

                default:
                    console.log('kas kutles iartisi gun getirilemedi.');
                    break;
            }
        }

        if (Target === "Formda Kalma") {
            await database().ref(`algorithm/formdakalma/${enerji}`).once('value')
                .then((snapshot) => {
                    snapshot.forEach((item) => {
                        AlgorithmList[item.key] = {
                            ...item.val()
                        }
                    })
                })
                .catch((err) => {
                    console.log('algorithm get error');
                })

            switch (parseFloat(dateNumberToday)) {
                case 1:
                    myValues = { ...AlgorithmList.s1 }
                    break;

                case 2:
                    myValues = { ...AlgorithmList.s2 }
                    break;

                case 3:
                    myValues = { ...AlgorithmList.s1 }
                    break;

                case 4:
                    myValues = { ...AlgorithmList.s2 }
                    break;

                case 5:
                    myValues = { ...AlgorithmList.s1 }
                    break;

                case 6:
                    myValues = { ...AlgorithmList.s2 }
                    break;

                case 0:
                    myValues = { ...AlgorithmList.s1 }
                    break;

                default:
                    console.log('formda kalma gun getirilemedi.');
                    break;
            }
        }

        if (Target === "Yağ Oranı Azaltma") {
            await database().ref(`algorithm/dengeli/${enerji}`).once('value')
                .then((snapshot) => {
                    console.log('snap: ', snapshot.val())
                    snapshot.forEach((item) => {
                        AlgorithmList[item.key] = {
                            ...item.val()
                        }
                    })
                })
                .catch((err) => {
                    console.log('algorithm get error');
                })

            switch (parseFloat(dateNumberToday)) {
                case 1:
                    myValues = { ...AlgorithmList.s1 }
                    break;

                case 2:
                    myValues = { ...AlgorithmList.s2 }
                    break;

                case 3:
                    myValues = { ...AlgorithmList.s1 }
                    break;

                case 4:
                    myValues = { ...AlgorithmList.s2 }
                    break;

                case 5:
                    myValues = { ...AlgorithmList.s1 }
                    break;

                case 6:
                    myValues = { ...AlgorithmList.s2 }
                    break;

                case 0:
                    myValues = { ...AlgorithmList.s1 }
                    break;

                default:
                    console.log('formda kalma gun getirilemedi.');
                    break;
            }
        }


        console.log('My Algo: ', myValues);
        //algoritma degerleri son


        await database().ref('foods').once('value')
            .then((snapshot) => {
                snapshot.forEach((item) => {
                    fbFoodsArr.push({
                        ...item.val(),
                        id: item.key
                    })
                })
                setAllFoodList(fbFoodsArr);
                return fbFoods = shuffle(fbFoodsArr);

            })
            .catch((err) => {
                console.log('get food err: ', err)
                setSaveLoading(false);
                setLoading(false);
            })

        const aksamList = filterByValue(fbFoods, 'Ana').sort((a, b) => b.besinYag - a.besinYag || b.besinEYP - a.besinEYP || b.besinEkmek - a.besinEkmek || b.besinSut - a.besinSut || b.besinSebze - a.besinSebze);
        const araList = filterByValue(fbFoods, 'Ara').sort((a, b) => b.besinYag - a.besinYag || b.besinEkmek - a.besinEkmek || b.besinSut - a.besinSut);
        const kahvaltiList = filterByValue(fbFoods, 'Kahvalti').sort((a, b) => b.besinYag - a.besinYag || b.besinSut - a.besinSut);

        let caseAksamList = Object.values(aksamList);
        let caseKahvaltiList = Object.values(kahvaltiList);
        let caseAraList = Object.values(araList);
        // .filter(function (v, i) {
        //     return (v["besintipi"] === "Tavuk" || v["besintipi"] === "Et" || v["besintipi"] === "Hindi" || v["besintipi"] === "Balık" || v["besintipi"] === "Peynir" || v["besintipi"] === "Tahıl" || v["besintipi"] === "Çorba" || v["besintipi"] === "Yoğurt" || v["besintipi"] === "Test Yağ");
        // })

        // if (food.besintipi !== undefined && food.besintipi === "Tavuk" || food.besintipi === "Et" || food.besintipi === "Hindi" || food.besintipi === "Balik" || food.besintipi === "Peynir" || food.besintipi === "Ekmek" || food.besintipi === "Salata") {

        let caseOgleList = Object.values(aksamList)

        caseKahvaltiList.forEach((food) => {
            if (food.besinSut <= myValues.Sut && food.besinEkmek <= myValues.Ekmek && food.besinMeyve <= myValues.Meyve && food.besinSebze <= myValues.Sebze && food.besinYag <= myValues.Yag && food.besinEYP <= myValues.EYP) {
                kahvaltiNewList.push({ ...food, completed: false });

                if (food.besinSut > 0 && myValues.Sut > 0) {
                    myValues.Sut = myValues.Sut - food.besinSut;
                }

                if (food.besinEkmek > 0 && myValues.Ekmek > 0) {
                    myValues.Ekmek = myValues.Ekmek - food.besinEkmek;
                }

                if (food.besinMeyve > 0 && myValues.Meyve > 0) {
                    myValues.Meyve = myValues.Meyve - food.besinMeyve;
                }

                if (food.besinSebze > 0 && myValues.Sebze > 0) {
                    myValues.Sebze = myValues.Sebze - food.besinSebze;
                }

                if (food.besinYag > 0 && myValues.Yag > 0) {
                    myValues.Yag = myValues.Yag - food.besinYag;
                }

                if (food.besinEYP > 0 && myValues.EYP > 0) {
                    myValues.EYP = myValues.EYP - food.besinEYP;
                }

            }
        })

        caseAksamList.forEach((food) => {
            if (food.besinSut <= myValues.AksamSut && food.besinEkmek <= myValues.AksamEkmek && food.besinMeyve <= myValues.AksamMeyve && food.besinSebze <= myValues.AksamSebze && food.besinYag <= myValues.AksamYag && food.besinEYP <= myValues.AksamEYP) {
                aksamNewList.push({ ...food, completed: false });

                if (food.besinSut > 0 && myValues.AksamSut > 0) {
                    myValues.AksamSut = myValues.AksamSut - food.besinSut;
                }

                if (food.besinEkmek > 0 && myValues.AksamEkmek > 0) {
                    myValues.AksamEkmek = myValues.AksamEkmek - food.besinEkmek;
                }

                if (food.besinMeyve > 0 && myValues.AksamMeyve > 0) {
                    myValues.AksamMeyve = myValues.AksamMeyve - food.besinMeyve;
                }

                if (food.besinSebze > 0 && myValues.AksamSebze > 0) {
                    myValues.AksamSebze = myValues.AksamSebze - food.besinSebze;
                }

                if (food.besinYag > 0 && myValues.AksamYag > 0) {
                    myValues.AksamYag = myValues.AksamYag - food.besinYag;
                }

                if (food.besinEYP > 0 && myValues.AksamEYP > 0) {
                    myValues.AksamEYP = myValues.AksamEYP - food.besinEYP;
                }

            }
        })

        caseOgleList.forEach((food) => {

            if (food.besinSut <= myValues.OgleSut && food.besinEkmek <= myValues.OgleEkmek && food.besinMeyve <= myValues.OgleMeyve && food.besinSebze <= myValues.OgleSebze && food.besinYag <= myValues.OgleYag && food.besinEYP <= myValues.OgleEYP) {
                ogleNewList.push({ ...food, completed: false });

                if (food.besinSut > 0 && myValues.OgleSut > 0) {
                    myValues.OgleSut = myValues.OgleSut - food.besinSut;
                }

                if (food.besinEkmek > 0 && myValues.OgleEkmek > 0) {
                    myValues.OgleEkmek = myValues.OgleEkmek - food.besinEkmek;
                }

                if (food.besinMeyve > 0 && myValues.OgleMeyve > 0) {
                    myValues.OgleMeyve = myValues.OgleMeyve - food.besinMeyve;
                }

                if (food.besinSebze > 0 && myValues.OgleSebze > 0) {
                    myValues.OgleSebze = myValues.OgleSebze - food.besinSebze;
                }

                if (food.besinYag > 0 && myValues.OgleYag > 0) {
                    myValues.OgleYag = myValues.OgleYag - food.besinYag;
                }

                if (food.besinEYP > 0 && myValues.OgleEYP > 0) {
                    myValues.OgleEYP = myValues.OgleEYP - food.besinEYP;
                }
            }
        })

        let SutSum = aksamNewList.reduce(function (prev, current) {
            return prev + +parseFloat(current.besinSut)
        }, 0);

        let YagSum = aksamNewList.reduce(function (prev, current) {
            return prev + +parseFloat(current.besinYag)
        }, 0);

        let EYPSum = aksamNewList.reduce(function (prev, current) {
            return prev + +parseFloat(current.besinEYP)
        }, 0);

        let SebzeSum = aksamNewList.reduce(function (prev, current) {
            return prev + +parseFloat(current.besinSebze)
        }, 0);

        let MeyveSum = aksamNewList.reduce(function (prev, current) {
            return prev + +parseFloat(current.besinMeyve)
        }, 0);

        let EkmekSum = aksamNewList.reduce(function (prev, current) {
            return prev + +parseFloat(current.besinEkmek)
        }, 0);


        let ogleSutSum = ogleNewList.reduce(function (prev, current) {
            return prev + +parseFloat(current.besinSut)
        }, 0);

        let ogleYagSum = ogleNewList.reduce(function (prev, current) {
            return prev + +parseFloat(current.besinYag)
        }, 0);

        let ogleEYPSum = ogleNewList.reduce(function (prev, current) {
            return prev + +parseFloat(current.besinEYP)
        }, 0);

        let ogleSebzeSum = ogleNewList.reduce(function (prev, current) {
            return prev + +parseFloat(current.besinSebze)
        }, 0);

        let ogleMeyveSum = ogleNewList.reduce(function (prev, current) {
            return prev + +parseFloat(current.besinMeyve)
        }, 0);

        let ogleEkmekSum = ogleNewList.reduce(function (prev, current) {
            return prev + +parseFloat(current.besinEkmek)
        }, 0);


        console.log('Akşam Sums : ', { SutSum, YagSum, EYPSum, SebzeSum, MeyveSum, EkmekSum })
        console.log('Ogle Sums : ', { ogleSutSum, ogleYagSum, ogleEYPSum, ogleSebzeSum, ogleMeyveSum, ogleEkmekSum })
        console.log('aksamList new: ', aksamNewList)
        console.log('ogleList new: ', ogleNewList)

        caseAksamList.forEach((food) => {
            if (food.besinSut <= myValues.AksamSut && food.besinEkmek <= myValues.AksamEkmek && food.besinMeyve <= myValues.AksamMeyve && food.besinSebze <= myValues.AksamSebze && food.besinYag <= myValues.AksamYag && food.besinEYP <= myValues.AksamEYP) {
                aksamNewList.push({ ...food, completed: false });

                if (food.besinSut > 0 && myValues.AksamSut > 0) {
                    myValues.AksamSut = myValues.AksamSut - food.besinSut;
                }

                if (food.besinEkmek > 0 && myValues.AksamEkmek > 0) {
                    myValues.AksamEkmek = myValues.AksamEkmek - food.besinEkmek;
                }

                if (food.besinMeyve > 0 && myValues.AksamMeyve > 0) {
                    myValues.AksamMeyve = myValues.AksamMeyve - food.besinMeyve;
                }

                if (food.besinSebze > 0 && myValues.AksamSebze > 0) {
                    myValues.AksamSebze = myValues.AksamSebze - food.besinSebze;
                }

                if (food.besinYag > 0 && myValues.AksamYag > 0) {
                    myValues.AksamYag = myValues.AksamYag - food.besinYag;
                }

                if (food.besinEYP > 0 && myValues.AksamEYP > 0) {
                    myValues.AksamEYP = myValues.AksamEYP - food.besinEYP;
                }

            }
        })

        shuffle(caseAraList).forEach((food) => {
            if (food.besinSut <= myValues.AraList1Sut && food.besinEkmek <= myValues.AraList1Ekmek && food.besinMeyve <= myValues.AraList1Meyve && food.besinSebze <= myValues.AraList1Sebze && food.besinYag <= myValues.AraList1Yag && food.besinEYP <= myValues.AraList1EYP) {
                araList1.push({ ...food, completed: false });

                if (food.besinSut > 0 && myValues.AraList1Sut > 0) {
                    myValues.AraList1Sut = myValues.AraList1Sut - food.besinSut;
                }

                if (food.besinEkmek > 0 && myValues.AraList1Ekmek > 0) {
                    myValues.AraList1Ekmek = myValues.AraList1Ekmek - food.besinEkmek;
                }

                if (food.besinMeyve > 0 && myValues.AraList1Meyve > 0) {
                    myValues.AraList1Meyve = myValues.AraList1Meyve - food.besinMeyve;
                }

                if (food.besinSebze > 0 && myValues.AraList1Sebze > 0) {
                    myValues.AraList1Sebze = myValues.AraList1Sebze - food.besinSebze;
                }

                if (food.besinYag > 0 && myValues.AraList1Yag > 0) {
                    myValues.AraList1Yag = myValues.AraList1Yag - food.besinYag;
                }

                if (food.besinEYP > 0 && myValues.AraList1EYP > 0) {
                    myValues.AraList1EYP = myValues.AraList1EYP - food.besinEYP;
                }

            }
        })

        shuffle(caseAraList).forEach((food) => {
            if (food.besinSut <= myValues.AraList2Sut && food.besinEkmek <= myValues.AraList2Ekmek && food.besinMeyve <= myValues.AraList2Meyve && food.besinSebze <= myValues.AraList2Sebze && food.besinYag <= myValues.AraList2Yag && food.besinEYP <= myValues.AraList2EYP) {
                araList2.push({ ...food, completed: false });

                if (food.besinSut > 0 && myValues.AraList2Sut > 0) {
                    myValues.AraList2Sut = myValues.AraList2Sut - food.besinSut;
                }

                if (food.besinEkmek > 0 && myValues.AraList2Ekmek > 0) {
                    myValues.AraList2Ekmek = myValues.AraList2Ekmek - food.besinEkmek;
                }

                if (food.besinMeyve > 0 && myValues.AraList2Meyve > 0) {
                    myValues.AraList2Meyve = myValues.AraList2Meyve - food.besinMeyve;
                }

                if (food.besinSebze > 0 && myValues.AraList2Sebze > 0) {
                    myValues.AraList2Sebze = myValues.AraList2Sebze - food.besinSebze;
                }

                if (food.besinYag > 0 && myValues.AraList2Yag > 0) {
                    myValues.AraList2Yag = myValues.AraList2Yag - food.besinYag;
                }

                if (food.besinEYP > 0 && myValues.AraList2EYP > 0) {
                    myValues.AraList2EYP = myValues.AraList2EYP - food.besinEYP;
                }

            }
        })

        shuffle(caseAraList).forEach((food) => {
            if (food.besinSut <= myValues.AraList3Sut && food.besinEkmek <= myValues.AraList3Ekmek && food.besinMeyve <= myValues.AraList3Meyve && food.besinSebze <= myValues.AraList3Sebze && food.besinYag <= myValues.AraList3Yag && food.besinEYP <= myValues.AraList3EYP) {
                araList3.push({ ...food, completed: false });

                if (food.besinSut > 0 && myValues.AraList3Sut > 0) {
                    myValues.AraList3Sut = myValues.AraList3Sut - food.besinSut;
                }

                if (food.besinEkmek > 0 && myValues.AraList3Ekmek > 0) {
                    myValues.AraList3Ekmek = myValues.AraList3Ekmek - food.besinEkmek;
                }

                if (food.besinMeyve > 0 && myValues.AraList3Meyve > 0) {
                    myValues.AraList3Meyve = myValues.AraList3Meyve - food.besinMeyve;
                }

                if (food.besinSebze > 0 && myValues.AraList3Sebze > 0) {
                    myValues.AraList3Sebze = myValues.AraList3Sebze - food.besinSebze;
                }

                if (food.besinYag > 0 && myValues.AraList3Yag > 0) {
                    myValues.AraList3Yag = myValues.AraList3Yag - food.besinYag;
                }

                if (food.besinEYP > 0 && myValues.AraList3EYP > 0) {
                    myValues.AraList3EYP = myValues.AraList3EYP - food.besinEYP;
                }

            }
        })

        setSaveLoading(true);

        let List = {
            "aksamlist": aksamNewList,
            "kahvalti": kahvaltiNewList,
            "oglelist": ogleNewList,
            "aralist1": araList1,
            "aralist2": araList2,
            "aralist3": araList3
        }

        var pushDate = moment().format('DD-MM-YYYY')
        database().ref(`users/${profileData.userId}/foods/${pushDate}`).set(List)
            .then(() => {
                getMyFoodList();
            })
            .catch((err) => {
                setSaveLoading(false);
                setLoading(false);
            })
    }

    return (
        <ImageBackground style={{ height: height, width: width }} resizeMode="cover" source={require('../../img/bg.jpg')}>
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="light-content" />
                <SpinnerLoading Loading={Loading} />
                <SpinnerLoading Loading={SaveLoading} />
                <Sidebar navigation={navigation} opened={ShowSideModal} onClose={() => closeModal()} />

                <SCLAlert
                    theme="info"
                    show={ShowAlert}
                    onRequestClose={() => setShowAlert(false)}
                    title="Değiştir"
                    subtitle="Besin değiştirilsin mi?"
                >
                    <SCLAlertButton theme="info" onPress={() => replaceFood(SelectedReplaceFood)}>Evet</SCLAlertButton>
                    <SCLAlertButton theme="default" onPress={() => setShowAlert(!ShowAlert)}>Vazgeç</SCLAlertButton>
                </SCLAlert>

                <SCLAlert
                    theme="success"
                    show={ShowSuccess}
                    onRequestClose={() => setShowSuccess(false)}
                    title="Başarılı"
                    subtitle="Öğün favorilerinize eklendi"
                >
                    <SCLAlertButton theme="success" onPress={() => setShowSuccess(false)}>Tamam</SCLAlertButton>
                </SCLAlert>

                <SCLAlert
                    theme="danger"
                    show={ShowError}
                    onRequestClose={() => setShowError(false)}
                    title="Besin Bulunamadı"
                    subtitle="Değiştirlecek eşdeğer bir besin yok."
                >
                    <SCLAlertButton theme="danger" onPress={() => setShowError(false)}>Tamam</SCLAlertButton>
                </SCLAlert>

                <SCLAlert
                    theme="warning"
                    show={ShowGetWarning}
                    onRequestClose={() => setShowGetWarning(false)}
                    title="Bulunamadı"
                    subtitle="Seçili güne ait beslenme kaydı bulunamadı."
                >
                    <SCLAlertButton theme="warning" onPress={() => setShowGetWarning(false)}>Tamam</SCLAlertButton>
                </SCLAlert>

                <Modal style={{ marginTop: 'auto' }}
                    animationIn="fadeIn"
                    animationOut="fadeOut"
                    isVisible={ShowPopup}
                    animationInTiming={500}
                    animationOutTiming={500}
                    backdropOpacity={0.7}
                >
                    <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#202026', padding: 20, borderRadius: 20 }}>

                        <View style={{ marginTop: -60, height: 80, width: 80, backgroundColor: '#D1DC26', borderRadius: 12, justifyContent: 'center', alignItems: 'center' }}>
                            <Icon name="info-outline" size={42} color="#202026" />
                        </View>

                        {SelectedFood.demir !== 0 && SelectedFood.demir !== undefined && SelectedFood.demir !== "" &&
                            <View style={styles.modalStyle}>
                                <Text style={styles.popupText}>Demir:</Text>
                                <Text style={styles.popupText}>{SelectedFood.demir !== undefined ? SelectedFood.demir : 0} mg.</Text>
                            </View>
                        }

                        {SelectedFood.kalori !== 0 && SelectedFood.kalori !== undefined && SelectedFood.kalori !== "" &&
                            <View style={styles.modalStyle}>
                                <Text style={styles.popupText}>Kalori:</Text>
                                <Text style={styles.popupText}>{SelectedFood.kalori !== undefined ? SelectedFood.kalori : 0} kcal.</Text>
                            </View>
                        }

                        {SelectedFood.kalsiyum !== 0 && SelectedFood.kalsiyum !== undefined && SelectedFood.kalsiyum !== "" &&
                            <View style={styles.modalStyle}>
                                <Text style={styles.popupText}>Kalsiyum:</Text>
                                <Text style={styles.popupText}>{SelectedFood.kalsiyum !== undefined ? SelectedFood.kalsiyum : 0} mg.</Text>
                            </View>
                        }

                        {SelectedFood.karbonhidrat !== 0 && SelectedFood.karbonhidrat !== undefined && SelectedFood.karbonhidrat !== "" &&
                            <View style={styles.modalStyle}>
                                <Text style={styles.popupText}>Karbonhidrat:</Text>
                                <Text style={styles.popupText}>{SelectedFood.karbonhidrat !== undefined ? SelectedFood.karbonhidrat : 0} g.</Text>
                            </View>
                        }

                        {SelectedFood.lif !== 0 && SelectedFood.lif !== undefined && SelectedFood.lif !== "" &&
                            <View style={styles.modalStyle}>
                                <Text style={styles.popupText}>Lif:</Text>
                                <Text style={styles.popupText}>{SelectedFood.lif !== undefined ? SelectedFood.lif : 0} g.</Text>
                            </View>
                        }

                        {SelectedFood.potasyum !== 0 && SelectedFood.potasyum !== undefined && SelectedFood.potasyum !== "" &&
                            <View style={styles.modalStyle}>
                                <Text style={styles.popupText}>Potasyum:</Text>
                                <Text style={styles.popupText}>{SelectedFood.potasyum !== undefined ? SelectedFood.potasyum : 0} mg.</Text>
                            </View>
                        }

                        {SelectedFood.protein !== 0 && SelectedFood.protein !== undefined && SelectedFood.protein !== "" &&
                            <View style={styles.modalStyle}>
                                <Text style={styles.popupText}>Protein:</Text>
                                <Text style={styles.popupText}>{SelectedFood.protein !== undefined ? SelectedFood.protein : 0} g.</Text>
                            </View>
                        }

                        {SelectedFood.sodyum !== 0 && SelectedFood.sodyum !== undefined && SelectedFood.sodyum !== "" &&
                            <View style={styles.modalStyle}>
                                <Text style={styles.popupText}>Sodyum:</Text>
                                <Text style={styles.popupText}>{SelectedFood.soydum !== undefined ? SelectedFood.sodyum : 0} mg.</Text>
                            </View>
                        }

                        {SelectedFood.yag !== 0 && SelectedFood.yag !== undefined && SelectedFood.yag !== "" &&
                            <View style={styles.modalStyle}>
                                <Text style={styles.popupText}>Yağ:</Text>
                                <Text style={styles.popupText}>{SelectedFood.yag !== undefined ? SelectedFood.yag : 0} g.</Text>
                            </View>
                        }

                        {SelectedFood.fosfor !== 0 && SelectedFood.fosfor !== undefined && SelectedFood.fosfor !== "" &&
                            <View style={styles.modalStyle}>
                                <Text style={styles.popupText}>Fosfor:</Text>
                                <Text style={styles.popupText}>{SelectedFood.fosfor !== undefined ? SelectedFood.fosfor : 0} mg.</Text>
                            </View>
                        }

                        {SelectedFood.avitamin !== 0 && SelectedFood.avitamin !== undefined && SelectedFood.avitamin !== "" &&
                            <View style={styles.modalStyle}>
                                <Text style={styles.popupText}>A Vit. :</Text>
                                <Text style={styles.popupText}>{SelectedFood.avitamin !== undefined ? SelectedFood.avitamin : 0} µg.</Text>
                            </View>
                        }

                        {SelectedFood.cvitamin !== 0 && SelectedFood.cvitamin !== undefined && SelectedFood.cvitamin !== "" &&
                            <View style={styles.modalStyle}>
                                <Text style={styles.popupText}>C Vit. :</Text>
                                <Text style={styles.popupText}>{SelectedFood.cvitamin !== undefined ? SelectedFood.cvitamin : 0} µg.</Text>
                            </View>
                        }

                        {SelectedFood.tarif !== undefined && SelectedFood.tarif !== "" &&
                            <View style={[styles.modalStyle, { marginTop: 20, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }]}>
                                <Text style={[styles.popupText, { marginBottom: 10, fontWeight: '700' }]}>Tarif:</Text>
                                <Text style={[styles.popupText, { textAlign: 'justify', fontSize: 16 }]}>{String(SelectedFood.tarif)}</Text>
                            </View>
                        }

                        <TouchableOpacity onPress={() => setShowPopup(!ShowPopup)} style={{ marginTop: 20, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={[styles.popupText, { color: '#FFF' }]}>Kapat</Text>
                        </TouchableOpacity>

                    </View>
                </Modal>

                <View style={styles.header} >
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => setShowSideModal(!ShowSideModal)}>
                            <Icon name="menu" color="#FFF" size={32} style={{ marginRight: 15 }} />
                        </TouchableOpacity>
                        <Text style={styles.headerText}>Beslenme</Text>
                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>

                        <TouchableHighlight onPress={() => navigation.navigate('AddWater')}>
                            <Image source={require('../../img/suekle.png')} style={{ tintColor: 'lightblue', width: 55, height: 50 }} resizeMode="contain" />
                        </TouchableHighlight>

                        <TouchableHighlight onPress={() => navigation.navigate('Feed')}>
                            <Icon name="comment" color="#FFF" size={28} style={{ marginRight: 15 }} />
                        </TouchableHighlight>

                        <TouchableHighlight onPress={() => navigation.navigate('Settings')}>
                            <Icon name="settings" color="#FFF" size={28} />
                        </TouchableHighlight>

                    </View>
                </View>

                <ScrollView horizontal={false} style={{ flex: 1, width: '100%' }} >
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', width: '100%', paddingHorizontal: 20, marginTop: 20 }}>

                        <View style={{ width: width / 5, justifyContent: 'center', alignItems: 'center' }}>
                            <AnimatedCircularProgress
                                size={width / 5.3}
                                width={4}
                                rotation={90}
                                fill={parseFloat(ChartKcal).toFixed(1)}
                                tintColor="yellow"
                                backgroundColor="#4D4D4D">
                                {(fill) => (
                                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={styles.circleHeaderText}>%{parseFloat(fill).toFixed(1)}</Text>
                                    </View>
                                )}
                            </AnimatedCircularProgress>
                            <Text style={styles.circleSubText}>{CompletedKcal} / {parseFloat(String(Math.round(profileData.gunlukEnerji)).replace(/\d{2}$/, '00')).toFixed(0)}{"\n"}Kalori</Text>
                        </View>

                        <View style={{ width: width / 5, justifyContent: 'center', alignItems: 'center' }}>
                            <AnimatedCircularProgress
                                size={width / 5.3}
                                width={4}
                                rotation={90}
                                fill={parseFloat(ChartKrb).toFixed(1)}
                                tintColor="red"
                                backgroundColor="#4D4D4D">
                                {(fill) => (
                                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={styles.circleHeaderText}>%{parseFloat(fill).toFixed(1)}</Text>
                                    </View>
                                )}
                            </AnimatedCircularProgress>
                            <Text style={styles.circleSubText}>{CompletedKrb} / {TotalKrb}{"\n"}Karbonhidrat</Text>
                        </View>

                        <View style={{ width: width / 5, justifyContent: 'center', alignItems: 'center' }}>
                            <AnimatedCircularProgress
                                size={width / 5.3}
                                width={4}
                                rotation={90}
                                fill={parseFloat(ChartPro).toFixed(1)}
                                tintColor="pink"
                                backgroundColor="#4D4D4D">
                                {(fill) => (
                                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={styles.circleHeaderText}>%{parseFloat(fill).toFixed(1)}</Text>
                                    </View>
                                )}
                            </AnimatedCircularProgress>
                            <Text style={styles.circleSubText}>{CompletedPro} / {TotalPro}{"\n"}Protein</Text>
                        </View>

                        <View style={{ width: width / 5, justifyContent: 'center', alignItems: 'center' }}>
                            <AnimatedCircularProgress
                                size={width / 5.3}
                                width={4}
                                rotation={90}
                                fill={parseFloat(ChartYag).toFixed(1)}
                                tintColor="green"
                                backgroundColor="#4D4D4D">
                                {(fill) => (
                                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={styles.circleHeaderText}>%{parseFloat(fill).toFixed(1)}</Text>
                                    </View>
                                )}
                            </AnimatedCircularProgress>
                            <Text style={styles.circleSubText}>{CompletedYag} / {Yag}{"\n"}Yağ</Text>
                        </View>

                    </View>

                    {/* <View style={{ width: '50%', justifyContent: 'center', alignItems: 'baseline', flexDirection: 'column' }}>
                            <Text style={styles.targetHeader}>Gerekli Kalori: {parseFloat(Calories).toFixed(0)} / {String(profileData.targets?.calorie !== undefined ? profileData.targets.calorie : 0)}</Text>
                        </View> */}

                    <View style={{ width: '100%', paddingHorizontal: 10 }}>
                        {!Loading && KahvaltiList.length > 0 &&
                            <CalendarStrip
                                scrollable={true}
                                selectedDate={SelectedDate}
                                maxDate={moment()}
                                minDate={moment().subtract(7, 'days')}
                                onDateSelected={(val) => getSelectedDay(moment(val).format("DD-MM-YYYY"))}
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

                    {!Loading &&
                        <>
                            {!Loading && KahvaltiList.length !== 0 && KahvaltiList !== undefined &&
                                <>
                                    <FlatList style={{ height: 'auto', paddingHorizontal: 20, marginBottom: 20, marginTop: 5 }}
                                        scrollEnabled={false}
                                        // data={KahvaltiList.sort((a, b) => String(a.name).toLowerCase().localeCompare(String(b.name).toLowerCase()))}
                                        data={KahvaltiList}
                                        keyExtractor={(item, index) => index.toString()}
                                        ListHeaderComponent={() => {
                                            return (
                                                <View style={{ backgroundColor: '#202026', flexDirection: 'row', borderTopLeftRadius: 12, borderTopRightRadius: 12, paddingHorizontal: 20, paddingVertical: 15, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                                                    <Text style={styles.foodHeader}>Kahvaltı</Text>
                                                    {/* <Icon onPress={() => addFavorites("kahvalti")} name="favorite-outline" size={20} color="#FFF" /> */}
                                                </View>
                                            )
                                        }}
                                        renderItem={(food) => {
                                            var item = food.item;
                                            return (item &&
                                                <View key={item.id} style={{
                                                    // backgroundColor: '#FFF',
                                                    padding: 10,
                                                    flexDirection: 'row',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    height: 'auto',
                                                    width: '100%'
                                                }}>
                                                    <View style={{ width: '70%', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                        <Text style={styles.foodName}>{item.name}</Text>
                                                        {item.note !== "" && item.note !== undefined ?
                                                            <Text style={[styles.foodName, { color: '#9D9D9D', fontSize: 14, marginTop: 5 }]}>{item.note} {item.kalori !== "" && item.kalori !== undefined && " - " + parseFloat(item.kalori).toFixed(2) + " Kalori"}</Text>
                                                            :
                                                            <Text style={[styles.foodName, { color: '#9D9D9D', fontSize: 14, marginTop: 5 }]}>{item.tarif} {item.kalori !== "" && item.kalori !== undefined && " - " + parseFloat(item.kalori).toFixed(2) + " Kalori"}</Text>
                                                        }
                                                    </View>
                                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <Icon onPress={() => {
                                                            setSelectedFood(item);
                                                            setTimeout(() => {
                                                                setShowPopup(!ShowPopup)
                                                            }, 200);
                                                        }} name="info-outline" size={20} color="#FFF" />
                                                        {/* <Icon style={{ marginLeft: 10 }} onPress={() => {
                                                            setShowAlert(true);
                                                            setSelectedReplaceFood({ food: food, type: "KahvaltiList" });
                                                        }} name="replay" size={20} color="#FFF" /> */}
                                                        <Icon style={{ marginLeft: 10 }} onPress={() => EatFood(food, "kahvalti")} name="check" size={20} color={item.completed === true ? "#00FF00" : "#FFF"} />
                                                    </View>
                                                </View>
                                            )
                                        }}
                                    />
                                </>
                            }


                            {!Loading && AraList1.length !== 0 && AraList1 !== undefined &&
                                <>
                                    <FlatList style={{ height: 'auto', paddingHorizontal: 20, marginBottom: 20 }}
                                        scrollEnabled={false}
                                        data={AraList1.sort((a, b) => String(a.name).toLowerCase().localeCompare(String(b.name).toLowerCase()))}
                                        keyExtractor={(item, index) => index.toString()}
                                        ListHeaderComponent={() => {
                                            return (
                                                <View style={{ backgroundColor: '#202026', flexDirection: 'row', borderTopLeftRadius: 12, borderTopRightRadius: 12, paddingHorizontal: 20, paddingVertical: 15, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                                                    <Text style={styles.foodHeader}>Ara Öğün 1</Text>
                                                    {/* <Icon onPress={() => addFavorites("aralist1")} name="favorite-outline" size={20} color="#FFF" /> */}
                                                </View>
                                            )
                                        }}
                                        renderItem={(food) => {
                                            var item = food.item;
                                            return (item &&
                                                <View key={item.id} style={{
                                                    padding: 10,
                                                    flexDirection: 'row',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    height: 'auto',
                                                    width: '100%'
                                                }}>
                                                    <View style={{ width: '70%', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                        <Text style={styles.foodName}>{item.name}</Text>
                                                        {item.note !== "" && item.note !== undefined ?
                                                            <Text style={[styles.foodName, { color: '#9D9D9D', fontSize: 14, marginTop: 5 }]}>{item.note} {item.kalori !== "" && item.kalori !== undefined && " - " + parseFloat(item.kalori).toFixed(2) + " Kalori"}</Text>
                                                            :
                                                            <Text style={[styles.foodName, { color: '#9D9D9D', fontSize: 14, marginTop: 5 }]}>{item.tarif} {item.kalori !== "" && item.kalori !== undefined && " - " + parseFloat(item.kalori).toFixed(2) + " Kalori"}</Text>
                                                        }
                                                    </View>
                                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <Icon onPress={() => {
                                                            setSelectedFood(item);
                                                            setTimeout(() => {
                                                                setShowPopup(!ShowPopup)
                                                            }, 200);
                                                        }} name="info-outline" size={20} color="#FFF" />
                                                        {/* <Icon style={{ marginLeft: 10 }} onPress={() => {
                                                            setShowAlert(true);
                                                            setSelectedReplaceFood({ food: food, type: "AraList1" });
                                                        }} name="replay" size={20} color="#FFF" /> */}
                                                        <Icon style={{ marginLeft: 10 }} onPress={() => EatFood(food, "aralist1")} name="check" size={20} color={item.completed === true ? "#00FF00" : "#FFF"} />
                                                    </View>
                                                </View>
                                            )
                                        }}
                                    />
                                </>
                            }

                            {!Loading && OgleList.length !== 0 && OgleList !== undefined &&
                                <>
                                    <FlatList style={{ height: 'auto', paddingHorizontal: 20, marginBottom: 20 }}
                                        scrollEnabled={false}
                                        data={OgleList.sort((a, b) => String(a.name).toLowerCase().localeCompare(String(b.name).toLowerCase()))}
                                        keyExtractor={(item, index) => index.toString()}
                                        ListHeaderComponent={() => {
                                            return (
                                                <View style={{ backgroundColor: '#202026', flexDirection: 'row', borderTopLeftRadius: 12, borderTopRightRadius: 12, paddingHorizontal: 20, paddingVertical: 15, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                                                    <Text style={styles.foodHeader}>Öğle Yemeği</Text>
                                                    {/* <Icon onPress={() => addFavorites("oglelist")} name="favorite-outline" size={20} color="#FFF" /> */}
                                                </View>
                                            )
                                        }}
                                        renderItem={(food) => {
                                            var item = food.item;
                                            return (item &&
                                                <View key={item.id} style={{
                                                    padding: 10,
                                                    flexDirection: 'row',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    height: 'auto',
                                                    width: '100%'
                                                }}>
                                                    <View style={{ width: '70%', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                        <Text style={styles.foodName}>{item.name}</Text>
                                                        {item.note !== "" && item.note !== undefined ?
                                                            <Text style={[styles.foodName, { color: '#9D9D9D', fontSize: 14, marginTop: 5 }]}>{item.note} {item.kalori !== "" && item.kalori !== undefined && " - " + parseFloat(item.kalori).toFixed(2) + " Kalori"}</Text>
                                                            :
                                                            <Text style={[styles.foodName, { color: '#9D9D9D', fontSize: 14, marginTop: 5 }]}>{item.tarif} {item.kalori !== "" && item.kalori !== undefined && " - " + parseFloat(item.kalori).toFixed(2) + " Kalori"}</Text>
                                                        }
                                                    </View>
                                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <Icon onPress={() => {
                                                            setSelectedFood(item);
                                                            setTimeout(() => {
                                                                setShowPopup(!ShowPopup)
                                                            }, 200);
                                                        }} name="info-outline" size={20} color="#FFF" />
                                                        {/* <Icon style={{ marginLeft: 10 }} onPress={() => {
                                                            setShowAlert(true);
                                                            setSelectedReplaceFood({ food: food, type: "OgleList" });
                                                        }} name="replay" size={20} color="#FFF" /> */}
                                                        <Icon style={{ marginLeft: 10 }} onPress={() => EatFood(food, "oglelist")} name="check" size={20} color={item.completed === true ? "#00FF00" : "#FFF"} />
                                                    </View>
                                                </View>
                                            )
                                        }}
                                    />
                                </>
                            }


                            {!Loading && AraList2.length !== 0 && AraList2 !== undefined &&
                                <>
                                    <FlatList style={{ height: 'auto', paddingHorizontal: 20, marginBottom: 20 }}
                                        scrollEnabled={false}
                                        data={AraList2.sort((a, b) => String(a.name).toLowerCase().localeCompare(String(b.name).toLowerCase()))}
                                        keyExtractor={(item, index) => index.toString()}
                                        ListHeaderComponent={() => {
                                            return (
                                                <View style={{ backgroundColor: '#202026', flexDirection: 'row', borderTopLeftRadius: 12, borderTopRightRadius: 12, paddingHorizontal: 20, paddingVertical: 15, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                                                    <Text style={styles.foodHeader}>Ara Öğün 2</Text>
                                                    {/* <Icon onPress={() => addFavorites("aralist2")} name="favorite-outline" size={20} color="#FFF" /> */}
                                                </View>
                                            )
                                        }}
                                        renderItem={(food) => {
                                            var item = food.item;
                                            return (item &&
                                                <View key={item.id} style={{
                                                    padding: 10,
                                                    flexDirection: 'row',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    height: 'auto',
                                                    width: '100%'
                                                }}>
                                                    <View style={{ width: '70%', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                        <Text style={styles.foodName}>{item.name}</Text>
                                                        {item.note !== "" && item.note !== undefined ?
                                                            <Text style={[styles.foodName, { color: '#9D9D9D', fontSize: 14, marginTop: 5 }]}>{item.note} {item.kalori !== "" && item.kalori !== undefined && " - " + parseFloat(item.kalori).toFixed(2) + " Kalori"}</Text>
                                                            :
                                                            <Text style={[styles.foodName, { color: '#9D9D9D', fontSize: 14, marginTop: 5 }]}>{item.tarif} {item.kalori !== "" && item.kalori !== undefined && " - " + parseFloat(item.kalori).toFixed(2) + " Kalori"}</Text>
                                                        }
                                                    </View>
                                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <Icon onPress={() => {
                                                            setSelectedFood(item);
                                                            setTimeout(() => {
                                                                setShowPopup(!ShowPopup)
                                                            }, 200);
                                                        }} name="info-outline" size={20} color="#FFF" />
                                                        {/* <Icon style={{ marginLeft: 10 }} onPress={() => {
                                                            setShowAlert(true);
                                                            setSelectedReplaceFood({ food: food, type: "AraList2" });
                                                        }} name="replay" size={20} color="#FFF" /> */}
                                                        <Icon style={{ marginLeft: 10 }} onPress={() => EatFood(food, "aralist2")} name="check" size={20} color={item.completed === true ? "#00FF00" : "#FFF"} />
                                                    </View>
                                                </View>
                                            )
                                        }}
                                    />
                                </>
                            }

                            {!Loading && AksamList.length !== 0 && AksamList !== undefined &&
                                <>
                                    <FlatList style={{ height: 'auto', paddingHorizontal: 20 }}
                                        contentContainerStyle={{ marginBottom: AraList3.length === 0 ? 100 : 0 }}
                                        scrollEnabled={false}
                                        data={AksamList.sort((a, b) => String(a.name).toLowerCase().localeCompare(String(b.name).toLowerCase()))}
                                        keyExtractor={(item, index) => index.toString()}
                                        ListHeaderComponent={() => {
                                            return (
                                                <View style={{ backgroundColor: '#202026', flexDirection: 'row', borderTopLeftRadius: 12, borderTopRightRadius: 12, paddingHorizontal: 20, paddingVertical: 15, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                                                    <Text style={styles.foodHeader}>Akşam Yemeği</Text>
                                                    {/* <Icon onPress={() => addFavorites("aksamlist")} name="favorite-outline" size={20} color="#FFF" /> */}
                                                </View>
                                            )
                                        }}
                                        renderItem={(food) => {
                                            var item = food.item;
                                            return (item &&
                                                <View key={item.id} style={{
                                                    padding: 10,
                                                    flexDirection: 'row',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    height: 'auto',
                                                    width: '100%'
                                                }}>
                                                    <View style={{ width: '70%', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                        <Text style={styles.foodName}>{item.name}</Text>
                                                        {item.note !== "" && item.note !== undefined ?
                                                            <Text style={[styles.foodName, { color: '#9D9D9D', fontSize: 14, marginTop: 5 }]}>{item.note} {item.kalori !== "" && item.kalori !== undefined && " - " + parseFloat(item.kalori).toFixed(2) + " Kalori"}</Text>
                                                            :
                                                            <Text style={[styles.foodName, { color: '#9D9D9D', fontSize: 14, marginTop: 5 }]}>{item.tarif} {item.kalori !== "" && item.kalori !== undefined && " - " + parseFloat(item.kalori).toFixed(2) + " Kalori"}</Text>
                                                        }
                                                    </View>
                                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <Icon onPress={() => {
                                                            setSelectedFood(item);
                                                            setTimeout(() => {
                                                                setShowPopup(!ShowPopup)
                                                            }, 200);
                                                        }} name="info-outline" size={20} color="#FFF" />
                                                        {/* <Icon style={{ marginLeft: 10 }} onPress={() => {
                                                            setShowAlert(true);
                                                            setSelectedReplaceFood({ food: food, type: "AksamList" });
                                                        }} name="replay" size={20} color="#FFF" /> */}
                                                        <Icon style={{ marginLeft: 10 }} onPress={() => EatFood(food, "aksamlist")} name="check" size={20} color={item.completed === true ? "#00FF00" : "#FFF"} />
                                                    </View>
                                                </View>
                                            )
                                        }}
                                    />
                                </>
                            }


                            {!Loading && AraList3.length !== 0 && AraList3 !== undefined &&
                                <>
                                    <FlatList style={{ height: 'auto', paddingHorizontal: 20 }}
                                        contentContainerStyle={{ marginBottom: AraList3.length === 0 ? 0 : 100 }}
                                        scrollEnabled={false}
                                        data={AraList3.sort((a, b) => String(a.name).toLowerCase().localeCompare(String(b.name).toLowerCase()))}
                                        keyExtractor={(item, index) => index.toString()}
                                        ListHeaderComponent={() => {
                                            return (
                                                <View style={{ backgroundColor: '#202026', flexDirection: 'row', borderTopLeftRadius: 12, borderTopRightRadius: 12, paddingHorizontal: 20, paddingVertical: 15, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                                                    <Text style={styles.foodHeader}>Ara Öğün 3</Text>
                                                    {/* <Icon onPress={() => addFavorites("aralist3")} name="favorite-outline" size={20} color="#FFF" /> */}
                                                </View>
                                            )
                                        }}
                                        renderItem={(food) => {
                                            var item = food.item;
                                            return (item &&
                                                <View key={item.id} style={{
                                                    padding: 10,
                                                    flexDirection: 'row',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    height: 'auto',
                                                    width: '100%'
                                                }}>
                                                    <View style={{ width: '70%', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                        <Text style={styles.foodName}>{item.name}</Text>
                                                        {item.note !== "" && item.note !== undefined ?
                                                            <Text style={[styles.foodName, { color: '#9D9D9D', fontSize: 14, marginTop: 5 }]}>{item.note} {item.kalori !== "" && item.kalori !== undefined && " - " + parseFloat(item.kalori).toFixed(2) + " Kalori"}</Text>
                                                            :
                                                            <Text style={[styles.foodName, { color: '#9D9D9D', fontSize: 14, marginTop: 5 }]}>{item.tarif} {item.kalori !== "" && item.kalori !== undefined && " - " + parseFloat(item.kalori).toFixed(2) + " Kalori"}</Text>
                                                        }
                                                    </View>
                                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <Icon onPress={() => {
                                                            setSelectedFood(item);
                                                            setTimeout(() => {
                                                                setShowPopup(!ShowPopup)
                                                            }, 200);
                                                        }} name="info-outline" size={20} color="#FFF" />
                                                        {/* <Icon style={{ marginLeft: 10 }} onPress={() => {
                                                            setShowAlert(true);
                                                            setSelectedReplaceFood({ food: food, type: "AraList3" });
                                                        }} name="replay" size={20} color="#FFF" /> */}
                                                        <Icon style={{ marginLeft: 10 }} onPress={() => EatFood(food, "aralist3")} name="check" size={20} color={item.completed === true ? "#00FF00" : "#FFF"} />
                                                    </View>
                                                </View>
                                            )
                                        }}
                                    />
                                </>
                            }
                        </>
                        //     :
                        //     <>
                        //     {!Loading &&
                        //         <View style={{ height: 'auto', paddingHorizontal: 20, marginBottom: 20, marginTop: 30, justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                        //             <Icon name="lock" size={64} color="#4D4D4D" />
                        //             <Text style={[styles.headerText, { color: '#4D4D4D', fontSize: 16, textAlign: 'center', marginTop: 10 }]}>Seçili günün beslenmesine geçmek için önceki programlarınızı tamamlamalısınız.</Text>
                        //         </View>
                        //     }

                        // </>
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
    popupText: {
        fontFamily: 'SFProDisplay-Medium',
        fontSize: 18,
        color: '#FFF',
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
        textAlign: 'center',
        fontFamily: 'SFProDisplay-Medium',
        fontSize: 16,
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
        fontFamily: 'SFProDisplay-Medium',
        fontSize: 17,
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
    foodHeader: {
        fontFamily: 'SFProDisplay-Bold',
        fontSize: 18,
        color: '#FFF',
        width: '100%'
    },
    foodName: {
        fontFamily: 'SFProDisplay-Medium',
        fontSize: 16,
        color: '#FFF'
    },
    modalStyle: {
        paddingVertical: 5,
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center'
    }
})
export default Food;