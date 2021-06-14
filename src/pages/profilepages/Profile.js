import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, Dimensions, SafeAreaView, Image, ImageBackground, TouchableHighlight, ScrollView } from 'react-native';
import { database2 } from '../../config/config';
import SpinnerLoading from '../../components/SpinnerLoading';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon2 from 'react-native-vector-icons/AntDesign';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import moment from 'moment';
import { Bar } from 'react-native-progress';
import Sidebar from '../../components/Sidebar';
import LinearGradient from 'react-native-linear-gradient';

LocaleConfig.locales['tr'] = {
    monthNames: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'],
    monthNamesShort: ['Oca.', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'],
    dayNames: ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'],
    dayNamesShort: ['Paz.', 'Pzt.', 'Sal.', 'Çrş.', 'Per.', 'Cum.', 'Cts.'],
    today: 'Bugün'
};
LocaleConfig.defaultLocale = 'tr';

const { height, width } = Dimensions.get("window");

const Profile = ({ props, navigation }) => {

    const [ShowSideModal, setShowSideModal] = useState(false);

    const [Loading, setLoading] = useState(false);
    const profileData = useSelector(state => state.user.users);
    const [SelectedPage, setSelectedPage] = useState(0);
    const [AktifGun, setAktifGun] = useState(0);
    const [EgzersizList, setEgzersizList] = useState([]);
    const [TamamlananCount, setTamamlananCount] = useState(0);
    const [markedDatesArray, setmarkedDatesArray] = useState([]);
    const [HedefAvg, setHedefAvg] = useState(0);

    const [BestDay, setBestDay] = useState("")

    const closeModal = () => {
        setShowSideModal(!ShowSideModal);
    }

    const onDayPressed = (day) => {
        var date = moment(day.dateString).format("DD/MM/YYYY");
        var newWorkoutObj = EgzersizList.filter(q => q.date === date);

        navigation.navigate('Gecmis', { workout: newWorkoutObj })
    }

    const renderLevel = () => {
        var level1 = parseFloat(profileData.point) / parseFloat(10000)
        var level2 = parseFloat(profileData.point) / parseFloat(15000)
        var level3 = parseFloat(profileData.point) / parseFloat(25000)

        if (profileData.point < 10000) {
            return (
                <>
                    <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: 20, paddingHorizontal: 20 }}>
                        <View style={{ width: '100%', marginBottom: 8 }}>
                            <Text style={{
                                fontFamily: 'SFProDisplay-Medium',
                                fontSize: 12,
                                color: 'yellow'
                            }}>Seviye {String(1)}</Text>
                        </View>

                        <Bar height={4} style={{ width: '100%' }} width={null} color="yellow" progress={level1} unfilledColor="#9999" borderWidth={0} />

                        <View style={{ flexDirection: 'row', width: '100%', marginTop: 8, justifyContent: 'space-between', alignItems: 'center' }}>

                            <Text style={{
                                fontFamily: 'SFProDisplay-Medium',
                                fontSize: 12,
                                color: 'yellow'
                            }}>{profileData.point ? parseFloat(profileData.point).toFixed(1) : 0} puan</Text>

                            <Text style={{
                                fontFamily: 'SFProDisplay-Medium',
                                fontSize: 12,
                                color: '#9D9D9D'
                            }}>2. seviye için {parseFloat(String(parseFloat(10000) - parseFloat(profileData.point))).toFixed(1)} puan kaldı</Text>
                        </View>
                    </View>
                </>
            )
        }

        if (profileData.point >= 10000 && profileData.point !== 15000) {
            return (
                <>
                    <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: 20, paddingHorizontal: 20 }}>
                        <View style={{ width: '100%', marginBottom: 8 }}>
                            <Text style={{
                                fontFamily: 'SFProDisplay-Medium',
                                fontSize: 12,
                                color: 'yellow'
                            }}>Seviye {String(2)}</Text>
                        </View>

                        <Bar height={4} style={{ width: '100%' }} width={null} color="yellow" progress={level2} unfilledColor="#9999" borderWidth={0} />

                        <View style={{ flexDirection: 'row', width: '100%', marginTop: 8, justifyContent: 'space-between', alignItems: 'center' }}>

                            <Text style={{
                                fontFamily: 'SFProDisplay-Medium',
                                fontSize: 12,
                                color: 'yellow'
                            }}>{profileData.point ? parseFloat(profileData.point).toFixed(1) : 0} puan</Text>

                            <Text style={{
                                fontFamily: 'SFProDisplay-Medium',
                                fontSize: 12,
                                color: '#9D9D9D'
                            }}>3. seviye için {String(parseFloat(25000) - parseFloat(profileData.point).toFixed(1))} puan kaldı</Text>
                        </View>
                    </View>
                </>
            )
        }


        if (profileData.point >= 25000) {
            return (
                <>
                    <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: 20, paddingHorizontal: 20 }}>
                        <View style={{ width: '100%', marginBottom: 8 }}>
                            <Text style={{
                                fontFamily: 'SFProDisplay-Medium',
                                fontSize: 12,
                                color: 'yellow'
                            }}>Seviye {String(2)}</Text>
                        </View>

                        <Bar height={4} style={{ width: '100%' }} width={null} color="yellow" progress={level3} unfilledColor="#9999" borderWidth={0} />

                        <View style={{ flexDirection: 'row', width: '100%', marginTop: 8, justifyContent: 'space-between', alignItems: 'center' }}>

                            <Text style={{
                                fontFamily: 'SFProDisplay-Medium',
                                fontSize: 11,
                                color: 'yellow'
                            }}>{profileData.point ? parseFloat(profileData.point).toFixed(1) : 0} puan</Text>

                            <Text style={{
                                fontFamily: 'SFProDisplay-Medium',
                                fontSize: 12,
                                color: '#9D9D9D'
                            }}>Seviyeyi tamamlamak için {String(parseFloat(40000) - parseFloat(profileData.point))} puan kaldı</Text>
                        </View>
                    </View>
                </>
            )
        }
    }

    const getMyWorkouts = async () => {
        let egzList = [];
        let completedList = [];

        database2.ref('users/' + profileData.userId + '/workouts').on('value', snapshot => {
            var arr = [];
            if (snapshot.val() !== null) {
                snapshot.forEach((item) => {
                    egzList.push({
                        ...item.val(),
                        id: item.key
                    });

                    // let completed = null;
                    let total = 0;

                    // Object.values(item.val().moves).forEach((wrk) => {
                    //     if (wrk.completed === false) {
                    //         // completed = false
                    //     } else if (wrk.completed === true) {
                    //         // completed = true;
                    //         wrk.calorie !== undefined && wrk.calorie !== "NaN" ? total += parseFloat(wrk.calorie) : 0
                    //     }
                    // })

                    // if (completed === true) {
                    //     completedList.push({
                    //         ...item.val(),
                    //         date: item.key,
                    //         total: parseFloat(total)
                    //     })
                    // }


                    // let workout = { key: 'workout', color: 'green' };

                    // arr[moment(item.key, "DD-MM-YYYY").format("YYYY-MM-DD")] = { dots: [workout], disabled: false }
                })

                if (completedList.length >= 1) {
                    const userBestDay = completedList.sort((a, b) => String(b.total).toLowerCase().localeCompare(String(a.total).toLowerCase()))
                    setBestDay(moment(userBestDay[0].date, "DD/MM/YYYY").format("LL"));
                }
                setmarkedDatesArray(arr);
                setTamamlananCount(completedList.length)
                setEgzersizList(egzList);
                setLoading(false);
            } else {
                setLoading(false);
            }
        })
    }

    const CalcTargets = async () => {
        var adimTarget = profileData.targets?.step !== undefined ? profileData.targets.step : 0
        var kaloriTarget = profileData.targets?.calories !== undefined ? profileData.targets.calories : 0


        let CalorieList = [];
        let AdimList = [];
        let kaloriCount = 0;
        let adimCount = 0;

        kaloriAvg = 0;
        adimAvg = 0;

        await database2.ref('users_points/' + profileData.userId).once('value').then(snapshot => {
            if (snapshot.val() !== null && snapshot.val() !== undefined) {
                snapshot.forEach((item) => {
                    CalorieList.push(item.val());
                })

                let sum = CalorieList.reduce(function (prev, current) {
                    return prev + +parseFloat(current.calories)
                }, 0);

                kaloriCount = sum;
                kaloriAvg = parseFloat(kaloriTarget) / parseFloat(kaloriCount);
            }
        })
            .catch((err) => console.log('err:', err))

        await database2.ref('steps/' + profileData.userId).once('value').then(snapshot => {
            if (snapshot.val() !== null && snapshot.val() !== undefined) {
                snapshot.forEach((item) => {
                    AdimList.push(item.val());
                })

                let sum = AdimList.reduce(function (prev, current) {
                    return prev + +parseFloat(current.value)
                }, 0);

                adimCount = sum;
                adimAvg = parseFloat(adimTarget) / parseFloat(adimCount);
            }
        })
            .catch((err) => console.log('err:', err))

        setTimeout(() => {
            var a = (parseFloat(adimAvg) + parseFloat(kaloriAvg)) / 100
            setHedefAvg(a)
        }, 300);


    }

    useEffect(() => {
        setLoading(true);
        var start = moment(profileData.registerDate, "DD/MM/YYYY");
        var end = moment(moment(), "DD/MM/YYYY");

        setAktifGun(parseFloat(moment.duration(end.diff(start)).asDays()).toFixed(0));

        getMyWorkouts();
        CalcTargets();
    }, [])

    return (
        <ImageBackground style={{ height: height, width: width }} resizeMode="cover" source={require('../../img/bg.jpg')}>
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="light-content" />
                <SpinnerLoading Loading={Loading} />

                <Sidebar navigation={navigation} opened={ShowSideModal} onClose={() => closeModal()} />

                <View style={styles.header} >
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => setShowSideModal(!ShowSideModal)}>
                            <Icon name="menu" color="#FFF" size={32} style={{ marginRight: 15 }} />
                        </TouchableOpacity>
                        <Text style={styles.headerText}>Profil</Text>
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

                <ScrollView style={{ width: '100%' }}>
                    <View style={styles.profileView}>
                        <Image style={styles.imageView} resizeMode="cover" source={{ uri: profileData.avatar !== '' && profileData.avatar !== undefined ? profileData.avatar : 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png' }} />
                        <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                            <Text style={styles.nameText}>{profileData.name}</Text>
                        </View>
                    </View>


                    <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 30 }}>

                        <TouchableOpacity onPress={() => setSelectedPage(0)} style={{ justifyContent: 'flex-start', alignItems: 'center' }}>
                            <Text style={SelectedPage === 0 ? styles.TabsTextActive : styles.TabsTextDisabled}>Seviye</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => setSelectedPage(1)} style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={SelectedPage === 1 ? styles.TabsTextActive : styles.TabsTextDisabled}>Geçmiş</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => setSelectedPage(2)} style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={SelectedPage === 2 ? styles.TabsTextActive : styles.TabsTextDisabled}>Ölçümler</Text>
                        </TouchableOpacity>
                    </View>

                    {SelectedPage === 0 &&
                        <>
                            {renderLevel()}

                            <View style={styles.iconsContainer}>
                                <View style={styles.iconsView}>
                                    <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: width / 3 }}>
                                        <Icon2 name="user" color="yellow" size={32} style={{ marginBottom: 10 }} />
                                        <Text style={styles.iconsText}>Aktif</Text>
                                        <Text style={styles.iconsText}>Gün</Text>
                                        <Text style={styles.iconsText}>Sayısı</Text>
                                        <Text style={styles.iconsNumber}>{AktifGun !== undefined && AktifGun !== "NaN" ? AktifGun : 0}</Text>
                                    </View>

                                    <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: width / 3 }}>
                                        <Icon2 name="linechart" color="yellow" size={32} style={{ marginBottom: 10 }} />
                                        <Text style={styles.iconsText}>Hedef</Text>
                                        <Text style={styles.iconsText}>Tutturma</Text>
                                        <Text style={styles.iconsText}>Yüzdesi</Text>
                                        <Text style={styles.iconsNumber}>%{parseFloat(HedefAvg !== undefined && String(HedefAvg) !== "NaN" ? HedefAvg : 0).toFixed(2)}</Text>
                                    </View>

                                    <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: width / 3 }}>
                                        <Icon2 name="Trophy" color="yellow" size={32} style={{ marginBottom: 10 }} />
                                        <Text style={styles.iconsText}>Tamamlanan</Text>
                                        <Text style={styles.iconsText}>Egzersiz</Text>
                                        <Text style={styles.iconsText}>Sayısı</Text>
                                        <Text style={styles.iconsNumber}>{TamamlananCount}</Text>
                                    </View>
                                </View>


                                <View style={styles.iconsView}>
                                    <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: width / 3 }}>
                                        <Icon2 name="checksquareo" color="yellow" size={32} style={{ marginBottom: 10 }} />
                                        <Text style={styles.iconsText}>En İyi Gün</Text>
                                        {BestDay !== "" ?
                                            <>
                                                <Text style={styles.iconsNumber}>{String(BestDay).slice(0, 2) !== "NaN" ? String(BestDay).slice(0, 2) : 0}</Text>
                                                <Text style={styles.iconsDate}>{String(BestDay).slice(2) !== "NaN" ? String(BestDay).slice(2) : 0}</Text>
                                            </>
                                            :
                                            <Text style={styles.iconsNumber}>Yok</Text>
                                        }
                                    </View>

                                    <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: width / 3 }}>
                                        <Icon2 name="checksquareo" color="yellow" size={32} style={{ marginBottom: 10 }} />
                                        <Text style={styles.iconsText}>En İyi Hafta</Text>
                                        {BestDay !== "" ?
                                            <>
                                                <Text style={styles.iconsNumber}>{String(moment(BestDay).week()) !== "NaN" ? String(moment(BestDay).week()) : 0}. Hafta</Text>
                                                <Text style={styles.iconsDate}>{String(BestDay).split(' ')[1] !== "NaN" ? String(BestDay).split(' ')[1] : '-'}</Text>
                                            </>
                                            :
                                            <Text style={styles.iconsNumber}>Yok</Text>
                                        }

                                    </View>

                                    <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: width / 3 }}>
                                        <Icon2 name="checksquareo" color="yellow" size={32} style={{ marginBottom: 10 }} />
                                        <Text style={styles.iconsText}>En İyi Ay</Text>
                                        {BestDay !== "" ?
                                            <>
                                                <Text style={styles.iconsNumber}>{String(BestDay).split(' ')[1] !== "NaN" ? String(BestDay).split(' ')[1] : 0}</Text>
                                                <Text style={styles.iconsDate}>{String(BestDay).split(' ')[2] !== "NaN" ? String(BestDay).split(' ')[2] : "-"}</Text>
                                            </>
                                            :
                                            <Text style={styles.iconsNumber}>Yok</Text>
                                        }
                                    </View>
                                </View>
                            </View>
                        </>
                    }

                    {SelectedPage === 1 &&
                        <View style={styles.gecmisContainer}>


                            <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'center', marginBottom: 10 }}>

                                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', paddingHorizontal: 15 }}>
                                    <View style={{ backgroundColor: 'green', borderRadius: 50, height: 4, width: 4 }} />
                                    <Text style={{
                                        fontFamily: 'SFProDisplay-Medium',
                                        fontSize: 13,
                                        color: 'green',
                                        marginLeft: 8
                                    }}>Beslenme</Text>
                                </View>

                                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', paddingHorizontal: 15 }}>
                                    <View style={{ backgroundColor: 'yellow', borderRadius: 50, height: 4, width: 4 }} />
                                    <Text style={{
                                        fontFamily: 'SFProDisplay-Medium',
                                        fontSize: 13,
                                        color: 'yellow',
                                        marginLeft: 8
                                    }}>Antrenman</Text>
                                </View>

                            </View>

                            <Calendar
                                style={{
                                    width: width / 1.2
                                }}
                                markedDates={markedDatesArray}
                                enableSwipeMonths={true}
                                maxDate={moment().format('YYYY-MM-DD')}
                                scrollEnabled={true}
                                hideDayNames={true}
                                markingType={'multi-dot'}
                                onDayPress={(day) => onDayPressed(day)}
                                hideExtraDays={true}
                                theme={{
                                    backgroundColor: 'rgba(0,0,0,0)',
                                    calendarBackground: 'rgba(0,0,0,0)',
                                    textSectionTitleColor: '#b6c1cd',
                                    textSectionTitleDisabledColor: '#d9e1e8',
                                    selectedDayBackgroundColor: '#00adf5',
                                    selectedDayTextColor: '#ffffff',
                                    todayTextColor: 'yellow',
                                    dayTextColor: 'white',
                                    textDisabledColor: '#d9e1e8',
                                    dotColor: '#00adf5',
                                    selectedDotColor: '#ffffff',
                                    arrowColor: 'white',
                                    disabledArrowColor: '#d9e1e8',
                                    monthTextColor: 'white',
                                    indicatorColor: 'white',
                                    textDayFontFamily: 'SFProDisplay-Medium',
                                    textMonthFontFamily: 'SFProDisplay-Medium',
                                    textDayHeaderFontFamily: 'SFProDisplay-Medium',
                                    textDayFontWeight: '300',
                                    textMonthFontWeight: 'bold',
                                    textDayHeaderFontWeight: '300',
                                    textDayFontSize: 16,
                                    textMonthFontSize: 16,
                                    textDayHeaderFontSize: 16
                                }}
                            />
                        </View>
                    }

                    {SelectedPage === 2 &&
                        <>
                            <View style={[styles.iconsContainer, { paddingHorizontal: 20, paddingBottom: 100 }]}>

                                <TouchableOpacity
                                    onPress={() => navigation.navigate('TestList')}
                                    style={{
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
                                            height: 200,
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
                                            height: 200
                                        }}
                                    />

                                    <View style={{ position: 'absolute', top: 20, bottom: 20, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 }}>
                                        <Text style={{
                                            fontFamily: 'SFProDisplay-Bold',
                                            fontSize: 16,
                                            textAlign: 'center',
                                            color: 'yellow',
                                            marginRight: 10
                                        }}
                                        >Testleri Gör</Text>
                                        <Icon2 name="arrowright" color="yellow" size={22} />
                                    </View>

                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => navigation.navigate('Olcumler')}
                                    style={{
                                        height: 'auto',
                                        width: '100%',
                                        borderRadius: 18,
                                        marginTop: 10,
                                        marginBottom: 10
                                    }}>
                                    <Image
                                        resizeMode="cover"
                                        source={{ uri: 'https://thumbs.dreamstime.com/b/active-young-excited-happy-woman-posing-centimeter-over-isolated-over-pastel-blue-studio-background-sport-fitness-healthy-170036983.jpg' }}
                                        style={{
                                            width: '100%',
                                            height: 200,
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
                                            height: 200
                                        }}
                                    />

                                    <View style={{ position: 'absolute', top: 20, bottom: 20, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 }}>
                                        <Text style={{
                                            fontFamily: 'SFProDisplay-Bold',
                                            fontSize: 16,
                                            textAlign: 'center',
                                            color: 'yellow',
                                            marginRight: 10
                                        }}
                                        >Mezura Ölçümleri</Text>
                                        <Icon2 name="arrowright" color="yellow" size={22} />
                                    </View>

                                </TouchableOpacity>

                            </View>
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
    TabsTextActive: {
        fontFamily: 'SFProDisplay-Bold',
        fontSize: 16,
        paddingVertical: 1,
        color: 'yellow'
    },
    TabsTextDisabled: {
        fontFamily: 'SFProDisplay-Bold',
        fontSize: 16,
        paddingVertical: 1,
        color: 'white'
    },
    nameText: {
        marginTop: 20,
        fontFamily: 'SFProDisplay-Bold',
        fontSize: 18,
        color: '#FFF'
    },
    imageView: {
        borderRadius: 100,
        backgroundColor: 'red',
        height: 120,
        width: 120
    },
    profileView: {
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%'
    },
    iconsContainer: {
        flexDirection: 'column',
        paddingVertical: 20,
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%'
    },
    iconsView: {
        flexDirection: 'row',
        paddingVertical: 20,
        justifyContent: 'space-evenly',
        alignItems: 'center',
        width: '100%'
    },
    iconsText: {
        fontFamily: 'SFProDisplay-Medium',
        fontSize: 13,
        paddingVertical: 1,
        color: '#FFF'
    },
    iconsNumber: {
        marginTop: 10,
        fontFamily: 'SFProDisplay-Bold',
        fontSize: 18,
        color: '#FFF'
    },
    iconsDate: {
        marginTop: 5,
        fontFamily: 'SFProDisplay-Bold',
        fontSize: 12,
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
    //gecmis
    gecmisContainer: {
        flexDirection: 'column',
        paddingVertical: 20,
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%'
    }
})
export default Profile;