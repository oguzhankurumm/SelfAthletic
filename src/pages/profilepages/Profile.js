import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, Dimensions, SafeAreaView, Image, ImageBackground, TouchableHighlight, ScrollView } from 'react-native';
import { database2 } from '../../config/config';
import SpinnerLoading from '../../components/SpinnerLoading';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import moment from 'moment';
import { Bar } from 'react-native-progress';
import Sidebar from '../../components/Sidebar';

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
                    <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: 20, paddingHorizontal: 30 }}>
                        <View style={{ width: '100%', marginBottom: 8 }}>
                            <Text style={{
                                fontFamily: 'SFProDisplay-Medium',
                                fontSize: 11,
                                color: 'yellow'
                            }}>Seviye {String(1)}</Text>
                        </View>

                        <Bar height={4} style={{ width: '100%' }} width={null} color="yellow" progress={level1} unfilledColor="#9999" borderWidth={0} />

                        <View style={{ flexDirection: 'row', width: '100%', marginTop: 8, justifyContent: 'space-between', alignItems: 'center' }}>

                            <Text style={{
                                fontFamily: 'SFProDisplay-Medium',
                                fontSize: 11,
                                color: 'yellow'
                            }}>{profileData.point ? profileData.point : 0} puan</Text>

                            <Text style={{
                                fontFamily: 'SFProDisplay-Medium',
                                fontSize: 11,
                                color: '#9D9D9D'
                            }}>2. seviye için {String(parseFloat(10000) - parseFloat(profileData.point))} puan kaldı</Text>
                        </View>
                    </View>
                </>
            )
        }

        if (profileData.point >= 10000 && profileData.point !== 15000) {
            return (
                <>
                    <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: 20, paddingHorizontal: 30 }}>
                        <View style={{ width: '100%', marginBottom: 8 }}>
                            <Text style={{
                                fontFamily: 'SFProDisplay-Medium',
                                fontSize: 11,
                                color: 'yellow'
                            }}>Seviye {String(2)}</Text>
                        </View>

                        <Bar height={4} style={{ width: '100%' }} width={null} color="yellow" progress={level2} unfilledColor="#9999" borderWidth={0} />

                        <View style={{ flexDirection: 'row', width: '100%', marginTop: 8, justifyContent: 'space-between', alignItems: 'center' }}>

                            <Text style={{
                                fontFamily: 'SFProDisplay-Medium',
                                fontSize: 11,
                                color: 'yellow'
                            }}>{profileData.point ? profileData.point : 0} puan</Text>

                            <Text style={{
                                fontFamily: 'SFProDisplay-Medium',
                                fontSize: 11,
                                color: '#9D9D9D'
                            }}>3. seviye için {String(parseFloat(25000) - parseFloat(profileData.point))} puan kaldı</Text>
                        </View>
                    </View>
                </>
            )
        }


        if (profileData.point >= 25000) {
            return (
                <>
                    <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: 20, paddingHorizontal: 30 }}>
                        <View style={{ width: '100%', marginBottom: 8 }}>
                            <Text style={{
                                fontFamily: 'SFProDisplay-Medium',
                                fontSize: 11,
                                color: 'yellow'
                            }}>Seviye {String(2)}</Text>
                        </View>

                        <Bar height={4} style={{ width: '100%' }} width={null} color="yellow" progress={level3} unfilledColor="#9999" borderWidth={0} />

                        <View style={{ flexDirection: 'row', width: '100%', marginTop: 8, justifyContent: 'space-between', alignItems: 'center' }}>

                            <Text style={{
                                fontFamily: 'SFProDisplay-Medium',
                                fontSize: 11,
                                color: 'yellow'
                            }}>{profileData.point ? profileData.point : 0} puan</Text>

                            <Text style={{
                                fontFamily: 'SFProDisplay-Medium',
                                fontSize: 11,
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
                    if (item.val().completed === true) {
                        completedList.push(item)
                    }

                    let food = { key: 'food', color: item.val().completed === true ? 'green' : '#d3d3d3' };
                    let workout = { key: 'workout', color: item.val().completed === true ? 'yellow' : '#d3d3d3' };

                    arr[moment(item.val().date, "DD/MM/YYYY").format("YYYY-MM-DD")] = { dots: [workout], disabled: false }
                })

                setmarkedDatesArray(arr);
                setTamamlananCount(completedList.length)
                setEgzersizList(egzList);
                setLoading(false);
            } else {
                setLoading(false);
            }
        })
    }

    useEffect(() => {
        setLoading(true);
        var start = moment(profileData.registerDate, "DD/MM/YYYY");
        var end = moment(moment(), "DD/MM/YYYY");

        setAktifGun(parseFloat(moment.duration(end.diff(start)).asDays()).toFixed(0));

        getMyWorkouts();
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
                        <Image style={styles.imageView} source={{ uri: profileData.avatar !== '' ? profileData.avatar : 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png' }} />
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
                                        <Icon name="directions-run" color="yellow" size={32} style={{ marginBottom: 10 }} />
                                        <Text style={styles.iconsText}>Aktif</Text>
                                        <Text style={styles.iconsText}>Gün</Text>
                                        <Text style={styles.iconsText}>Sayısı</Text>
                                        <Text style={styles.iconsNumber}>{AktifGun}</Text>
                                    </View>

                                    <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: width / 3 }}>
                                        <Icon name="people" color="yellow" size={32} style={{ marginBottom: 10 }} />
                                        <Text style={styles.iconsText}>Hedef</Text>
                                        <Text style={styles.iconsText}>Tutturma</Text>
                                        <Text style={styles.iconsText}>Yüzdesi</Text>
                                        <Text style={styles.iconsNumber}>%0</Text>
                                    </View>

                                    <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: width / 3 }}>
                                        <Icon name="people" color="yellow" size={32} style={{ marginBottom: 10 }} />
                                        <Text style={styles.iconsText}>Tamamlanan</Text>
                                        <Text style={styles.iconsText}>Egzersiz</Text>
                                        <Text style={styles.iconsText}>Sayısı</Text>
                                        <Text style={styles.iconsNumber}>{TamamlananCount}</Text>
                                    </View>
                                </View>


                                <View style={styles.iconsView}>
                                    <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: width / 3 }}>
                                        <Icon name="people" color="yellow" size={32} style={{ marginBottom: 10 }} />
                                        <Text style={[styles.iconsText, { textDecorationLine: "underline" }]}>En İyi Gün</Text>
                                        <Text style={styles.iconsNumber}>16</Text>
                                        <Text style={styles.iconsDate}>Mart 2021</Text>
                                    </View>

                                    <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: width / 3 }}>
                                        <Icon name="people" color="yellow" size={32} style={{ marginBottom: 10 }} />
                                        <Text style={[styles.iconsText, { textDecorationLine: "underline" }]}>En İyi Hafta</Text>
                                        <Text style={styles.iconsNumber}>16</Text>
                                        <Text style={styles.iconsDate}>Mart 2021</Text>
                                    </View>

                                    <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: width / 3 }}>
                                        <Icon name="people" color="yellow" size={32} style={{ marginBottom: 10 }} />
                                        <Text style={[styles.iconsText, { textDecorationLine: "underline" }]}>En İyi Ay</Text>
                                        <Text style={styles.iconsNumber}>16</Text>
                                        <Text style={styles.iconsDate}>Mart 2021</Text>
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
        paddingHorizontal: 30
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