import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image, Alert } from 'react-native';
import { database, firestore, auth } from '../../config/config';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import moment from 'moment';
import { Bar } from 'react-native-progress';
import ImageLayout from '../../components/image-layout';
import { changeProfilePicture } from '../../helpers';
import IconCard from '../../components/profile/icon-card';
import PressableCard from '../../components/profile/pressable-card';

LocaleConfig.locales['tr'] = {
    monthNames: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'],
    monthNamesShort: ['Oca.', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'],
    dayNames: ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'],
    dayNamesShort: ['Paz.', 'Pzt.', 'Sal.', 'Çrş.', 'Per.', 'Cum.', 'Cts.'],
    today: 'Bugün'
};
LocaleConfig.defaultLocale = 'tr';

const { height, width } = Dimensions.get("window");

const Profile = ({ navigation }) => {
    let defaultAvatarUrl = "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"

    const [Loading, setLoading] = useState(false);
    const [AllLoading, setAllLoading] = useState(false)
    const profileData = useSelector(state => state.authReducer.currentUser);
    const [SelectedPage, setSelectedPage] = useState(0);
    const [AktifGun, setAktifGun] = useState(0);
    const [EgzersizList, setEgzersizList] = useState([]);
    const [FoodList, setFoodList] = useState([]);
    const [TamamlananCount, setTamamlananCount] = useState(0);
    const [markedDatesArray, setmarkedDatesArray] = useState([]);

    const [BestDay, setBestDay] = useState("")

    const onDayPressed = (day) => {
        var date = moment(day.dateString).format("YYYY-MM-DD");
        if (markedDatesArray[date]) {
            let dots = markedDatesArray[date].dots
            if (dots.length === 1) {
                if (dots[0].key === 'food') {
                    let findData = FoodList.find(q => q.date === date);
                    navigation.navigate('Gecmis', { food: findData, type: 'food' })
                } else {
                    let findData = EgzersizList.find(q => q.date === date)
                    navigation.navigate('Gecmis', { workout: findData, type: 'workout' })
                }
            } else {
                let findFood = FoodList.find(q => q.date === date);
                let findWorkout = EgzersizList.find(q => q.date === date);
                navigation.navigate('Gecmis', { food: findFood, workout: findWorkout, type: 'all' })
            }
        } else {
            Alert.alert('Hata', 'Seçtiğiniz tarihe ilişkin kayıt bulunamadı.');
        }

    }

    const renderLevel = () => {
        var level1 = parseFloat(profileData.point) / 10000;
        var level2 = parseFloat(profileData.point) / 15000;
        var level3 = parseFloat(profileData.point) / 40000;

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
        } else if (profileData.point >= 10000 && profileData.point <= 15001) {
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
        } else if (profileData.point >= 25000) {
            return (
                <>
                    <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: 20, paddingHorizontal: 20 }}>
                        <View style={{ width: '100%', marginBottom: 8 }}>
                            <Text style={{
                                fontFamily: 'SFProDisplay-Medium',
                                fontSize: 12,
                                color: 'yellow'
                            }}>Seviye 3</Text>
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
                            }}>Seviyeyi tamamlamak için {String(parseFloat(parseFloat(40000) - parseFloat(profileData.point)).toFixed(1))} puan kaldı</Text>
                        </View>
                    </View>
                </>
            )
        }
    }

    const getMyWorkouts = async () => {
        let egzList = [];
        let completedList = [];
        let foodList = [];

        await database().ref('users/' + profileData.userId + '/workouts').once('value')
            .then(snapshot => {
                if (snapshot.val() !== null) {
                    snapshot.forEach((item) => {
                        egzList.push({
                            ...item.val(),
                            id: item.key,
                            date: moment(item.key, "DD-MM-YYYY").format("YYYY-MM-DD"),
                            type: 'workout'
                        });

                        let completed = 0;
                        let total = 0;

                        Object.values(item.val().moves).forEach((wrk) => {
                            wrk.calorie !== undefined && wrk.calorie !== "NaN" ? total += parseFloat(wrk.calorie) : 0
                        })

                        completedList.push({
                            ...item.val(),
                            date: item.key,
                            isCompleted: completed,
                            total: parseFloat(total)
                        })
                    })

                    if (completedList.length >= 1) {
                        const userBestDay = completedList.sort((a, b) => String(b.total).toLowerCase().localeCompare(String(a.total).toLowerCase()))
                        setBestDay(moment(userBestDay[0].date, "DD-MM-YYYY").format("LL"));
                    }
                    setTamamlananCount(completedList.length)
                    setEgzersizList(egzList);


                }
            })
            .catch(err => {
                console.log('HATA:', err)
            })

        await database().ref('users/' + profileData.userId + '/foods').once('value')
            .then(snapshot => {
                if (snapshot.val() !== null) {
                    snapshot.forEach((fd) => {
                        foodList.push({
                            ...fd.val(),
                            id: fd.key,
                            date: moment(fd.key, "DD-MM-YYYY").format("YYYY-MM-DD"),
                            type: 'food'
                        });
                    })


                    setFoodList(foodList);

                }
            })
            .catch(err => {
                console.log('FOOD ERR:', err)
            })

        const mergeResult = [...foodList, ...egzList];

        let food = { key: 'food', color: 'green' };
        let workout = { key: 'workout', color: 'yellow' };

        let groups = {};
        var array = Object.keys(mergeResult).map((key) => mergeResult[key])

        if (array.length > 0) {
            array.forEach(function (o, i) {
                var dataObj = { ...o.type === 'workout' ? workout : food, disabled: false }
                if (groups[o.date]) {
                    groups[o.date]['dots'].push(dataObj);
                } else {
                    groups[o.date] = { title: o.date, dots: [dataObj], disabled: false };
                }
            });

        }

        setmarkedDatesArray(groups);
        setAllLoading(false);
    }


    useEffect(() => {
        setAllLoading(true);
        var start = moment(profileData.registerDate, "DD/MM/YYYY");
        var end = moment(moment(), "DD/MM/YYYY");

        setAktifGun(parseFloat(moment.duration(end.diff(start)).asDays()).toFixed(0));
        getMyWorkouts();
    }, [])

    return (
        <ImageLayout
            title="Profilim"
            isScrollable
            Loading={Loading}
        >
            <TouchableOpacity onPress={() => changeProfilePicture(profileData.email).then(res => console.log(res)).catch(err => console.log(err))} activeOpacity={0.8} style={styles.profileView}>
                <Image style={styles.imageView} resizeMode="cover" source={{ uri: profileData.profile_picture !== '' && profileData.profile_picture !== undefined ? profileData.profile_picture : defaultAvatarUrl }} />

                <View style={{ width: '100%', position: 'absolute', right: 0, left: 40, bottom: 40, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ height: 30, width: 30, borderRadius: 100, backgroundColor: 'yellow', justifyContent: 'center', alignItems: 'center' }}>
                        <AntDesign name="plus" size={20} color="#202026" />
                    </View>
                </View>

                <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                    <Text style={styles.nameText}>{profileData.firstName + ' ' + profileData.lastName}</Text>
                </View>
            </TouchableOpacity>

            <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 30 }}>
                <TouchableOpacity onPress={() => setSelectedPage(0)} style={{ justifyContent: 'center', alignItems: 'center' }}>
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
                            <IconCard icon="user" title="Aktif Gün" value={AktifGun !== undefined && AktifGun !== "NaN" ? AktifGun : 0} />
                            <IconCard icon="clockcircleo" title="Tamamlanan Beslenme" value={TamamlananCount} />
                            <IconCard icon="Trophy" title="Tamamlanan Egzersiz" value={TamamlananCount} />
                        </View>

                        <View style={styles.iconsView}>
                            <IconCard icon="checksquareo" title="En İyi Gün" value={"12 Kasım"} />
                            <IconCard icon="checksquareo" title="En İyi Hafta" value={"12"} />
                            <IconCard icon="checksquareo" title="En İyi Ay" value={"Kasım"} />
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

                    {!AllLoading &&
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
                            hideExtraDays={false}
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
                        />}
                </View>
            }

            {SelectedPage === 2 &&
                <>
                    <View style={[styles.iconsContainer, { paddingHorizontal: 20, paddingBottom: 100 }]}>
                        <PressableCard title="Testleri Gör" image={{ uri: 'https://www.lanochefithall.com/assets/img/usenme.jpg' }} onPress={() => navigation.navigate('TestList')} />
                        <PressableCard title="Mezura Ölçümleri" image={require('../../img/mezura.jpeg')} onPress={() => navigation.navigate('Olcumler')} />
                    </View>
                </>
            }
        </ImageLayout>
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