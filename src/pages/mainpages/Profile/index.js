import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux';
import { View, Text, TouchableOpacity, Dimensions, Image, Alert } from 'react-native';
import { database } from '../../../config/config';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import moment from 'moment';
import ImageLayout from '../../../components/image-layout';
import { changeProfilePicture } from '../../../helpers';
import IconCard from '../../../components/profile/icon-card';
import PressableCard from '../../../components/profile/pressable-card';
import LevelCard from '../../../components/profile/level-card';
import styles from './style';

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
            return <LevelCard currentPoint={profileData.point} levelTitle={1} levelPoint={10000} progress={level1} />
        } else if (profileData.point >= 10000 && profileData.point <= 15001) {
            return <LevelCard currentPoint={profileData.point} levelTitle={2} levelPoint={25000} progress={level2} />
        } else if (profileData.point >= 25000) {
            return <LevelCard currentPoint={profileData.point} levelTitle={3} levelPoint={40000} progress={level3} />
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
                <Image style={styles.imageView} resizeMode="cover" source={profileData.profile_picture !== '' && profileData.profile_picture !== undefined ? { uri: profileData.profile_picture } : require('../../../img/no-image.jpg')} />

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
                <View style={[styles.iconsContainer, { paddingHorizontal: 20, paddingBottom: 100 }]}>
                    <PressableCard title="Testleri Gör" image={{ uri: 'https://www.lanochefithall.com/assets/img/usenme.jpg' }} onPress={() => navigation.navigate('TestList')} />
                    <PressableCard title="Mezura Ölçümleri" image={require('../../../img/mezura.jpeg')} onPress={() => navigation.navigate('Olcumler')} />
                </View>
            }
        </ImageLayout>
    )
}

export default Profile;