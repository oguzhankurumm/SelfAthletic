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

        database2.ref('foods').once('value')
            .then((snapshot) => {
                let allList = [];

                snapshot.forEach((item) => {
                    var newitem = item.val();

                    var besinSut = 0;
                    var besinEkmek = 0;
                    var besinMeyve = 0;
                    var besinYag = 0;
                    var besinEYP = 0;
                    var besinSebze = 0;

                    if (newitem.birim1 !== undefined || newitem.birim2 !== undefined || newitem.birim3 !== undefined) {

                        if (newitem.birim1 === "Süt") {
                            besinSut = parseFloat(besinSut) + parseFloat(newitem.deger1);
                        } else if (newitem.birim2 === "Süt") {
                            besinSut = parseFloat(besinSut) + parseFloat(newitem.deger1);
                        } else if (newitem.birim3 === "Süt") {
                            besinSut = parseFloat(besinSut) + parseFloat(newitem.deger1);
                        }

                        if (newitem.birim1 === "Ekmek") {
                            besinEkmek = parseFloat(besinEkmek) + parseFloat(newitem.deger1);
                        } else if (newitem.birim2 === "Ekmek") {
                            besinEkmek = parseFloat(besinEkmek) + parseFloat(newitem.deger1);
                        } else if (newitem.birim3 === "Ekmek") {
                            besinEkmek = parseFloat(besinEkmek) + parseFloat(newitem.deger1);
                        }

                        if (newitem.birim1 === "Meyve") {
                            besinMeyve = parseFloat(besinMeyve) + parseFloat(newitem.deger1);
                        } else if (newitem.birim2 === "Meyve") {
                            besinMeyve = parseFloat(besinMeyve) + parseFloat(newitem.deger1);
                        } else if (newitem.birim3 === "Meyve") {
                            besinMeyve = parseFloat(besinMeyve) + parseFloat(newitem.deger1);
                        }

                        if (newitem.birim1 === "Yağ") {
                            besinYag = parseFloat(besinYag) + parseFloat(newitem.deger1);
                        } else if (newitem.birim2 === "Yağ") {
                            besinYag = parseFloat(besinYag) + parseFloat(newitem.deger1);
                        } else if (newitem.birim3 === "Yağ") {
                            besinYag = parseFloat(besinYag) + parseFloat(newitem.deger1);
                        }

                        if (newitem.birim1 === "EYP") {
                            besinEYP = parseFloat(besinEYP) + parseFloat(newitem.deger1);
                        } else if (newitem.birim2 === "EYP") {
                            besinEYP = parseFloat(besinEYP) + parseFloat(newitem.deger1);
                        } else if (newitem.birim3 === "EYP") {
                            besinEYP = parseFloat(besinEYP) + parseFloat(newitem.deger1);
                        }

                        if (newitem.birim1 === "Sebze") {
                            besinSebze = parseFloat(besinSebze) + parseFloat(newitem.deger1);
                        } else if (newitem.birim2 === "Sebze") {
                            besinSebze = parseFloat(besinSebze) + parseFloat(newitem.deger1);
                        } else if (newitem.birim3 === "Sebze") {
                            besinSebze = parseFloat(besinSebze) + parseFloat(newitem.deger1);
                        }


                        var newBesin = {
                            ...item.val(),
                            id: item.key,
                            besinSut: besinSut,
                            besinEkmek: besinEkmek,
                            besinMeyve: besinMeyve,
                            besinYag: besinYag,
                            besinEYP: besinEYP,
                            besinSebze: besinSebze
                        }

                        allList.push(newBesin);
                    }

                })


                allList.forEach((item) => {
                    if (Object.values(item.category).indexOf("Kahvalti") > -1) {
                        kahvaltiList.push(item)
                    } else if (Object.values(item.category).indexOf("Ara") > -1) {
                        araList.push(item);
                    } else if (Object.values(item.category).indexOf("Ana") > -1) {
                        aksamList.push(item);
                    }
                })

                var totalSut = 0;
                var totalMeyve = 0;
                var totalSebze = 0;
                var totalEYP = 0;
                var totalYag = 0;
                var totalEkmek = 0;

                var OgletotalSut = 0;
                var OgletotalMeyve = 0;
                var OgletotalSebze = 0;
                var OgletotalEYP = 0;
                var OgletotalYag = 0;
                var OgletotalEkmek = 0;

                if (gunlukEnerji >= 1700 && gunlukEnerji <= 1799 && Target === "Kas Kütlesi Artışı") {
                    totalSut = 1;
                    totalEkmek = 2;
                    totalMeyve = 1;
                    totalSebze = 0;
                    totalYag = 1;
                    totalEYP = 0;

                    OgletotalSut = 1;
                    OgletotalEkmek = 2;
                    OgletotalMeyve = 0;
                    OgletotalSebze = 1;
                    OgletotalYag = 1;
                    OgletotalEYP = 5;

                    Object.values(kahvaltiList).forEach((food) => {
                        if (food.besinSut <= totalSut && food.besinEkmek <= totalEkmek && food.besinMeyve <= totalMeyve && food.besinSebze <= totalSebze && food.besinYag <= totalYag && food.besinEYP <= totalEYP) {

                            kahvaltiNewList.push(food);
                            totalSut -= food.besinSut;
                            totalEkmek -= food.besinEkmek;
                            totalMeyve -= food.besinMeyve;
                            totalSebze -= food.besinSebze;
                            totalYag -= food.besinYag;
                            totalEYP -= food.besinEYP;

                        }
                    })

                    Object.values(aksamList).forEach((food) => {
                        if (food.besinSut <= OgletotalSut && food.besinEkmek <= OgletotalEkmek && food.besinMeyve <= OgletotalMeyve && food.besinSebze <= OgletotalSebze && food.besinYag <= OgletotalYag && food.besinEYP <= OgletotalEYP) {
                            ogleNewList.push(food);
                            OgletotalSut -= food.besinSut;
                            OgletotalEkmek -= food.besinEkmek;
                            OgletotalMeyve -= food.besinMeyve;
                            OgletotalSebze -= food.besinSebze;
                            OgletotalYag -= food.besinYag;
                            OgletotalEYP -= food.besinEYP;
                        }
                    })

                }

                setLoading(false);

                console.log('kahvaltiListtt:', kahvaltiNewList)
                console.log('ogle:', ogleNewList)
                // console.log('aksamList:', aksamList)
                // console.log('allList:', allList)


                setKahvaltiList(kahvaltiNewList);
                setOgleList(ogleNewList);


                // // console.log('kahvaltiNewList: ', kahvaltiNewList)
                // console.log('sutList:', kahvaltiSutList)
                // ogleNewList = [...ogleEYPList, ...ogleSebzeList, ...ogleYagList, ...ogleEkmekList]
                // setOgleList(ogleNewList);

                // aksamNewList = [...aksamEYPList, ...aksamSebzeList, ...aksamSutList, ...aksamYagList, ...aksamEkmekList]
                // setAksamList(aksamNewList);

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