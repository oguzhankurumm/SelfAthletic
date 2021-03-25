import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Image, StatusBar, TouchableOpacity, TouchableHighlight, Dimensions, ImageBackground, SafeAreaView, ScrollView, FlatList } from 'react-native';
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
    const [TotalProgress, setTotalProgress] = useState(30); //hedeflerin ortalaması alınacak

    const [ShowSideModal, setShowSideModal] = useState(false);
    const [Workouts, setWorkouts] = useState([]);
    const [VideoList, setVideoList] = useState([]);
    // const [TotalHours, setTotalHours] = useState(0);

    const getVideo = () => {
        let videoList = [];

        Workouts.forEach((move) => {
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

                        // let drt = videoList.reduce(function (prev, current) {
                        //     return prev + +parseFloat(current.duration)
                        // }, 0);

                        // setTotalHours(moment.utc(drt * 1000).format('HH:mm:ss'));
                        setLoading(false);
                    } else {
                        setLoading(false);
                    }
                })
                .catch((err) => {
                    setLoading(false);
                    Alert.alert('Hata', 'Videolar yüklenemedi, lütfen internet bağlantınızı kontrol edin.')
                })
        })
    }

    useEffect(() => {
        setLoading(true);
        var myWorkoutList = [];
        let userProblems = profileData.questions.cronicproblems

        userProblems.forEach((up) => {
            if (up === "Ayak Bileği") {
                console.log('varr')
            }
        })


        database2.ref('workouts').limitToLast(5).once('value')
                .then((snapshot) => {
                    snapshot.forEach((item) => {
                        myWorkoutList.push({
                            ...item.val(),
                            id: item.key
                        })
                    })

                    setWorkouts(myWorkoutList);
                    // if (Workouts.length !== 0) {
                    getVideo();
                    // } else {
                    //     setLoading(false);
                    // }
                })
                .catch((err) => {
                    console.log('err: ', err);
                    setLoading(false)
                })
    }, [])

    const closeModal = () => {
        setShowSideModal(!ShowSideModal);
    }

    let datesWhitelist = [{
        start: moment().subtract(2, 'days'),
        end: moment().add(4, 'days')
    }];


    const [markedDatesArray, setmarkedDatesArray] = useState([
        {
            date: moment(),
            dots: [
                {
                    color: 'yellow'
                }
            ],
        },
        {
            date: moment().subtract(2, 'days'),
            dots: [
                {
                    color: 'yellow',
                    selectedColor: 'yellow',
                },
            ],
        }])


    return (
        <ImageBackground style={{ height: height, width: width }} resizeMode="cover" source={require('../../img/bg.jpg')}>
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="light-content" />
                <SpinnerLoading Loading={Loading} />
                <Sidebar selected="Workouts" navigation={navigation} opened={ShowSideModal} onClose={() => closeModal()} />

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

                <ScrollView>
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
                                <Text style={styles.targetText}>150 / {String(profileData.targets.calorie ? profileData.targets.calorie : 0)}</Text>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={styles.targetSubText}>Yapılan</Text>
                                    <Text style={styles.targetSubText}> - Hedef</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={{ width: '100%', paddingHorizontal: 20 }}>
                        {!Loading &&
                            <CalendarStrip
                                scrollable={false}
                                // showMonth={false}
                                onDateSelected={(val) => console.log('selected Date: ', val)}
                                // datesWhitelist={datesWhitelist}
                                iconStyle={{ padding: 10 }}
                                style={{ height: 100, paddingTop: 20, paddingBottom: 10 }}
                                daySelectionAnimation={{ type: 'background', duration: 200, borderWidth: 1, borderHighlightColor: 'white' }}
                                calendarHeaderStyle={{ color: 'white' }}
                                dateNumberStyle={{ color: 'white' }}
                                dateNameStyle={{ color: 'white' }}
                                highlightDateNumberStyle={{ color: 'yellow' }}
                                highlightDateNameStyle={{ color: 'yellow' }}
                                disabledDateNameStyle={{ color: 'grey' }}
                                disabledDateNumberStyle={{ color: 'grey' }}
                                iconContainer={{ flex: 0.1 }}
                                markedDates={markedDatesArray}
                            />
                        }
                    </View>

                    {!Loading &&
                        <FlatList style={{ height: 'auto', paddingHorizontal: 30, marginBottom: 100 }}
                            scrollEnabled={true}
                            data={VideoList}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={(workouts) => {
                                var item = workouts.item;
                                return (item &&
                                    <TouchableOpacity onPress={() => props.navigation.navigate('WorkoutDetails', { item: item })}
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
                                            <Text numberOfLines={1} style={{
                                                fontFamily: 'SFProDisplay-Medium',
                                                fontSize: 13,
                                                color: '#FFF'
                                            }}>{item.description}</Text>
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
                                                <Icon name="timer" color="#FFF" size={20} />
                                                <Text numberOfLines={2} style={{
                                                    fontFamily: 'SFProDisplay-Medium',
                                                    fontSize: 13,
                                                    color: '#FFF',
                                                    marginLeft: 5
                                                }}>{item.duration > 60 ? String(moment.utc(item.duration * 1000).format('mm:ss') + ' dk.') : String(moment.utc(item.duration * 1000).format('ss') + ' sn.')}</Text>
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
                                                }}>Orta Seviye</Text>
                                            </View>
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