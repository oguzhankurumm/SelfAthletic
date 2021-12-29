import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux';
import { View, Text, TouchableOpacity, Dimensions, Image } from 'react-native';
import { firestore, auth } from '../../../config/config';
import styles from './style';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import moment from 'moment';
import ImageLayout from '../../../components/image-layout';
import { changeProfilePicture } from '../../../helpers';
import IconCard from '../../../components/profile/icon-card';
import PressableCard from '../../../components/profile/pressable-card';
import LevelCard from '../../../components/profile/level-card';
import { showMessage } from 'react-native-flash-message';
import themeColors from '../../../styles/colors';

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
    const [AllLoading, setAllLoading] = useState(true);
    const profileData = useSelector(state => state.authReducer.currentUser);
    const userWorkouts = useSelector(state => state.workoutsReducer.calendarWorkouts);
    const totalPoint = useSelector(state => state.workoutsReducer.totalPoint);
    const [SelectedPage, setSelectedPage] = useState(0);
    const [FoodList, setFoodList] = useState([]);
    const [CompletedFoods, setCompletedFoods] = useState(0);
    const [CompletedWorkouts, setCompletedWorkouts] = useState(0);
    const [markedDatesArray, setmarkedDatesArray] = useState([]);

    console.log({userWorkouts})
    const onDayPressed = (day) => {
        var date = moment(day.dateString).format("YYYY-MM-DD");
        if (markedDatesArray[date]) {
            let dots = markedDatesArray[date].dots
            if (dots.length === 1) {
                if (dots[0].key === 'food') {
                    let findData = FoodList.find(q => q.date === moment(date, "YYYY-MM-DD").format("DD-MM-YYYY"));
                    navigation.navigate('History', { food: findData, type: 'food' })
                } else {
                    let findData = userWorkouts.find(q => q.date === moment(date, "YYYY-MM-DD").format("DD-MM-YYYY"))
                    navigation.navigate('History', { workout: findData, type: 'workout' })
                }
            } else {
                let findFood = FoodList.find(q => q.date === moment(date, "YYYY-MM-DD").format("DD-MM-YYYY"));
                let findWorkout = userWorkouts.filter(q => q.date === moment(date, "YYYY-MM-DD").format("DD-MM-YYYY"));
                navigation.navigate('History', { food: findFood, workout: findWorkout, type: 'all' })
            }
        } else {
            showMessage({
                message: "Kayıt Yok",
                description: 'Seçtiğiniz güne ait bir kayıt bulunamadı.',
                type: 'warning',
                backgroundColor: themeColors.yellow,
                color: themeColors.ultraDark,
                duration: 3000
            })
        }

    }

    const renderLevel = () => {
        var level1 = parseFloat(totalPoint) / 10000;
        var level2 = parseFloat(totalPoint) / 15000;
        var level3 = parseFloat(totalPoint) / 40000;

        if (totalPoint < 10000) {
            return <LevelCard currentPoint={totalPoint} levelTitle={1} levelPoint={10000} progress={level1} />
        } else if (totalPoint >= 10000 && totalPoint <= 15001) {
            return <LevelCard currentPoint={totalPoint} levelTitle={2} levelPoint={25000} progress={level2} />
        } else if (totalPoint >= 25000) {
            return <LevelCard currentPoint={totalPoint} levelTitle={3} levelPoint={40000} progress={level3} />
        }
    }

    const CalculateCompleteds = async () => {
        try {
            const foodsRes = await firestore().collection('users').doc(profileData.email).collection('foods').where("completed", "==", true).get()
            if (!foodsRes.empty) {
                foodsRes.docs.length > 0 ? setCompletedFoods(foodsRes.docs.length) : setCompletedFoods(0)
            }


            if (userWorkouts !== undefined && userWorkouts.length > 0) {
                const groupArrayByDate = (array) => {
                    return array.reduce((acc, cur) => {
                        const date = moment(cur.date, "DD-MM-YYYY").format("YYYY-MM-DD");
                        if (!acc[date]) {
                            acc[date] = [];
                        }
                        acc[date].push(cur);
                        return acc;
                    }, {});
                }

                setCompletedWorkouts(userWorkouts.length);
                let groups = {};

                userWorkouts.map(o => {
                    const date = moment(o.date, 'DD-MM-YYYY').format('YYYY-MM-DD');
                    const isCompleted = o.completed;
                    if (groups[date]) {
                        groups[date]['dots'].push({ color: 'yellow' });
                    } else {
                        groups[date] = { date: new Date(date), dots: [{ color: 'yellow' }] };
                    }
                });

                setmarkedDatesArray(groups);
                setAllLoading(false);
            }

        } catch (error) {
            console.log('Hata', error);
            setAllLoading(false);
        }
    }

    useEffect(() => {
        CalculateCompleteds();
    }, [userWorkouts])

    return (
        <ImageLayout
            title="Profilim"
            isScrollable
            Loading={Loading}
        >
            <TouchableOpacity onPress={() => changeProfilePicture(profileData.email).then(res => console.log(res)).catch(err => console.log(err))} activeOpacity={0.8} style={styles.profileView}>
                <Image style={styles.imageView} resizeMode="cover" source={profileData.profile_picture !== '' && profileData.profile_picture !== undefined ? { uri: profileData.profile_picture } : require('../../../assets/img/no-image.jpg')} />

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
                            <IconCard icon="user" title="Aktif Gün" value={parseFloat(moment.duration(moment().diff(auth().currentUser.metadata.creationTime)).asDays()).toFixed(0)} />
                            <IconCard icon="clockcircleo" title="Tamamlanan Beslenme" value={CompletedFoods} />
                            <IconCard icon="Trophy" title="Tamamlanan Egzersiz" value={CompletedWorkouts} />
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
                    <PressableCard title="Testleri Gör" image={require('../../../assets/img/tests.jpeg')} onPress={() => navigation.navigate('TestList')} />
                    <PressableCard title="Mezura Ölçümleri" image={require('../../../assets/img/mezura.jpeg')} onPress={() => navigation.navigate('Measurement')} />
                </View>
            }
        </ImageLayout>
    )
}

export default Profile;