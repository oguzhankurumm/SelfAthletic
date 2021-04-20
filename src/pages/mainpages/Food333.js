import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Image, StatusBar, TouchableOpacity, TouchableHighlight, Dimensions, ImageBackground, SafeAreaView, ScrollView, FlatList, Alert, RefreshControl } from 'react-native';
import { useSelector } from 'react-redux';
import { database2 } from '../../config/config';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import SpinnerLoading from '../../components/SpinnerLoading';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Sidebar from '../../components/Sidebar';
import moment from 'moment';
import 'moment/locale/tr';
moment.locale('tr');
import LinearGradient from 'react-native-linear-gradient';
import CalendarStrip from 'react-native-calendar-strip';
import Modal from 'react-native-modal';

const { height, width } = Dimensions.get("window");

const Food = ({ navigation }) => {
    const profileData = useSelector(state => state.user.users);

    const [Loading, setLoading] = useState(true);
    const [Refreshing, setRefreshing] = useState(false)
    const [SaveLoading, setSaveLoading] = useState(false);
    const [TotalProgress, setTotalProgress] = useState(30);

    const [KahvaltiList, setKahvaltiList] = useState([]);
    const [OgleList, setOgleList] = useState([]);
    const [AksamList, setAksamList] = useState([]);

    const [ShowSideModal, setShowSideModal] = useState(false);

    const [MyHistory, setMyHistory] = useState([]);
    const [markedDatesArray, setmarkedDatesArray] = useState([]);
    const [isFoodDay, setisFoodtDay] = useState(false);
    const [SelectedDate, setSelectedDate] = useState(moment());

    const [Calories, setCalories] = useState(0);
    const [CaloriesChart, setCaloriesChart] = useState(0);

    const [ShowPopup, setShowPopup] = useState(false);
    const [SelectedFood, setSelectedFood] = useState([]);


    const closeModal = () => {
        setShowSideModal(!ShowSideModal);
    }

    useEffect(() => {
        createFoodList();
    }, [])

    let datesBlacklist = [{
        start: moment().add(1, 'days'),
        end: moment().add(10, 'days')
    }];

    const createFoodList = () => {
        setLoading(true);
        let healthProblems = profileData.questions?.healthproblems !== undefined ? profileData.questions?.healthproblems : 'Yok';
        let Nutrition = profileData.questions?.nutrition !== undefined ? profileData.questions?.nutrition : 'Yok';
        let Target = profileData.questions?.target !== undefined ? profileData.questions?.target : 'Yok';
        let gunlukEnerji = profileData.gunlukEnerji !== undefined ? profileData.gunlukEnerji : 1400;

        let kahvaltiList = [];
        let kahvaltiNewList = [];
        let araList = [];
        let ogleList = [];
        let ogleNewList = [];
        let aksamList = [];
        let aksamNewList = [];

        let senecek = 1;

        //atanacak listeler
        let kahvaltiSutList = [];
        let kahvaltiEkmekList = [];
        let kahvaltiMeyveList = [];
        let kahvaltiYagList = [];
        let kahvaltiEYPList = [];

        let ogleEYPList = [];
        let ogleSebzeList = [];
        let ogleYagList = [];
        let ogleEkmekList = [];

        let aksamEYPList = [];
        let aksamSebzeList = [];
        let aksamSutList = [];
        let aksamYagList = [];
        let aksamEkmekList = [];


        let araList1 = [];
        let araList2 = [];

        var totalSut = 0;
        var totalSutKatsayi = 0;
        var totalMeyve = 0;
        var totalMeyveKatsayi = 0;
        var totalSebze = 0;
        var totalSebzeKatsayi = 0;
        var totalEYP = 0;
        var totalEYPKatsayi = 0;
        var totalYag = 0;
        var totalYagKatsayi = 0;
        var totalEkmek = 0;
        var totalEkmekKatsayi = 0;
        var totalEt = 0;
        var totalEtKatsayi = 0;

        database2.ref('foods').once('value')
            .then((snapshot) => {

                snapshot.forEach((item) => {

                    setLoading(false);

                    Object.values(item.val().category).map((fd) => {
                        if (fd === "Kahvalti") {
                            kahvaltiList.push({
                                ...item.val(),
                                id: item.key
                            })
                        }

                        if (fd === "Ara") {
                            araList.push({
                                ...item.val(),
                                id: item.key
                            })
                        }

                        if (fd === "Ana") {
                            aksamList.push({
                                ...item.val(),
                                id: item.key
                            })
                        }
                    })

                })

                if (gunlukEnerji >= 1700 && gunlukEnerji <= 1799 && Target === "Kas Kütlesi Artışı") {


                    Object.values(kahvaltiList).map((kh) => {
                        if ((kh.program[0] === "Kas Kütlesi Artışı" || kh.program[1] === "Kas Kütlesi Artışı" || kh.program[2] === "Kas Kütlesi Artışı" || kh.program[3] === "Kas Kütlesi Artışı" || kh.program[4] === "Kas Kütlesi Artışı")) {

                            if ((kh.birim1 === "Süt" || kh.birim2 === "Süt" || kh.birim3 === "Süt")) {
                                if (totalSut !== 1) {
                                    var besinSut = 0;
                                    var besinEkmek = 0;
                                    var besinMeyve = 0;
                                    var besinYag = 0;
                                    var besinEYP = 0;
                                    var besinSebze = 0;

                                    if (kh.birim1 === "Süt") {
                                        besinSut = parseFloat(besinSut) + parseFloat(kh.deger1);
                                        // totalSut = parseFloat(totalSut) + parseFloat(kh.deger1)
                                        // totalSutKatsayi = parseFloat(totalSutKatsayi) + parseFloat(kh.katsayi1)
                                    }

                                    if (kh.birim1 === "Ekmek") {
                                        besinEkmek = parseFloat(besinEkmek) + parseFloat(kh.deger1);
                                        // totalEkmek = parseFloat(totalEkmek) + parseFloat(kh.deger1)
                                        // totalEkmekKatsayi = parseFloat(totalEkmekKatsayi) + parseFloat(kh.katsayi1)
                                    }

                                    if (kh.birim1 === "Meyve") {
                                        besinMeyve = parseFloat(besinMeyve) + parseFloat(kh.deger1);
                                        // totalMeyve = parseFloat(totalMeyve) + parseFloat(kh.deger1)
                                        // totalMeyveKatsayi = parseFloat(totalMeyveKatsayi) + parseFloat(kh.katsayi1)
                                    }

                                    if (kh.birim1 === "Yağ") {
                                        besinYag = parseFloat(besinYag) + parseFloat(kh.deger1);

                                        // totalYag = parseFloat(totalYag) + parseFloat(kh.deger1)
                                        // totalYagKatsayi = parseFloat(totalYagKatsayi) + parseFloat(kh.katsayi1)
                                    }

                                    if (kh.birim1 === "EYP") {
                                        besinEYP = parseFloat(besinEYP) + parseFloat(kh.deger1);
                                        // totalEYP = parseFloat(totalEYP) + parseFloat(kh.deger1)
                                        // totalEYPKatsayi = parseFloat(totalEYPKatsayi) + parseFloat(kh.katsayi1)
                                    }

                                    if (kh.birim1 === "Sebze") {
                                        besinSebze = parseFloat(besinSebze) + parseFloat(kh.deger1);
                                        // totalSebze + parseFloat(kh.deger1)
                                        // totalSebzeKatsayi = parseFloat(totalSebzeKatsayi) + parseFloat(kh.katsayi1)
                                    }

                                    //BIRIM 1 SON

                                    if (kh.birim2 === "Süt") {
                                        totalSut = parseFloat(totalSut) + parseFloat(kh.deger2)
                                        totalSutKatsayi = parseFloat(totalSutKatsayi) + parseFloat(kh.katsayi1)
                                    }

                                    if (kh.birim2 === "Ekmek") {
                                        totalEkmek = parseFloat(totalEkmek) + parseFloat(kh.deger2)
                                        totalEkmekKatsayi = parseFloat(totalEkmekKatsayi) + parseFloat(kh.katsayi1)
                                    }

                                    if (kh.birim2 === "Meyve") {
                                        totalMeyve = parseFloat(totalMeyve) + parseFloat(kh.deger2)
                                        totalMeyveKatsayi = parseFloat(totalMeyveKatsayi) + parseFloat(kh.katsayi1)
                                    }

                                    if (kh.birim2 === "Yağ") {
                                        totalYag = parseFloat(totalYag) + parseFloat(kh.deger2)
                                        totalYagKatsayi = parseFloat(totalYagKatsayi) + parseFloat(kh.katsayi1)
                                    }

                                    if (kh.birim2 === "EYP") {
                                        totalEYP = parseFloat(totalEYP) + parseFloat(kh.deger2)
                                        totalEYPKatsayi = parseFloat(totalEYPKatsayi) + parseFloat(kh.katsayi1)
                                    }

                                    if (kh.birim2 === "Sebze") {
                                        totalSebze + parseFloat(kh.deger2)
                                        totalSebzeKatsayi = parseFloat(totalSebzeKatsayi) + parseFloat(kh.katsayi1)
                                    }

                                    //BIRIM 2 SON

                                    if (kh.birim3 === "Süt") {
                                        totalSut = parseFloat(totalSut) + parseFloat(kh.deger3)
                                        totalSutKatsayi = parseFloat(totalSutKatsayi) + parseFloat(kh.katsayi1)
                                    }

                                    if (kh.birim3 === "Ekmek") {
                                        totalEkmek = parseFloat(totalEkmek) + parseFloat(kh.deger3)
                                        totalEkmekKatsayi = parseFloat(totalEkmekKatsayi) + parseFloat(kh.katsayi1)
                                    }

                                    if (kh.birim3 === "Meyve") {
                                        totalMeyve = parseFloat(totalMeyve) + parseFloat(kh.deger3)
                                        totalMeyveKatsayi = parseFloat(totalMeyveKatsayi) + parseFloat(kh.katsayi1)
                                    }

                                    if (kh.birim3 === "Yağ") {
                                        totalYag = parseFloat(totalYag) + parseFloat(kh.deger3)
                                        totalYagKatsayi = parseFloat(totalYagKatsayi) + parseFloat(kh.katsayi1)
                                    }

                                    if (kh.birim3 === "EYP") {
                                        totalEYP = parseFloat(totalEYP) + parseFloat(kh.deger3)
                                        totalEYPKatsayi = parseFloat(totalEYPKatsayi) + parseFloat(kh.katsayi1)
                                    }

                                    if (kh.birim3 === "Sebze") {
                                        totalSebze + parseFloat(kh.deger3)
                                        totalSebzeKatsayi = parseFloat(totalSebzeKatsayi) + parseFloat(kh.katsayi1)
                                    }

                                    //BIRIM 3 SON

                                    kahvaltiSutList.push(kh);

                                }


                            }

                            if ((kh.birim1 === "Ekmek" || kh.birim2 === "Ekmek" || kh.birim3 === "Ekmek") && (kh.notfor !== undefined && kh.notfor !== healthProblems)) {
                                if (totalEkmek !== 2) {
                                    if (kh.birim1 === "Süt") {
                                        totalSut = parseFloat(totalSut) + parseFloat(kh.deger1)
                                        totalSutKatsayi = parseFloat(totalSutKatsayi) + parseFloat(kh.katsayi1)
                                    }

                                    if (kh.birim1 === "Ekmek") {
                                        totalEkmek = parseFloat(totalEkmek) + parseFloat(kh.deger1)
                                        totalEkmekKatsayi = parseFloat(totalEkmekKatsayi) + parseFloat(kh.katsayi1)
                                    }

                                    if (kh.birim1 === "Meyve") {
                                        totalMeyve = parseFloat(totalMeyve) + parseFloat(kh.deger1)
                                        totalMeyveKatsayi = parseFloat(totalMeyveKatsayi) + parseFloat(kh.katsayi1)
                                    }

                                    if (kh.birim1 === "Yağ") {
                                        totalYag = parseFloat(totalYag) + parseFloat(kh.deger1)
                                        totalYagKatsayi = parseFloat(totalYagKatsayi) + parseFloat(kh.katsayi1)
                                    }

                                    if (kh.birim1 === "EYP") {
                                        totalEYP = parseFloat(totalEYP) + parseFloat(kh.deger1)
                                        totalEYPKatsayi = parseFloat(totalEYPKatsayi) + parseFloat(kh.katsayi1)
                                    }

                                    if (kh.birim1 === "Sebze") {
                                        totalSebze + parseFloat(kh.deger1)
                                        totalSebzeKatsayi = parseFloat(totalSebzeKatsayi) + parseFloat(kh.katsayi1)
                                    }

                                    //BIRIM 1 SON

                                    if (kh.birim2 === "Süt") {
                                        totalSut = parseFloat(totalSut) + parseFloat(kh.deger2)
                                        totalSutKatsayi = parseFloat(totalSutKatsayi) + parseFloat(kh.katsayi1)
                                    }

                                    if (kh.birim2 === "Ekmek") {
                                        totalEkmek = parseFloat(totalEkmek) + parseFloat(kh.deger2)
                                        totalEkmekKatsayi = parseFloat(totalEkmekKatsayi) + parseFloat(kh.katsayi1)
                                    }

                                    if (kh.birim2 === "Meyve") {
                                        totalMeyve = parseFloat(totalMeyve) + parseFloat(kh.deger2)
                                        totalMeyveKatsayi = parseFloat(totalMeyveKatsayi) + parseFloat(kh.katsayi1)
                                    }

                                    if (kh.birim2 === "Yağ") {
                                        totalYag = parseFloat(totalYag) + parseFloat(kh.deger2)
                                        totalYagKatsayi = parseFloat(totalYagKatsayi) + parseFloat(kh.katsayi1)
                                    }

                                    if (kh.birim2 === "EYP") {
                                        totalEYP = parseFloat(totalEYP) + parseFloat(kh.deger2)
                                        totalEYPKatsayi = parseFloat(totalEYPKatsayi) + parseFloat(kh.katsayi1)
                                    }

                                    if (kh.birim2 === "Sebze") {
                                        totalSebze + parseFloat(kh.deger2)
                                        totalSebzeKatsayi = parseFloat(totalSebzeKatsayi) + parseFloat(kh.katsayi1)
                                    }

                                    //BIRIM 2 SON

                                    if (kh.birim3 === "Süt") {
                                        totalSut = parseFloat(totalSut) + parseFloat(kh.deger3)
                                        totalSutKatsayi = parseFloat(totalSutKatsayi) + parseFloat(kh.katsayi1)
                                    }

                                    if (kh.birim3 === "Ekmek") {
                                        totalEkmek = parseFloat(totalEkmek) + parseFloat(kh.deger3)
                                        totalEkmekKatsayi = parseFloat(totalEkmekKatsayi) + parseFloat(kh.katsayi1)
                                    }

                                    if (kh.birim3 === "Meyve") {
                                        totalMeyve = parseFloat(totalMeyve) + parseFloat(kh.deger3)
                                        totalMeyveKatsayi = parseFloat(totalMeyveKatsayi) + parseFloat(kh.katsayi1)
                                    }

                                    if (kh.birim3 === "Yağ") {
                                        totalYag = parseFloat(totalYag) + parseFloat(kh.deger3)
                                        totalYagKatsayi = parseFloat(totalYagKatsayi) + parseFloat(kh.katsayi1)
                                    }

                                    if (kh.birim3 === "EYP") {
                                        totalEYP = parseFloat(totalEYP) + parseFloat(kh.deger3)
                                        totalEYPKatsayi = parseFloat(totalEYPKatsayi) + parseFloat(kh.katsayi1)
                                    }

                                    if (kh.birim3 === "Sebze") {
                                        totalSebze + parseFloat(kh.deger3)
                                        totalSebzeKatsayi = parseFloat(totalSebzeKatsayi) + parseFloat(kh.katsayi1)
                                    }

                                    kahvaltiEkmekList.push(kh);
                                }


                            }

                            if ((kh.birim1 === "Meyve" || kh.birim2 === "Meyve" || kh.birim3 === "Meyve") && (kh.notfor !== undefined && kh.notfor !== healthProblems)) {
                                if (totalMeyve !== 2) {
                                    if (kh.birim1 === "Süt") {
                                        totalSut = parseFloat(totalSut) + parseFloat(kh.deger1)
                                        totalSutKatsayi = parseFloat(totalSutKatsayi) + parseFloat(kh.katsayi1)
                                    }

                                    if (kh.birim1 === "Ekmek") {
                                        totalEkmek = parseFloat(totalEkmek) + parseFloat(kh.deger1)
                                        totalEkmekKatsayi = parseFloat(totalEkmekKatsayi) + parseFloat(kh.katsayi1)
                                    }

                                    if (kh.birim1 === "Meyve") {
                                        totalMeyve = parseFloat(totalMeyve) + parseFloat(kh.deger1)
                                        totalMeyveKatsayi = parseFloat(totalMeyveKatsayi) + parseFloat(kh.katsayi1)
                                    }

                                    if (kh.birim1 === "Yağ") {
                                        totalYag = parseFloat(totalYag) + parseFloat(kh.deger1)
                                        totalYagKatsayi = parseFloat(totalYagKatsayi) + parseFloat(kh.katsayi1)
                                    }

                                    if (kh.birim1 === "EYP") {
                                        totalEYP = parseFloat(totalEYP) + parseFloat(kh.deger1)
                                        totalEYPKatsayi = parseFloat(totalEYPKatsayi) + parseFloat(kh.katsayi1)
                                    }

                                    if (kh.birim1 === "Sebze") {
                                        totalSebze + parseFloat(kh.deger1)
                                        totalSebzeKatsayi = parseFloat(totalSebzeKatsayi) + parseFloat(kh.katsayi1)
                                    }

                                    //BIRIM 1 SON

                                    if (kh.birim2 === "Süt") {
                                        totalSut = parseFloat(totalSut) + parseFloat(kh.deger2)
                                        totalSutKatsayi = parseFloat(totalSutKatsayi) + parseFloat(kh.katsayi1)
                                    }

                                    if (kh.birim2 === "Ekmek") {
                                        totalEkmek = parseFloat(totalEkmek) + parseFloat(kh.deger2)
                                        totalEkmekKatsayi = parseFloat(totalEkmekKatsayi) + parseFloat(kh.katsayi1)
                                    }

                                    if (kh.birim2 === "Meyve") {
                                        totalMeyve = parseFloat(totalMeyve) + parseFloat(kh.deger2)
                                        totalMeyveKatsayi = parseFloat(totalMeyveKatsayi) + parseFloat(kh.katsayi1)
                                    }

                                    if (kh.birim2 === "Yağ") {
                                        totalYag = parseFloat(totalYag) + parseFloat(kh.deger2)
                                        totalYagKatsayi = parseFloat(totalYagKatsayi) + parseFloat(kh.katsayi1)
                                    }

                                    if (kh.birim2 === "EYP") {
                                        totalEYP = parseFloat(totalEYP) + parseFloat(kh.deger2)
                                        totalEYPKatsayi = parseFloat(totalEYPKatsayi) + parseFloat(kh.katsayi1)
                                    }

                                    if (kh.birim2 === "Sebze") {
                                        totalSebze + parseFloat(kh.deger2)
                                        totalSebzeKatsayi = parseFloat(totalSebzeKatsayi) + parseFloat(kh.katsayi1)
                                    }

                                    //BIRIM 2 SON

                                    if (kh.birim3 === "Süt") {
                                        totalSut = parseFloat(totalSut) + parseFloat(kh.deger3)
                                        totalSutKatsayi = parseFloat(totalSutKatsayi) + parseFloat(kh.katsayi1)
                                    }

                                    if (kh.birim3 === "Ekmek") {
                                        totalEkmek = parseFloat(totalEkmek) + parseFloat(kh.deger3)
                                        totalEkmekKatsayi = parseFloat(totalEkmekKatsayi) + parseFloat(kh.katsayi1)
                                    }

                                    if (kh.birim3 === "Meyve") {
                                        totalMeyve = parseFloat(totalMeyve) + parseFloat(kh.deger3)
                                        totalMeyveKatsayi = parseFloat(totalMeyveKatsayi) + parseFloat(kh.katsayi1)
                                    }

                                    if (kh.birim3 === "Yağ") {
                                        totalYag = parseFloat(totalYag) + parseFloat(kh.deger3)
                                        totalYagKatsayi = parseFloat(totalYagKatsayi) + parseFloat(kh.katsayi1)
                                    }

                                    if (kh.birim3 === "EYP") {
                                        totalEYP = parseFloat(totalEYP) + parseFloat(kh.deger3)
                                        totalEYPKatsayi = parseFloat(totalEYPKatsayi) + parseFloat(kh.katsayi1)
                                    }

                                    if (kh.birim3 === "Sebze") {
                                        totalSebze + parseFloat(kh.deger3)
                                        totalSebzeKatsayi = parseFloat(totalSebzeKatsayi) + parseFloat(kh.katsayi1)
                                    }

                                    kahvaltiMeyveList.push(kh);
                                }
                            }

                            if ((kh.birim1 === "Yağ" || kh.birim2 === "Yağ" || kh.birim3 === "Yağ") && (kh.notfor !== undefined && kh.notfor !== healthProblems)) {
                                if (totalYag !== 2) {
                                    if (kh.birim1 === "Süt") {
                                        totalSut = parseFloat(totalSut) + parseFloat(kh.deger1)
                                        totalSutKatsayi = parseFloat(totalSutKatsayi) + parseFloat(kh.katsayi1)
                                    }

                                    if (kh.birim1 === "Ekmek") {
                                        totalEkmek = parseFloat(totalEkmek) + parseFloat(kh.deger1)
                                        totalEkmekKatsayi = parseFloat(totalEkmekKatsayi) + parseFloat(kh.katsayi1)
                                    }

                                    if (kh.birim1 === "Meyve") {
                                        totalMeyve = parseFloat(totalMeyve) + parseFloat(kh.deger1)
                                        totalMeyveKatsayi = parseFloat(totalMeyveKatsayi) + parseFloat(kh.katsayi1)
                                    }

                                    if (kh.birim1 === "Yağ") {
                                        totalYag = parseFloat(totalYag) + parseFloat(kh.deger1)
                                        totalYagKatsayi = parseFloat(totalYagKatsayi) + parseFloat(kh.katsayi1)
                                    }

                                    if (kh.birim1 === "EYP") {
                                        totalEYP = parseFloat(totalEYP) + parseFloat(kh.deger1)
                                        totalEYPKatsayi = parseFloat(totalEYPKatsayi) + parseFloat(kh.katsayi1)
                                    }

                                    if (kh.birim1 === "Sebze") {
                                        totalSebze + parseFloat(kh.deger1)
                                        totalSebzeKatsayi = parseFloat(totalSebzeKatsayi) + parseFloat(kh.katsayi1)
                                    }

                                    //BIRIM 1 SON

                                    if (kh.birim2 === "Süt") {
                                        totalSut = parseFloat(totalSut) + parseFloat(kh.deger2)
                                        totalSutKatsayi = parseFloat(totalSutKatsayi) + parseFloat(kh.katsayi1)
                                    }

                                    if (kh.birim2 === "Ekmek") {
                                        totalEkmek = parseFloat(totalEkmek) + parseFloat(kh.deger2)
                                        totalEkmekKatsayi = parseFloat(totalEkmekKatsayi) + parseFloat(kh.katsayi1)
                                    }

                                    if (kh.birim2 === "Meyve") {
                                        totalMeyve = parseFloat(totalMeyve) + parseFloat(kh.deger2)
                                        totalMeyveKatsayi = parseFloat(totalMeyveKatsayi) + parseFloat(kh.katsayi1)
                                    }

                                    if (kh.birim2 === "Yağ") {
                                        totalYag = parseFloat(totalYag) + parseFloat(kh.deger2)
                                        totalYagKatsayi = parseFloat(totalYagKatsayi) + parseFloat(kh.katsayi1)
                                    }

                                    if (kh.birim2 === "EYP") {
                                        totalEYP = parseFloat(totalEYP) + parseFloat(kh.deger2)
                                        totalEYPKatsayi = parseFloat(totalEYPKatsayi) + parseFloat(kh.katsayi1)
                                    }

                                    if (kh.birim2 === "Sebze") {
                                        totalSebze + parseFloat(kh.deger2)
                                        totalSebzeKatsayi = parseFloat(totalSebzeKatsayi) + parseFloat(kh.katsayi1)
                                    }

                                    //BIRIM 2 SON

                                    if (kh.birim3 === "Süt") {
                                        totalSut = parseFloat(totalSut) + parseFloat(kh.deger3)
                                        totalSutKatsayi = parseFloat(totalSutKatsayi) + parseFloat(kh.katsayi1)
                                    }

                                    if (kh.birim3 === "Ekmek") {
                                        totalEkmek = parseFloat(totalEkmek) + parseFloat(kh.deger3)
                                        totalEkmekKatsayi = parseFloat(totalEkmekKatsayi) + parseFloat(kh.katsayi1)
                                    }

                                    if (kh.birim3 === "Meyve") {
                                        totalMeyve = parseFloat(totalMeyve) + parseFloat(kh.deger3)
                                        totalMeyveKatsayi = parseFloat(totalMeyveKatsayi) + parseFloat(kh.katsayi1)
                                    }

                                    if (kh.birim3 === "Yağ") {
                                        totalYag = parseFloat(totalYag) + parseFloat(kh.deger3)
                                        totalYagKatsayi = parseFloat(totalYagKatsayi) + parseFloat(kh.katsayi1)
                                    }

                                    if (kh.birim3 === "EYP") {
                                        totalEYP = parseFloat(totalEYP) + parseFloat(kh.deger3)
                                        totalEYPKatsayi = parseFloat(totalEYPKatsayi) + parseFloat(kh.katsayi1)
                                    }

                                    if (kh.birim3 === "Sebze") {
                                        totalSebze + parseFloat(kh.deger3)
                                        totalSebzeKatsayi = parseFloat(totalSebzeKatsayi) + parseFloat(kh.katsayi1)
                                    }

                                    kahvaltiYagList.push(kh);
                                }
                            }

                        }
                    })

                    console.log('sutKatSayi: ', totalSut)
                    console.log('yagKatSayi: ', totalYag)
                    console.log('sebzeKatSayi: ', totalSebze)
                    console.log('meyveKatSayi: ', totalMeyve)
                    console.log('eypKatSayi: ', totalEYP)
                    console.log('ekmekKatSayi: ', totalEkmek)
                    // ÖĞLE YEMEĞİ

                    // Object.values(aksamList).map((kh) => {
                    //     if ((kh.program[0] === "Kas Kütlesi Artışı" || kh.program[1] === "Kas Kütlesi Artışı" || kh.program[2] === "Kas Kütlesi Artışı" || kh.program[3] === "Kas Kütlesi Artışı" || kh.program[4] === "Kas Kütlesi Artışı")) {

                    //         if ((kh.birim1 === "Ekmek" || kh.birim2 === "Ekmek" || kh.birim3 === "Ekmek") && (kh.notfor !== undefined && kh.notfor !== healthProblems)) {
                    //             if (totalEkmek !== 5) {
                    //                 if (kh.birim1 === "Süt") {
                    //                     totalSut = parseFloat(totalSut) + parseFloat(kh.deger1)
                    //                     totalSutKatsayi = parseFloat(totalSutKatsayi) + parseFloat(kh.katsayi1)
                    //                 }

                    //                 if (kh.birim1 === "Ekmek") {
                    //                     totalEkmek = parseFloat(totalEkmek) + parseFloat(kh.deger1)
                    //                     totalEkmekKatsayi = parseFloat(totalEkmekKatsayi) + parseFloat(kh.katsayi1)
                    //                 }

                    //                 if (kh.birim1 === "Meyve") {
                    //                     totalMeyve = parseFloat(totalMeyve) + parseFloat(kh.deger1)
                    //                     totalMeyveKatsayi = parseFloat(totalMeyveKatsayi) + parseFloat(kh.katsayi1)
                    //                 }

                    //                 if (kh.birim1 === "Yağ") {
                    //                     totalYag = parseFloat(totalYag) + parseFloat(kh.deger1)
                    //                     totalYagKatsayi = parseFloat(totalYagKatsayi) + parseFloat(kh.katsayi1)
                    //                 }

                    //                 if (kh.birim1 === "EYP") {
                    //                     totalEYP = parseFloat(totalEYP) + parseFloat(kh.deger1)
                    //                     totalEYPKatsayi = parseFloat(totalEYPKatsayi) + parseFloat(kh.katsayi1)
                    //                 }

                    //                 if (kh.birim1 === "Sebze") {
                    //                     totalSebze + parseFloat(kh.deger1)
                    //                     totalSebzeKatsayi = parseFloat(totalSebzeKatsayi) + parseFloat(kh.katsayi1)
                    //                 }

                    //                 //BIRIM 1 SON

                    //                 if (kh.birim2 === "Süt") {
                    //                     totalSut = parseFloat(totalSut) + parseFloat(kh.deger2)
                    //                     totalSutKatsayi = parseFloat(totalSutKatsayi) + parseFloat(kh.katsayi1)
                    //                 }

                    //                 if (kh.birim2 === "Ekmek") {
                    //                     totalEkmek = parseFloat(totalEkmek) + parseFloat(kh.deger2)
                    //                     totalEkmekKatsayi = parseFloat(totalEkmekKatsayi) + parseFloat(kh.katsayi1)
                    //                 }

                    //                 if (kh.birim2 === "Meyve") {
                    //                     totalMeyve = parseFloat(totalMeyve) + parseFloat(kh.deger2)
                    //                     totalMeyveKatsayi = parseFloat(totalMeyveKatsayi) + parseFloat(kh.katsayi1)
                    //                 }

                    //                 if (kh.birim2 === "Yağ") {
                    //                     totalYag = parseFloat(totalYag) + parseFloat(kh.deger2)
                    //                     totalYagKatsayi = parseFloat(totalYagKatsayi) + parseFloat(kh.katsayi1)
                    //                 }

                    //                 if (kh.birim2 === "EYP") {
                    //                     totalEYP = parseFloat(totalEYP) + parseFloat(kh.deger2)
                    //                     totalEYPKatsayi = parseFloat(totalEYPKatsayi) + parseFloat(kh.katsayi1)
                    //                 }

                    //                 if (kh.birim2 === "Sebze") {
                    //                     totalSebze + parseFloat(kh.deger2)
                    //                     totalSebzeKatsayi = parseFloat(totalSebzeKatsayi) + parseFloat(kh.katsayi1)
                    //                 }

                    //                 //BIRIM 2 SON

                    //                 if (kh.birim3 === "Süt") {
                    //                     totalSut = parseFloat(totalSut) + parseFloat(kh.deger3)
                    //                     totalSutKatsayi = parseFloat(totalSutKatsayi) + parseFloat(kh.katsayi1)
                    //                 }

                    //                 if (kh.birim3 === "Ekmek") {
                    //                     totalEkmek = parseFloat(totalEkmek) + parseFloat(kh.deger3)
                    //                     totalEkmekKatsayi = parseFloat(totalEkmekKatsayi) + parseFloat(kh.katsayi1)
                    //                 }

                    //                 if (kh.birim3 === "Meyve") {
                    //                     totalMeyve = parseFloat(totalMeyve) + parseFloat(kh.deger3)
                    //                     totalMeyveKatsayi = parseFloat(totalMeyveKatsayi) + parseFloat(kh.katsayi1)
                    //                 }

                    //                 if (kh.birim3 === "Yağ") {
                    //                     totalYag = parseFloat(totalYag) + parseFloat(kh.deger3)
                    //                     totalYagKatsayi = parseFloat(totalYagKatsayi) + parseFloat(kh.katsayi1)
                    //                 }

                    //                 if (kh.birim3 === "EYP") {
                    //                     totalEYP = parseFloat(totalEYP) + parseFloat(kh.deger3)
                    //                     totalEYPKatsayi = parseFloat(totalEYPKatsayi) + parseFloat(kh.katsayi1)
                    //                 }

                    //                 if (kh.birim3 === "Sebze") {
                    //                     totalSebze + parseFloat(kh.deger3)
                    //                     totalSebzeKatsayi = parseFloat(totalSebzeKatsayi) + parseFloat(kh.katsayi1)
                    //                 }

                    //                 ogleEkmekList.push(kh);
                    //             }

                    //         }

                    //         if ((kh.birim1 === "Yağ" || kh.birim2 === "Yağ" || kh.birim3 === "Yağ") && (kh.notfor !== undefined && kh.notfor !== healthProblems)) {
                    //             if (totalYag !== 4) {
                    //                 if (kh.birim1 === "Süt") {
                    //                     totalSut = parseFloat(totalSut) + parseFloat(kh.deger1)
                    //                     totalSutKatsayi = parseFloat(totalSutKatsayi) + parseFloat(kh.katsayi1)
                    //                 }

                    //                 if (kh.birim1 === "Ekmek") {
                    //                     totalEkmek = parseFloat(totalEkmek) + parseFloat(kh.deger1)
                    //                     totalEkmekKatsayi = parseFloat(totalEkmekKatsayi) + parseFloat(kh.katsayi1)
                    //                 }

                    //                 if (kh.birim1 === "Meyve") {
                    //                     totalMeyve = parseFloat(totalMeyve) + parseFloat(kh.deger1)
                    //                     totalMeyveKatsayi = parseFloat(totalMeyveKatsayi) + parseFloat(kh.katsayi1)
                    //                 }

                    //                 if (kh.birim1 === "Yağ") {
                    //                     totalYag = parseFloat(totalYag) + parseFloat(kh.deger1)
                    //                     totalYagKatsayi = parseFloat(totalYagKatsayi) + parseFloat(kh.katsayi1)
                    //                 }

                    //                 if (kh.birim1 === "EYP") {
                    //                     totalEYP = parseFloat(totalEYP) + parseFloat(kh.deger1)
                    //                     totalEYPKatsayi = parseFloat(totalEYPKatsayi) + parseFloat(kh.katsayi1)
                    //                 }

                    //                 if (kh.birim1 === "Sebze") {
                    //                     totalSebze + parseFloat(kh.deger1)
                    //                     totalSebzeKatsayi = parseFloat(totalSebzeKatsayi) + parseFloat(kh.katsayi1)
                    //                 }

                    //                 //BIRIM 1 SON

                    //                 if (kh.birim2 === "Süt") {
                    //                     totalSut = parseFloat(totalSut) + parseFloat(kh.deger2)
                    //                     totalSutKatsayi = parseFloat(totalSutKatsayi) + parseFloat(kh.katsayi1)
                    //                 }

                    //                 if (kh.birim2 === "Ekmek") {
                    //                     totalEkmek = parseFloat(totalEkmek) + parseFloat(kh.deger2)
                    //                     totalEkmekKatsayi = parseFloat(totalEkmekKatsayi) + parseFloat(kh.katsayi1)
                    //                 }

                    //                 if (kh.birim2 === "Meyve") {
                    //                     totalMeyve = parseFloat(totalMeyve) + parseFloat(kh.deger2)
                    //                     totalMeyveKatsayi = parseFloat(totalMeyveKatsayi) + parseFloat(kh.katsayi1)
                    //                 }

                    //                 if (kh.birim2 === "Yağ") {
                    //                     totalYag = parseFloat(totalYag) + parseFloat(kh.deger2)
                    //                     totalYagKatsayi = parseFloat(totalYagKatsayi) + parseFloat(kh.katsayi1)
                    //                 }

                    //                 if (kh.birim2 === "EYP") {
                    //                     totalEYP = parseFloat(totalEYP) + parseFloat(kh.deger2)
                    //                     totalEYPKatsayi = parseFloat(totalEYPKatsayi) + parseFloat(kh.katsayi1)
                    //                 }

                    //                 if (kh.birim2 === "Sebze") {
                    //                     totalSebze + parseFloat(kh.deger2)
                    //                     totalSebzeKatsayi = parseFloat(totalSebzeKatsayi) + parseFloat(kh.katsayi1)
                    //                 }

                    //                 //BIRIM 2 SON

                    //                 if (kh.birim3 === "Süt") {
                    //                     totalSut = parseFloat(totalSut) + parseFloat(kh.deger3)
                    //                     totalSutKatsayi = parseFloat(totalSutKatsayi) + parseFloat(kh.katsayi1)
                    //                 }

                    //                 if (kh.birim3 === "Ekmek") {
                    //                     totalEkmek = parseFloat(totalEkmek) + parseFloat(kh.deger3)
                    //                     totalEkmekKatsayi = parseFloat(totalEkmekKatsayi) + parseFloat(kh.katsayi1)
                    //                 }

                    //                 if (kh.birim3 === "Meyve") {
                    //                     totalMeyve = parseFloat(totalMeyve) + parseFloat(kh.deger3)
                    //                     totalMeyveKatsayi = parseFloat(totalMeyveKatsayi) + parseFloat(kh.katsayi1)
                    //                 }

                    //                 if (kh.birim3 === "Yağ") {
                    //                     totalYag = parseFloat(totalYag) + parseFloat(kh.deger3)
                    //                     totalYagKatsayi = parseFloat(totalYagKatsayi) + parseFloat(kh.katsayi1)
                    //                 }

                    //                 if (kh.birim3 === "EYP") {
                    //                     totalEYP = parseFloat(totalEYP) + parseFloat(kh.deger3)
                    //                     totalEYPKatsayi = parseFloat(totalEYPKatsayi) + parseFloat(kh.katsayi1)
                    //                 }

                    //                 if (kh.birim3 === "Sebze") {
                    //                     totalSebze + parseFloat(kh.deger3)
                    //                     totalSebzeKatsayi = parseFloat(totalSebzeKatsayi) + parseFloat(kh.katsayi1)
                    //                 }

                    //                 ogleYagList.push(kh);
                    //             }
                    //         }

                    //         if ((kh.birim1 === "EYP" || kh.birim2 === "EYP" || kh.birim3 === "EYP") && (kh.notfor !== undefined && kh.notfor !== healthProblems)) {
                    //             if (totalEYP !== 6) {
                    //                 if (kh.birim1 === "Süt") {
                    //                     totalSut = parseFloat(totalSut) + parseFloat(kh.deger1)
                    //                     totalSutKatsayi = parseFloat(totalSutKatsayi) + parseFloat(kh.katsayi1)
                    //                 }

                    //                 if (kh.birim1 === "Ekmek") {
                    //                     totalEkmek = parseFloat(totalEkmek) + parseFloat(kh.deger1)
                    //                     totalEkmekKatsayi = parseFloat(totalEkmekKatsayi) + parseFloat(kh.katsayi1)
                    //                 }

                    //                 if (kh.birim1 === "Meyve") {
                    //                     totalMeyve = parseFloat(totalMeyve) + parseFloat(kh.deger1)
                    //                     totalMeyveKatsayi = parseFloat(totalMeyveKatsayi) + parseFloat(kh.katsayi1)
                    //                 }

                    //                 if (kh.birim1 === "Yağ") {
                    //                     totalYag = parseFloat(totalYag) + parseFloat(kh.deger1)
                    //                     totalYagKatsayi = parseFloat(totalYagKatsayi) + parseFloat(kh.katsayi1)
                    //                 }

                    //                 if (kh.birim1 === "EYP") {
                    //                     totalEYP = parseFloat(totalEYP) + parseFloat(kh.deger1)
                    //                     totalEYPKatsayi = parseFloat(totalEYPKatsayi) + parseFloat(kh.katsayi1)
                    //                 }

                    //                 if (kh.birim1 === "Sebze") {
                    //                     totalSebze + parseFloat(kh.deger1)
                    //                     totalSebzeKatsayi = parseFloat(totalSebzeKatsayi) + parseFloat(kh.katsayi1)
                    //                 }

                    //                 //BIRIM 1 SON

                    //                 if (kh.birim2 === "Süt") {
                    //                     totalSut = parseFloat(totalSut) + parseFloat(kh.deger2)
                    //                     totalSutKatsayi = parseFloat(totalSutKatsayi) + parseFloat(kh.katsayi1)
                    //                 }

                    //                 if (kh.birim2 === "Ekmek") {
                    //                     totalEkmek = parseFloat(totalEkmek) + parseFloat(kh.deger2)
                    //                     totalEkmekKatsayi = parseFloat(totalEkmekKatsayi) + parseFloat(kh.katsayi1)
                    //                 }

                    //                 if (kh.birim2 === "Meyve") {
                    //                     totalMeyve = parseFloat(totalMeyve) + parseFloat(kh.deger2)
                    //                     totalMeyveKatsayi = parseFloat(totalMeyveKatsayi) + parseFloat(kh.katsayi1)
                    //                 }

                    //                 if (kh.birim2 === "Yağ") {
                    //                     totalYag = parseFloat(totalYag) + parseFloat(kh.deger2)
                    //                     totalYagKatsayi = parseFloat(totalYagKatsayi) + parseFloat(kh.katsayi1)
                    //                 }

                    //                 if (kh.birim2 === "EYP") {
                    //                     totalEYP = parseFloat(totalEYP) + parseFloat(kh.deger2)
                    //                     totalEYPKatsayi = parseFloat(totalEYPKatsayi) + parseFloat(kh.katsayi1)
                    //                 }

                    //                 if (kh.birim2 === "Sebze") {
                    //                     totalSebze + parseFloat(kh.deger2)
                    //                     totalSebzeKatsayi = parseFloat(totalSebzeKatsayi) + parseFloat(kh.katsayi1)
                    //                 }

                    //                 //BIRIM 2 SON

                    //                 if (kh.birim3 === "Süt") {
                    //                     totalSut = parseFloat(totalSut) + parseFloat(kh.deger3)
                    //                     totalSutKatsayi = parseFloat(totalSutKatsayi) + parseFloat(kh.katsayi1)
                    //                 }

                    //                 if (kh.birim3 === "Ekmek") {
                    //                     totalEkmek = parseFloat(totalEkmek) + parseFloat(kh.deger3)
                    //                     totalEkmekKatsayi = parseFloat(totalEkmekKatsayi) + parseFloat(kh.katsayi1)
                    //                 }

                    //                 if (kh.birim3 === "Meyve") {
                    //                     totalMeyve = parseFloat(totalMeyve) + parseFloat(kh.deger3)
                    //                     totalMeyveKatsayi = parseFloat(totalMeyveKatsayi) + parseFloat(kh.katsayi1)
                    //                 }

                    //                 if (kh.birim3 === "Yağ") {
                    //                     totalYag = parseFloat(totalYag) + parseFloat(kh.deger3)
                    //                     totalYagKatsayi = parseFloat(totalYagKatsayi) + parseFloat(kh.katsayi1)
                    //                 }

                    //                 if (kh.birim3 === "EYP") {
                    //                     totalEYP = parseFloat(totalEYP) + parseFloat(kh.deger3)
                    //                     totalEYPKatsayi = parseFloat(totalEYPKatsayi) + parseFloat(kh.katsayi1)
                    //                 }

                    //                 if (kh.birim3 === "Sebze") {
                    //                     totalSebze + parseFloat(kh.deger3)
                    //                     totalSebzeKatsayi = parseFloat(totalSebzeKatsayi) + parseFloat(kh.katsayi1)
                    //                 }

                    //                 ogleEYPList.push(kh);
                    //             }

                    //         }

                    //         if ((kh.birim1 === "Sebze" || kh.birim2 === "Sebze" || kh.birim3 === "Sebze") && (kh.notfor !== undefined && kh.notfor !== healthProblems)) {
                    //             if (totalSebze !== 2) {
                    //                 if (kh.birim1 === "Süt") {
                    //                     totalSut = parseFloat(totalSut) + parseFloat(kh.deger1)
                    //                     totalSutKatsayi = parseFloat(totalSutKatsayi) + parseFloat(kh.katsayi1)
                    //                 }

                    //                 if (kh.birim1 === "Ekmek") {
                    //                     totalEkmek = parseFloat(totalEkmek) + parseFloat(kh.deger1)
                    //                     totalEkmekKatsayi = parseFloat(totalEkmekKatsayi) + parseFloat(kh.katsayi1)
                    //                 }

                    //                 if (kh.birim1 === "Meyve") {
                    //                     totalMeyve = parseFloat(totalMeyve) + parseFloat(kh.deger1)
                    //                     totalMeyveKatsayi = parseFloat(totalMeyveKatsayi) + parseFloat(kh.katsayi1)
                    //                 }

                    //                 if (kh.birim1 === "Yağ") {
                    //                     totalYag = parseFloat(totalYag) + parseFloat(kh.deger1)
                    //                     totalYagKatsayi = parseFloat(totalYagKatsayi) + parseFloat(kh.katsayi1)
                    //                 }

                    //                 if (kh.birim1 === "EYP") {
                    //                     totalEYP = parseFloat(totalEYP) + parseFloat(kh.deger1)
                    //                     totalEYPKatsayi = parseFloat(totalEYPKatsayi) + parseFloat(kh.katsayi1)
                    //                 }

                    //                 if (kh.birim1 === "Sebze") {
                    //                     totalSebze + parseFloat(kh.deger1)
                    //                     totalSebzeKatsayi = parseFloat(totalSebzeKatsayi) + parseFloat(kh.katsayi1)
                    //                 }

                    //                 //BIRIM 1 SON

                    //                 if (kh.birim2 === "Süt") {
                    //                     totalSut = parseFloat(totalSut) + parseFloat(kh.deger2)
                    //                     totalSutKatsayi = parseFloat(totalSutKatsayi) + parseFloat(kh.katsayi1)
                    //                 }

                    //                 if (kh.birim2 === "Ekmek") {
                    //                     totalEkmek = parseFloat(totalEkmek) + parseFloat(kh.deger2)
                    //                     totalEkmekKatsayi = parseFloat(totalEkmekKatsayi) + parseFloat(kh.katsayi1)
                    //                 }

                    //                 if (kh.birim2 === "Meyve") {
                    //                     totalMeyve = parseFloat(totalMeyve) + parseFloat(kh.deger2)
                    //                     totalMeyveKatsayi = parseFloat(totalMeyveKatsayi) + parseFloat(kh.katsayi1)
                    //                 }

                    //                 if (kh.birim2 === "Yağ") {
                    //                     totalYag = parseFloat(totalYag) + parseFloat(kh.deger2)
                    //                     totalYagKatsayi = parseFloat(totalYagKatsayi) + parseFloat(kh.katsayi1)
                    //                 }

                    //                 if (kh.birim2 === "EYP") {
                    //                     totalEYP = parseFloat(totalEYP) + parseFloat(kh.deger2)
                    //                     totalEYPKatsayi = parseFloat(totalEYPKatsayi) + parseFloat(kh.katsayi1)
                    //                 }

                    //                 if (kh.birim2 === "Sebze") {
                    //                     totalSebze + parseFloat(kh.deger2)
                    //                     totalSebzeKatsayi = parseFloat(totalSebzeKatsayi) + parseFloat(kh.katsayi1)
                    //                 }

                    //                 //BIRIM 2 SON

                    //                 if (kh.birim3 === "Süt") {
                    //                     totalSut = parseFloat(totalSut) + parseFloat(kh.deger3)
                    //                     totalSutKatsayi = parseFloat(totalSutKatsayi) + parseFloat(kh.katsayi1)
                    //                 }

                    //                 if (kh.birim3 === "Ekmek") {
                    //                     totalEkmek = parseFloat(totalEkmek) + parseFloat(kh.deger3)
                    //                     totalEkmekKatsayi = parseFloat(totalEkmekKatsayi) + parseFloat(kh.katsayi1)
                    //                 }

                    //                 if (kh.birim3 === "Meyve") {
                    //                     totalMeyve = parseFloat(totalMeyve) + parseFloat(kh.deger3)
                    //                     totalMeyveKatsayi = parseFloat(totalMeyveKatsayi) + parseFloat(kh.katsayi1)
                    //                 }

                    //                 if (kh.birim3 === "Yağ") {
                    //                     totalYag = parseFloat(totalYag) + parseFloat(kh.deger3)
                    //                     totalYagKatsayi = parseFloat(totalYagKatsayi) + parseFloat(kh.katsayi1)
                    //                 }

                    //                 if (kh.birim3 === "EYP") {
                    //                     totalEYP = parseFloat(totalEYP) + parseFloat(kh.deger3)
                    //                     totalEYPKatsayi = parseFloat(totalEYPKatsayi) + parseFloat(kh.katsayi1)
                    //                 }

                    //                 if (kh.birim3 === "Sebze") {
                    //                     totalSebze + parseFloat(kh.deger3)
                    //                     totalSebzeKatsayi = parseFloat(totalSebzeKatsayi) + parseFloat(kh.katsayi1)
                    //                 }

                    //                 ogleSebzeList.push(kh);
                    //             }

                    //         }
                    //     }
                    // })

                    // Object.values(aksamList.reverse()).map((kh) => {

                    //     if ((kh.birim1 === "Süt" || kh.birim2 === "Süt" || kh.birim3 === "Süt")) {
                    //         if (totalSut !== 3) {
                    //             if (kh.birim1 === "Süt") {
                    //                 totalSut = parseFloat(totalSut) + parseFloat(kh.deger1)
                    //                 totalSutKatsayi = parseFloat(totalSutKatsayi) + parseFloat(kh.katsayi1)
                    //             }

                    //             if (kh.birim1 === "Ekmek") {
                    //                 totalEkmek = parseFloat(totalEkmek) + parseFloat(kh.deger1)
                    //                 totalEkmekKatsayi = parseFloat(totalEkmekKatsayi) + parseFloat(kh.katsayi1)
                    //             }

                    //             if (kh.birim1 === "Meyve") {
                    //                 totalMeyve = parseFloat(totalMeyve) + parseFloat(kh.deger1)
                    //                 totalMeyveKatsayi = parseFloat(totalMeyveKatsayi) + parseFloat(kh.katsayi1)
                    //             }

                    //             if (kh.birim1 === "Yağ") {
                    //                 totalYag = parseFloat(totalYag) + parseFloat(kh.deger1)
                    //                 totalYagKatsayi = parseFloat(totalYagKatsayi) + parseFloat(kh.katsayi1)
                    //             }

                    //             if (kh.birim1 === "EYP") {
                    //                 totalEYP = parseFloat(totalEYP) + parseFloat(kh.deger1)
                    //                 totalEYPKatsayi = parseFloat(totalEYPKatsayi) + parseFloat(kh.katsayi1)
                    //             }

                    //             if (kh.birim1 === "Sebze") {
                    //                 totalSebze + parseFloat(kh.deger1)
                    //                 totalSebzeKatsayi = parseFloat(totalSebzeKatsayi) + parseFloat(kh.katsayi1)
                    //             }

                    //             //BIRIM 1 SON

                    //             if (kh.birim2 === "Süt") {
                    //                 totalSut = parseFloat(totalSut) + parseFloat(kh.deger2)
                    //                 totalSutKatsayi = parseFloat(totalSutKatsayi) + parseFloat(kh.katsayi1)
                    //             }

                    //             if (kh.birim2 === "Ekmek") {
                    //                 totalEkmek = parseFloat(totalEkmek) + parseFloat(kh.deger2)
                    //                 totalEkmekKatsayi = parseFloat(totalEkmekKatsayi) + parseFloat(kh.katsayi1)
                    //             }

                    //             if (kh.birim2 === "Meyve") {
                    //                 totalMeyve = parseFloat(totalMeyve) + parseFloat(kh.deger2)
                    //                 totalMeyveKatsayi = parseFloat(totalMeyveKatsayi) + parseFloat(kh.katsayi1)
                    //             }

                    //             if (kh.birim2 === "Yağ") {
                    //                 totalYag = parseFloat(totalYag) + parseFloat(kh.deger2)
                    //                 totalYagKatsayi = parseFloat(totalYagKatsayi) + parseFloat(kh.katsayi1)
                    //             }

                    //             if (kh.birim2 === "EYP") {
                    //                 totalEYP = parseFloat(totalEYP) + parseFloat(kh.deger2)
                    //                 totalEYPKatsayi = parseFloat(totalEYPKatsayi) + parseFloat(kh.katsayi1)
                    //             }

                    //             if (kh.birim2 === "Sebze") {
                    //                 totalSebze + parseFloat(kh.deger2)
                    //                 totalSebzeKatsayi = parseFloat(totalSebzeKatsayi) + parseFloat(kh.katsayi1)
                    //             }

                    //             //BIRIM 2 SON

                    //             if (kh.birim3 === "Süt") {
                    //                 totalSut = parseFloat(totalSut) + parseFloat(kh.deger3)
                    //                 totalSutKatsayi = parseFloat(totalSutKatsayi) + parseFloat(kh.katsayi1)
                    //             }

                    //             if (kh.birim3 === "Ekmek") {
                    //                 totalEkmek = parseFloat(totalEkmek) + parseFloat(kh.deger3)
                    //                 totalEkmekKatsayi = parseFloat(totalEkmekKatsayi) + parseFloat(kh.katsayi1)
                    //             }

                    //             if (kh.birim3 === "Meyve") {
                    //                 totalMeyve = parseFloat(totalMeyve) + parseFloat(kh.deger3)
                    //                 totalMeyveKatsayi = parseFloat(totalMeyveKatsayi) + parseFloat(kh.katsayi1)
                    //             }

                    //             if (kh.birim3 === "Yağ") {
                    //                 totalYag = parseFloat(totalYag) + parseFloat(kh.deger3)
                    //                 totalYagKatsayi = parseFloat(totalYagKatsayi) + parseFloat(kh.katsayi1)
                    //             }

                    //             if (kh.birim3 === "EYP") {
                    //                 totalEYP = parseFloat(totalEYP) + parseFloat(kh.deger3)
                    //                 totalEYPKatsayi = parseFloat(totalEYPKatsayi) + parseFloat(kh.katsayi1)
                    //             }

                    //             if (kh.birim3 === "Sebze") {
                    //                 totalSebze + parseFloat(kh.deger3)
                    //                 totalSebzeKatsayi = parseFloat(totalSebzeKatsayi) + parseFloat(kh.katsayi1)
                    //             }

                    //             //BIRIM 3 SON

                    //             aksamSutList.push(kh);

                    //         }
                    //     }

                    //     if ((kh.birim1 === "Ekmek" || kh.birim2 === "Ekmek" || kh.birim3 === "Ekmek") && (kh.notfor !== undefined && kh.notfor !== healthProblems)) {
                    //         if (totalEkmek !== 7) {
                    //             if (kh.birim1 === "Süt") {
                    //                 totalSut = parseFloat(totalSut) + parseFloat(kh.deger1)
                    //                 totalSutKatsayi = parseFloat(totalSutKatsayi) + parseFloat(kh.katsayi1)
                    //             }

                    //             if (kh.birim1 === "Ekmek") {
                    //                 totalEkmek = parseFloat(totalEkmek) + parseFloat(kh.deger1)
                    //                 totalEkmekKatsayi = parseFloat(totalEkmekKatsayi) + parseFloat(kh.katsayi1)
                    //             }

                    //             if (kh.birim1 === "Meyve") {
                    //                 totalMeyve = parseFloat(totalMeyve) + parseFloat(kh.deger1)
                    //                 totalMeyveKatsayi = parseFloat(totalMeyveKatsayi) + parseFloat(kh.katsayi1)
                    //             }

                    //             if (kh.birim1 === "Yağ") {
                    //                 totalYag = parseFloat(totalYag) + parseFloat(kh.deger1)
                    //                 totalYagKatsayi = parseFloat(totalYagKatsayi) + parseFloat(kh.katsayi1)
                    //             }

                    //             if (kh.birim1 === "EYP") {
                    //                 totalEYP = parseFloat(totalEYP) + parseFloat(kh.deger1)
                    //                 totalEYPKatsayi = parseFloat(totalEYPKatsayi) + parseFloat(kh.katsayi1)
                    //             }

                    //             if (kh.birim1 === "Sebze") {
                    //                 totalSebze + parseFloat(kh.deger1)
                    //                 totalSebzeKatsayi = parseFloat(totalSebzeKatsayi) + parseFloat(kh.katsayi1)
                    //             }

                    //             //BIRIM 1 SON

                    //             if (kh.birim2 === "Süt") {
                    //                 totalSut = parseFloat(totalSut) + parseFloat(kh.deger2)
                    //                 totalSutKatsayi = parseFloat(totalSutKatsayi) + parseFloat(kh.katsayi1)
                    //             }

                    //             if (kh.birim2 === "Ekmek") {
                    //                 totalEkmek = parseFloat(totalEkmek) + parseFloat(kh.deger2)
                    //                 totalEkmekKatsayi = parseFloat(totalEkmekKatsayi) + parseFloat(kh.katsayi1)
                    //             }

                    //             if (kh.birim2 === "Meyve") {
                    //                 totalMeyve = parseFloat(totalMeyve) + parseFloat(kh.deger2)
                    //                 totalMeyveKatsayi = parseFloat(totalMeyveKatsayi) + parseFloat(kh.katsayi1)
                    //             }

                    //             if (kh.birim2 === "Yağ") {
                    //                 totalYag = parseFloat(totalYag) + parseFloat(kh.deger2)
                    //                 totalYagKatsayi = parseFloat(totalYagKatsayi) + parseFloat(kh.katsayi1)
                    //             }

                    //             if (kh.birim2 === "EYP") {
                    //                 totalEYP = parseFloat(totalEYP) + parseFloat(kh.deger2)
                    //                 totalEYPKatsayi = parseFloat(totalEYPKatsayi) + parseFloat(kh.katsayi1)
                    //             }

                    //             if (kh.birim2 === "Sebze") {
                    //                 totalSebze + parseFloat(kh.deger2)
                    //                 totalSebzeKatsayi = parseFloat(totalSebzeKatsayi) + parseFloat(kh.katsayi1)
                    //             }

                    //             //BIRIM 2 SON

                    //             if (kh.birim3 === "Süt") {
                    //                 totalSut = parseFloat(totalSut) + parseFloat(kh.deger3)
                    //                 totalSutKatsayi = parseFloat(totalSutKatsayi) + parseFloat(kh.katsayi1)
                    //             }

                    //             if (kh.birim3 === "Ekmek") {
                    //                 totalEkmek = parseFloat(totalEkmek) + parseFloat(kh.deger3)
                    //                 totalEkmekKatsayi = parseFloat(totalEkmekKatsayi) + parseFloat(kh.katsayi1)
                    //             }

                    //             if (kh.birim3 === "Meyve") {
                    //                 totalMeyve = parseFloat(totalMeyve) + parseFloat(kh.deger3)
                    //                 totalMeyveKatsayi = parseFloat(totalMeyveKatsayi) + parseFloat(kh.katsayi1)
                    //             }

                    //             if (kh.birim3 === "Yağ") {
                    //                 totalYag = parseFloat(totalYag) + parseFloat(kh.deger3)
                    //                 totalYagKatsayi = parseFloat(totalYagKatsayi) + parseFloat(kh.katsayi1)
                    //             }

                    //             if (kh.birim3 === "EYP") {
                    //                 totalEYP = parseFloat(totalEYP) + parseFloat(kh.deger3)
                    //                 totalEYPKatsayi = parseFloat(totalEYPKatsayi) + parseFloat(kh.katsayi1)
                    //             }

                    //             if (kh.birim3 === "Sebze") {
                    //                 totalSebze + parseFloat(kh.deger3)
                    //                 totalSebzeKatsayi = parseFloat(totalSebzeKatsayi) + parseFloat(kh.katsayi1)
                    //             }

                    //             aksamEkmekList.push(kh);
                    //         }

                    //     }

                    //     if ((kh.birim1 === "Yağ" || kh.birim2 === "Yağ" || kh.birim3 === "Yağ") && (kh.notfor !== undefined && kh.notfor !== healthProblems)) {
                    //         if (totalYag !== 5) {
                    //             if (kh.birim1 === "Süt") {
                    //                 totalSut = parseFloat(totalSut) + parseFloat(kh.deger1)
                    //                 totalSutKatsayi = parseFloat(totalSutKatsayi) + parseFloat(kh.katsayi1)
                    //             }

                    //             if (kh.birim1 === "Ekmek") {
                    //                 totalEkmek = parseFloat(totalEkmek) + parseFloat(kh.deger1)
                    //                 totalEkmekKatsayi = parseFloat(totalEkmekKatsayi) + parseFloat(kh.katsayi1)
                    //             }

                    //             if (kh.birim1 === "Meyve") {
                    //                 totalMeyve = parseFloat(totalMeyve) + parseFloat(kh.deger1)
                    //                 totalMeyveKatsayi = parseFloat(totalMeyveKatsayi) + parseFloat(kh.katsayi1)
                    //             }

                    //             if (kh.birim1 === "Yağ") {
                    //                 totalYag = parseFloat(totalYag) + parseFloat(kh.deger1)
                    //                 totalYagKatsayi = parseFloat(totalYagKatsayi) + parseFloat(kh.katsayi1)
                    //             }

                    //             if (kh.birim1 === "EYP") {
                    //                 totalEYP = parseFloat(totalEYP) + parseFloat(kh.deger1)
                    //                 totalEYPKatsayi = parseFloat(totalEYPKatsayi) + parseFloat(kh.katsayi1)
                    //             }

                    //             if (kh.birim1 === "Sebze") {
                    //                 totalSebze + parseFloat(kh.deger1)
                    //                 totalSebzeKatsayi = parseFloat(totalSebzeKatsayi) + parseFloat(kh.katsayi1)
                    //             }

                    //             //BIRIM 1 SON

                    //             if (kh.birim2 === "Süt") {
                    //                 totalSut = parseFloat(totalSut) + parseFloat(kh.deger2)
                    //                 totalSutKatsayi = parseFloat(totalSutKatsayi) + parseFloat(kh.katsayi1)
                    //             }

                    //             if (kh.birim2 === "Ekmek") {
                    //                 totalEkmek = parseFloat(totalEkmek) + parseFloat(kh.deger2)
                    //                 totalEkmekKatsayi = parseFloat(totalEkmekKatsayi) + parseFloat(kh.katsayi1)
                    //             }

                    //             if (kh.birim2 === "Meyve") {
                    //                 totalMeyve = parseFloat(totalMeyve) + parseFloat(kh.deger2)
                    //                 totalMeyveKatsayi = parseFloat(totalMeyveKatsayi) + parseFloat(kh.katsayi1)
                    //             }

                    //             if (kh.birim2 === "Yağ") {
                    //                 totalYag = parseFloat(totalYag) + parseFloat(kh.deger2)
                    //                 totalYagKatsayi = parseFloat(totalYagKatsayi) + parseFloat(kh.katsayi1)
                    //             }

                    //             if (kh.birim2 === "EYP") {
                    //                 totalEYP = parseFloat(totalEYP) + parseFloat(kh.deger2)
                    //                 totalEYPKatsayi = parseFloat(totalEYPKatsayi) + parseFloat(kh.katsayi1)
                    //             }

                    //             if (kh.birim2 === "Sebze") {
                    //                 totalSebze + parseFloat(kh.deger2)
                    //                 totalSebzeKatsayi = parseFloat(totalSebzeKatsayi) + parseFloat(kh.katsayi1)
                    //             }

                    //             //BIRIM 2 SON

                    //             if (kh.birim3 === "Süt") {
                    //                 totalSut = parseFloat(totalSut) + parseFloat(kh.deger3)
                    //                 totalSutKatsayi = parseFloat(totalSutKatsayi) + parseFloat(kh.katsayi1)
                    //             }

                    //             if (kh.birim3 === "Ekmek") {
                    //                 totalEkmek = parseFloat(totalEkmek) + parseFloat(kh.deger3)
                    //                 totalEkmekKatsayi = parseFloat(totalEkmekKatsayi) + parseFloat(kh.katsayi1)
                    //             }

                    //             if (kh.birim3 === "Meyve") {
                    //                 totalMeyve = parseFloat(totalMeyve) + parseFloat(kh.deger3)
                    //                 totalMeyveKatsayi = parseFloat(totalMeyveKatsayi) + parseFloat(kh.katsayi1)
                    //             }

                    //             if (kh.birim3 === "Yağ") {
                    //                 totalYag = parseFloat(totalYag) + parseFloat(kh.deger3)
                    //                 totalYagKatsayi = parseFloat(totalYagKatsayi) + parseFloat(kh.katsayi1)
                    //             }

                    //             if (kh.birim3 === "EYP") {
                    //                 totalEYP = parseFloat(totalEYP) + parseFloat(kh.deger3)
                    //                 totalEYPKatsayi = parseFloat(totalEYPKatsayi) + parseFloat(kh.katsayi1)
                    //             }

                    //             if (kh.birim3 === "Sebze") {
                    //                 totalSebze + parseFloat(kh.deger3)
                    //                 totalSebzeKatsayi = parseFloat(totalSebzeKatsayi) + parseFloat(kh.katsayi1)
                    //             }

                    //             aksamYagList.push(kh);
                    //         }
                    //     }

                    //     if ((kh.birim1 === "EYP" || kh.birim2 === "EYP" || kh.birim3 === "EYP") && (kh.notfor !== undefined && kh.notfor !== healthProblems)) {
                    //         if (totalEYP !== 9) {
                    //             if (kh.birim1 === "Süt") {
                    //                 totalSut = parseFloat(totalSut) + parseFloat(kh.deger1)
                    //                 totalSutKatsayi = parseFloat(totalSutKatsayi) + parseFloat(kh.katsayi1)
                    //             }

                    //             if (kh.birim1 === "Ekmek") {
                    //                 totalEkmek = parseFloat(totalEkmek) + parseFloat(kh.deger1)
                    //                 totalEkmekKatsayi = parseFloat(totalEkmekKatsayi) + parseFloat(kh.katsayi1)
                    //             }

                    //             if (kh.birim1 === "Meyve") {
                    //                 totalMeyve = parseFloat(totalMeyve) + parseFloat(kh.deger1)
                    //                 totalMeyveKatsayi = parseFloat(totalMeyveKatsayi) + parseFloat(kh.katsayi1)
                    //             }

                    //             if (kh.birim1 === "Yağ") {
                    //                 totalYag = parseFloat(totalYag) + parseFloat(kh.deger1)
                    //                 totalYagKatsayi = parseFloat(totalYagKatsayi) + parseFloat(kh.katsayi1)
                    //             }

                    //             if (kh.birim1 === "EYP") {
                    //                 totalEYP = parseFloat(totalEYP) + parseFloat(kh.deger1)
                    //                 totalEYPKatsayi = parseFloat(totalEYPKatsayi) + parseFloat(kh.katsayi1)
                    //             }

                    //             if (kh.birim1 === "Sebze") {
                    //                 totalSebze + parseFloat(kh.deger1)
                    //                 totalSebzeKatsayi = parseFloat(totalSebzeKatsayi) + parseFloat(kh.katsayi1)
                    //             }

                    //             //BIRIM 1 SON

                    //             if (kh.birim2 === "Süt") {
                    //                 totalSut = parseFloat(totalSut) + parseFloat(kh.deger2)
                    //                 totalSutKatsayi = parseFloat(totalSutKatsayi) + parseFloat(kh.katsayi1)
                    //             }

                    //             if (kh.birim2 === "Ekmek") {
                    //                 totalEkmek = parseFloat(totalEkmek) + parseFloat(kh.deger2)
                    //                 totalEkmekKatsayi = parseFloat(totalEkmekKatsayi) + parseFloat(kh.katsayi1)
                    //             }

                    //             if (kh.birim2 === "Meyve") {
                    //                 totalMeyve = parseFloat(totalMeyve) + parseFloat(kh.deger2)
                    //                 totalMeyveKatsayi = parseFloat(totalMeyveKatsayi) + parseFloat(kh.katsayi1)
                    //             }

                    //             if (kh.birim2 === "Yağ") {
                    //                 totalYag = parseFloat(totalYag) + parseFloat(kh.deger2)
                    //                 totalYagKatsayi = parseFloat(totalYagKatsayi) + parseFloat(kh.katsayi1)
                    //             }

                    //             if (kh.birim2 === "EYP") {
                    //                 totalEYP = parseFloat(totalEYP) + parseFloat(kh.deger2)
                    //                 totalEYPKatsayi = parseFloat(totalEYPKatsayi) + parseFloat(kh.katsayi1)
                    //             }

                    //             if (kh.birim2 === "Sebze") {
                    //                 totalSebze + parseFloat(kh.deger2)
                    //                 totalSebzeKatsayi = parseFloat(totalSebzeKatsayi) + parseFloat(kh.katsayi1)
                    //             }

                    //             //BIRIM 2 SON

                    //             if (kh.birim3 === "Süt") {
                    //                 totalSut = parseFloat(totalSut) + parseFloat(kh.deger3)
                    //                 totalSutKatsayi = parseFloat(totalSutKatsayi) + parseFloat(kh.katsayi1)
                    //             }

                    //             if (kh.birim3 === "Ekmek") {
                    //                 totalEkmek = parseFloat(totalEkmek) + parseFloat(kh.deger3)
                    //                 totalEkmekKatsayi = parseFloat(totalEkmekKatsayi) + parseFloat(kh.katsayi1)
                    //             }

                    //             if (kh.birim3 === "Meyve") {
                    //                 totalMeyve = parseFloat(totalMeyve) + parseFloat(kh.deger3)
                    //                 totalMeyveKatsayi = parseFloat(totalMeyveKatsayi) + parseFloat(kh.katsayi1)
                    //             }

                    //             if (kh.birim3 === "Yağ") {
                    //                 totalYag = parseFloat(totalYag) + parseFloat(kh.deger3)
                    //                 totalYagKatsayi = parseFloat(totalYagKatsayi) + parseFloat(kh.katsayi1)
                    //             }

                    //             if (kh.birim3 === "EYP") {
                    //                 totalEYP = parseFloat(totalEYP) + parseFloat(kh.deger3)
                    //                 totalEYPKatsayi = parseFloat(totalEYPKatsayi) + parseFloat(kh.katsayi1)
                    //             }

                    //             if (kh.birim3 === "Sebze") {
                    //                 totalSebze + parseFloat(kh.deger3)
                    //                 totalSebzeKatsayi = parseFloat(totalSebzeKatsayi) + parseFloat(kh.katsayi1)
                    //             }

                    //             aksamEYPList.push(kh);
                    //         }

                    //     }

                    //     if ((kh.birim1 === "Sebze" || kh.birim2 === "Sebze" || kh.birim3 === "Sebze") && (kh.notfor !== undefined && kh.notfor !== healthProblems)) {
                    //         if (totalSebze !== 3) {
                    //             if (kh.birim1 === "Süt") {
                    //                 totalSut = parseFloat(totalSut) + parseFloat(kh.deger1)
                    //                 totalSutKatsayi = parseFloat(totalSutKatsayi) + parseFloat(kh.katsayi1)
                    //             }

                    //             if (kh.birim1 === "Ekmek") {
                    //                 totalEkmek = parseFloat(totalEkmek) + parseFloat(kh.deger1)
                    //                 totalEkmekKatsayi = parseFloat(totalEkmekKatsayi) + parseFloat(kh.katsayi1)
                    //             }

                    //             if (kh.birim1 === "Meyve") {
                    //                 totalMeyve = parseFloat(totalMeyve) + parseFloat(kh.deger1)
                    //                 totalMeyveKatsayi = parseFloat(totalMeyveKatsayi) + parseFloat(kh.katsayi1)
                    //             }

                    //             if (kh.birim1 === "Yağ") {
                    //                 totalYag = parseFloat(totalYag) + parseFloat(kh.deger1)
                    //                 totalYagKatsayi = parseFloat(totalYagKatsayi) + parseFloat(kh.katsayi1)
                    //             }

                    //             if (kh.birim1 === "EYP") {
                    //                 totalEYP = parseFloat(totalEYP) + parseFloat(kh.deger1)
                    //                 totalEYPKatsayi = parseFloat(totalEYPKatsayi) + parseFloat(kh.katsayi1)
                    //             }

                    //             if (kh.birim1 === "Sebze") {
                    //                 totalSebze + parseFloat(kh.deger1)
                    //                 totalSebzeKatsayi = parseFloat(totalSebzeKatsayi) + parseFloat(kh.katsayi1)
                    //             }

                    //             //BIRIM 1 SON

                    //             if (kh.birim2 === "Süt") {
                    //                 totalSut = parseFloat(totalSut) + parseFloat(kh.deger2)
                    //                 totalSutKatsayi = parseFloat(totalSutKatsayi) + parseFloat(kh.katsayi1)
                    //             }

                    //             if (kh.birim2 === "Ekmek") {
                    //                 totalEkmek = parseFloat(totalEkmek) + parseFloat(kh.deger2)
                    //                 totalEkmekKatsayi = parseFloat(totalEkmekKatsayi) + parseFloat(kh.katsayi1)
                    //             }

                    //             if (kh.birim2 === "Meyve") {
                    //                 totalMeyve = parseFloat(totalMeyve) + parseFloat(kh.deger2)
                    //                 totalMeyveKatsayi = parseFloat(totalMeyveKatsayi) + parseFloat(kh.katsayi1)
                    //             }

                    //             if (kh.birim2 === "Yağ") {
                    //                 totalYag = parseFloat(totalYag) + parseFloat(kh.deger2)
                    //                 totalYagKatsayi = parseFloat(totalYagKatsayi) + parseFloat(kh.katsayi1)
                    //             }

                    //             if (kh.birim2 === "EYP") {
                    //                 totalEYP = parseFloat(totalEYP) + parseFloat(kh.deger2)
                    //                 totalEYPKatsayi = parseFloat(totalEYPKatsayi) + parseFloat(kh.katsayi1)
                    //             }

                    //             if (kh.birim2 === "Sebze") {
                    //                 totalSebze + parseFloat(kh.deger2)
                    //                 totalSebzeKatsayi = parseFloat(totalSebzeKatsayi) + parseFloat(kh.katsayi1)
                    //             }

                    //             //BIRIM 2 SON

                    //             if (kh.birim3 === "Süt") {
                    //                 totalSut = parseFloat(totalSut) + parseFloat(kh.deger3)
                    //                 totalSutKatsayi = parseFloat(totalSutKatsayi) + parseFloat(kh.katsayi1)
                    //             }

                    //             if (kh.birim3 === "Ekmek") {
                    //                 totalEkmek = parseFloat(totalEkmek) + parseFloat(kh.deger3)
                    //                 totalEkmekKatsayi = parseFloat(totalEkmekKatsayi) + parseFloat(kh.katsayi1)
                    //             }

                    //             if (kh.birim3 === "Meyve") {
                    //                 totalMeyve = parseFloat(totalMeyve) + parseFloat(kh.deger3)
                    //                 totalMeyveKatsayi = parseFloat(totalMeyveKatsayi) + parseFloat(kh.katsayi1)
                    //             }

                    //             if (kh.birim3 === "Yağ") {
                    //                 totalYag = parseFloat(totalYag) + parseFloat(kh.deger3)
                    //                 totalYagKatsayi = parseFloat(totalYagKatsayi) + parseFloat(kh.katsayi1)
                    //             }

                    //             if (kh.birim3 === "EYP") {
                    //                 totalEYP = parseFloat(totalEYP) + parseFloat(kh.deger3)
                    //                 totalEYPKatsayi = parseFloat(totalEYPKatsayi) + parseFloat(kh.katsayi1)
                    //             }

                    //             if (kh.birim3 === "Sebze") {
                    //                 totalSebze + parseFloat(kh.deger3)
                    //                 totalSebzeKatsayi = parseFloat(totalSebzeKatsayi) + parseFloat(kh.katsayi1)
                    //             }

                    //             aksamSebzeList.push(kh);
                    //         }

                    //     }
                    // })

                }


                kahvaltiNewList = [...kahvaltiSutList, ...kahvaltiEkmekList, ...kahvaltiMeyveList, ...kahvaltiYagList]
                setKahvaltiList(kahvaltiNewList);


                console.log('kahvaltiNewList: ', kahvaltiNewList)
                ogleNewList = [...ogleEYPList, ...ogleSebzeList, ...ogleYagList, ...ogleEkmekList]
                setOgleList(ogleNewList);

                aksamNewList = [...aksamEYPList, ...aksamSebzeList, ...aksamSutList, ...aksamYagList, ...aksamEkmekList]
                setAksamList(aksamNewList);

                // setSaveLoading(true);

                // database2.ref('users/' + profileData.userId + '/workouts').push({
                //     date: moment().format('DD/MM/YYYY'),
                //     completed: false,
                //     moves: newList
                // })
                //     .then((response) => {
                //         database2.ref(response.path).once('value')
                //             .then((res) => {
                //                 getVideo(res.val().moves);
                //                 setWorkoutKey(res.key);
                //                 setSaveLoading(false);
                //             })
                //             .catch((err) => {
                //                 setSaveLoading(false);
                //                 setLoading(false);
                //                 setRefreshing(false);
                //             })
                //     })
                //     .catch((err) => {
                //         setSaveLoading(false);
                //         setLoading(false);
                //         setRefreshing(false);
                //     })
            })
            .catch((err) => {
                setSaveLoading(false);
                setLoading(false);
                setRefreshing(false);
            })
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
                    } else if (VideoList.length === 0) {
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

    return (
        <ImageBackground style={{ height: height, width: width }} resizeMode="cover" source={require('../../img/bg.jpg')}>
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="light-content" />
                <SpinnerLoading Loading={Loading} />
                <Sidebar navigation={navigation} opened={ShowSideModal} onClose={() => closeModal()} />

                <Modal style={{ marginTop: 'auto' }}
                    animationIn="fadeIn"
                    animationOut="fadeOut"
                    isVisible={ShowPopup}
                    animationInTiming={500}
                    animationOutTiming={500}
                    backdropOpacity={0.7}
                >
                    <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#000', borderColor: '#FFF', borderWidth: 2, padding: 20, borderRadius: 20 }}>
                        <View style={{ paddingVertical: 5, flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={styles.popupText}>Karbonhidrat:</Text>
                            <Text style={styles.popupText}>{SelectedFood.karbonhidrat !== undefined ? SelectedFood.karbonhidrat : 0}</Text>
                        </View>

                        <View style={{ paddingVertical: 5, flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={styles.popupText}>Protein:</Text>
                            <Text style={styles.popupText}>{SelectedFood.protein !== undefined ? SelectedFood.protein : 0}</Text>
                        </View>

                        <View style={{ paddingVertical: 5, flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={styles.popupText}>Yağ:</Text>
                            <Text style={styles.popupText}>{SelectedFood.yag !== undefined ? SelectedFood.yag : 0}</Text>
                        </View>

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

                        <TouchableHighlight onPress={() => navigation.navigate('FeedList')}>
                            <Icon name="comment" color="#FFF" size={28} style={{ marginRight: 20 }} />
                        </TouchableHighlight>

                        <TouchableHighlight onPress={() => navigation.navigate('Settings')}>
                            <Icon name="settings" color="#FFF" size={28} />
                        </TouchableHighlight>

                    </View>
                </View>

                <ScrollView
                    refreshControl={
                        <RefreshControl
                            tintColor="#fff"
                            titleColor="#fff"
                            refreshing={Refreshing}
                            onRefresh={() => {
                                setRefreshing(true);
                                getMyWorkouts();
                            }}
                        />
                    }
                    style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%', paddingHorizontal: 30, marginTop: 20 }}>
                        <View style={{ width: '50%', justifyContent: 'center', alignItems: 'baseline' }}>

                            <View style={{ width: 130, justifyContent: 'center', alignItems: 'center' }}>
                                <AnimatedCircularProgress
                                    size={120}
                                    width={4}
                                    rotation={90}
                                    fill={parseFloat(CaloriesChart).toFixed(1)}
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
                            <Text style={styles.targetHeader}>Gerekli Kalori: {parseFloat(Calories).toFixed(0)} / {String(profileData.targets?.calorie !== undefined ? profileData.targets.calorie : 0)}</Text>
                            <TouchableOpacity onPress={() => Alert.alert('Su Ekle', 'Ekran bekleniyor.')} style={{ marginTop: 10, padding: 10, borderRadius: 12, justifyContent: 'center', alignItems: 'center', backgroundColor: 'blue' }}>
                                <Text style={[styles.targetHeader, { fontSize: 17 }]}>Su Ekle</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={{ width: '100%', paddingHorizontal: 10 }}>
                        {!Loading &&
                            <CalendarStrip
                                scrollable={false}
                                // datesBlacklist={datesBlacklist}
                                // selectedDate={SelectedDate}
                                onDateSelected={(val) => getSelectedDay(val)}
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
                                // markedDates={markedDatesArray}
                                iconRight={null}
                                iconLeft={null}
                            />
                        }
                    </View>

                    <TouchableOpacity style={{
                        height: 100,
                        width: '100%',
                        paddingHorizontal: 20,
                        borderRadius: 18,
                        marginTop: 10,
                        marginBottom: 10,
                        paddingHorizontal: 20
                    }}>
                        <Image
                            resizeMode="cover"
                            source={{ uri: 'https://sportfood54.com/wp-content/uploads/2017/01/about-img1.jpg' }}
                            style={{
                                width: '100%',
                                height: 100,
                                borderRadius: 18
                            }}
                        />
                        <View style={{ position: 'absolute', top: 15, paddingHorizontal: 30 }}>
                            <Text style={{
                                fontFamily: 'SFProDisplay-Medium',
                                fontSize: 14,
                                color: '#FFF',
                            }}>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo.</Text>
                        </View>

                    </TouchableOpacity>

                    {!Loading && KahvaltiList.length !== 0 &&
                        <>
                            <FlatList style={{ height: 'auto', paddingHorizontal: 20, marginBottom: 20, marginTop: 10 }}
                                scrollEnabled={true}
                                data={KahvaltiList}
                                keyExtractor={(item, index) => index.toString()}
                                ListHeaderComponent={() => {
                                    return (
                                        <View style={{ flexDirection: 'row', borderTopLeftRadius: 12, borderTopRightRadius: 12, paddingHorizontal: 20, paddingVertical: 15, backgroundColor: '#FFF', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                                            <Text style={styles.foodHeader}>Kahvaltı</Text>
                                            <Icon onPress={() => Alert.alert('Öğün favorilere eklendi.')} name="favorite-outline" size={20} color="#2D2D2D" />
                                        </View>
                                    )
                                }}
                                renderItem={(food) => {
                                    var item = food.item;
                                    return (item &&
                                        <View style={{
                                            backgroundColor: '#FFF',
                                            padding: 10,
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            height: 'auto',
                                            width: '100%'
                                        }}>
                                            <View style={{ width: '70%', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                <Text style={styles.foodName}>{item.name}</Text>
                                                {item.note !== "" && item.note !== undefined &&
                                                    <Text style={[styles.foodName, { color: '#4D4D4D', fontSize: 14, marginTop: 5 }]}>{item.note}</Text>
                                                }
                                            </View>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Icon onPress={() => {
                                                    setSelectedFood(item);
                                                    setTimeout(() => {
                                                        setShowPopup(!ShowPopup)
                                                    }, 200);
                                                }} name="info-outline" size={20} color="#2D2D2D" />
                                                <Icon style={{ marginLeft: 10 }} onPress={() => Alert.alert('Besin değiştirilsin mi?', [
                                                    { text: 'Değiştir', onPress: () => null, style: 'default' },
                                                    { text: 'Vazgeç', onPress: () => null, style: 'cancel' }
                                                ])} name="replay" size={20} color="#2D2D2D" />
                                                <Icon style={{ marginLeft: 10 }} onPress={() => Alert.alert('Besin Tamamlandı')} name="check" size={20} color="#2D2D2D" />
                                            </View>
                                        </View>
                                    )
                                }}
                            />
                        </>
                    }

                    {!Loading && OgleList.length !== 0 &&
                        <>
                            <FlatList style={{ height: 'auto', paddingHorizontal: 20, marginBottom: 20 }}
                                scrollEnabled={true}
                                data={OgleList}
                                keyExtractor={(item, index) => index.toString()}
                                ListHeaderComponent={() => {
                                    return (
                                        <View style={{ flexDirection: 'row', borderTopLeftRadius: 12, borderTopRightRadius: 12, paddingHorizontal: 20, paddingVertical: 15, backgroundColor: '#FFF', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                                            <Text style={styles.foodHeader}>Öğle Yemeği</Text>
                                            <Icon onPress={() => Alert.alert('Öğün favorilere eklendi.')} name="favorite-outline" size={20} color="#2D2D2D" />
                                        </View>
                                    )
                                }}
                                renderItem={(food) => {
                                    var item = food.item;
                                    return (item &&
                                        <View style={{
                                            backgroundColor: '#FFF',
                                            padding: 10,
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            height: 'auto',
                                            width: '100%'
                                        }}>
                                            <View style={{ width: '70%', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                <Text style={styles.foodName}>{item.name}</Text>
                                                {item.note !== "" && item.note !== undefined &&
                                                    <Text style={[styles.foodName, { color: '#4D4D4D', fontSize: 14, marginTop: 5 }]}>{item.note}</Text>
                                                }
                                            </View>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Icon onPress={() => {
                                                    setSelectedFood(item);
                                                    setTimeout(() => {
                                                        setShowPopup(!ShowPopup)
                                                    }, 200);
                                                }} name="info-outline" size={20} color="#2D2D2D" />
                                                <Icon style={{ marginLeft: 10 }} onPress={() => Alert.alert('Besin değiştirilsin mi?', [
                                                    { text: 'Değiştir', onPress: () => null, style: 'default' },
                                                    { text: 'Vazgeç', onPress: () => null, style: 'cancel' }
                                                ])} name="replay" size={20} color="#2D2D2D" />
                                                <Icon style={{ marginLeft: 10 }} onPress={() => Alert.alert('Besin Tamamlandı')} name="check" size={20} color="#2D2D2D" />
                                            </View>
                                        </View>
                                    )
                                }}
                            />
                        </>
                    }

                    {!Loading && AksamList.length !== 0 &&
                        <>
                            <FlatList style={{ height: 'auto', paddingHorizontal: 20, marginBottom: 100 }}
                                scrollEnabled={true}
                                data={AksamList}
                                keyExtractor={(item, index) => index.toString()}
                                ListHeaderComponent={() => {
                                    return (
                                        <View style={{ flexDirection: 'row', borderTopLeftRadius: 12, borderTopRightRadius: 12, paddingHorizontal: 20, paddingVertical: 15, backgroundColor: '#FFF', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                                            <Text style={styles.foodHeader}>Akşam Yemeği</Text>
                                            <Icon onPress={() => Alert.alert('Öğün favorilere eklendi.')} name="favorite-outline" size={20} color="#2D2D2D" />
                                        </View>
                                    )
                                }}
                                renderItem={(food) => {
                                    var item = food.item;
                                    return (item &&
                                        <View style={{
                                            backgroundColor: '#FFF',
                                            padding: 10,
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            height: 'auto',
                                            width: '100%'
                                        }}>
                                            <View style={{ width: '70%', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                <Text style={styles.foodName}>{item.name}</Text>
                                                {item.note !== "" && item.note !== undefined &&
                                                    <Text style={[styles.foodName, { color: '#4D4D4D', fontSize: 14, marginTop: 5 }]}>{item.note}</Text>
                                                }
                                            </View>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Icon onPress={() => {
                                                    setSelectedFood(item);
                                                    setTimeout(() => {
                                                        setShowPopup(!ShowPopup)
                                                    }, 200);
                                                }} name="info-outline" size={20} color="#2D2D2D" />
                                                <Icon style={{ marginLeft: 10 }} onPress={() => Alert.alert('Besin değiştirilsin mi?', [
                                                    { text: 'Değiştir', onPress: () => null, style: 'default' },
                                                    { text: 'Vazgeç', onPress: () => null, style: 'cancel' }
                                                ])} name="replay" size={20} color="#2D2D2D" />
                                                <Icon style={{ marginLeft: 10 }} onPress={() => Alert.alert('Besin Tamamlandı')} name="check" size={20} color="#2D2D2D" />
                                            </View>
                                        </View>
                                    )
                                }}
                            />
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
    popupText: {
        fontFamily: 'SFProDisplay-Medium',
        fontSize: 18,
        color: 'yellow',
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
        color: '#2D2D2D',
        width: '100%'
    },
    foodName: {
        fontFamily: 'SFProDisplay-Medium',
        fontSize: 16,
        color: '#2D2D2D'
    }
})
export default Food;