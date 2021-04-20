import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, StatusBar, Image, SafeAreaView, ScrollView, Alert, TouchableOpacity, ImageBackground, TouchableHighlight, Dimensions, FlatList } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SpinnerLoading from '../../components/SpinnerLoading';
import axios from 'axios';
import moment from 'moment';
import { database2, auth2 } from '../../config/config';
import { useSelector } from 'react-redux';

const { height, width } = Dimensions.get("window");


const WorkoutDetails = props => {
    const userData = useSelector(state => state.user.users)

    const [Loading, setLoading] = useState(true);
    const [Workouts, setWorkouts] = useState(props.route.params.item);
    const [Movements, setMovements] = useState(props.route.params.item.movements !== null && props.route.params.item.movements !== undefined ? Object.values(props.route.params.item.movements) : [])
    const [VideoList, setVideoList] = useState([]);
    const [TotalHours, setTotalHours] = useState(0);

    const [isFavorited, setisFavorited] = useState(false);

    const addFavorites = () => {
        database2.ref('users').child(auth2.currentUser.uid + '/favorites/workouts').child(Workouts.id).set({
            date: moment().format("DD/MM/YYYYTHH:mm:ss"),
            id: Workouts.id,
            workouttype: 'wod'
        })
            .then(() => setisFavorited(true))
            .catch((err) => setisFavorited(false))
    }
    const removeFavorites = () => {
        database2.ref('users').child(auth2.currentUser.uid + '/favorites/workouts').child(Workouts.id).remove()
            .then(() => setisFavorited(false))
            .catch((err) => setisFavorited(true))
    }

    const getFavorites = () => {
        if (userData.favorites !== undefined && userData.favorites !== null) {
            Object.values(userData.favorites).forEach((item) => {
                if (Object.keys(item) === Workouts.id) {
                    setisFavorited(true);
                } else {
                    setisFavorited(true);
                }
            })
        } else {
            setisFavorited(false);
        }
    }

    const getVideo = () => {
        let videoList = [];

        Movements.forEach((move) => {
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

                        let drt = videoList.reduce(function (prev, current) {
                            return prev + +parseFloat(current.duration)
                        }, 0);

                        setTotalHours(moment.utc(drt * 1000).format('HH:mm:ss'));
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

        if (Workouts.length !== 0 && Movements.length !== 0) {
            getVideo();
            getFavorites();
        } else {
            setLoading(false);
            setTimeout(() => {
                Alert.alert('Hata', 'Bu antrenmandan hiç video yok.')
            }, 400);
        }
    }, [])

    return (
        <ImageBackground style={{ height: height, width: width }} resizeMode="cover" source={require('../../img/bg.jpg')}>

            <SafeAreaView style={styles.container}>
                <SpinnerLoading Loading={Loading} />


                <View style={styles.header} >
                    <TouchableOpacity onPress={() => props.navigation.goBack()} style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                        <Icon name="keyboard-arrow-left" color="#FFF" size={42} style={{ marginRight: 15 }} />
                        <Text style={styles.headerText}>Antrenman</Text>
                    </TouchableOpacity>

                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>

                        <TouchableHighlight onPress={() => props.navigation.navigate('FeedList')}>
                            <Icon name="comment" color="#FFF" size={28} style={{ marginRight: 20 }} />
                        </TouchableHighlight>

                        <TouchableHighlight onPress={() => props.navigation.navigate('Settings')}>
                            <Icon name="settings" color="#FFF" size={28} />
                        </TouchableHighlight>

                    </View>
                </View>

                <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} style={styles.container}>
                    <StatusBar barStyle="light-content" />

                    <View style={{ justifyContent: 'center', alignItems: 'center', paddingHorizontal: 30, marginTop: 20 }}>

                        {!Loading &&
                            <>
                                <View onPress={() => Alert.alert(String(Workouts.id))}
                                    style={{
                                        height: 'auto',
                                        width: '100%',
                                        borderRadius: 18
                                    }}>
                                    <Image
                                        resizeMode="cover"
                                        source={{ uri: Workouts.image }}
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
                                    <View style={{ position: 'absolute', top: 15, paddingHorizontal: 20 }}>
                                        <Text style={{
                                            fontFamily: 'SFProDisplay-Bold',
                                            fontSize: 20,
                                            color: '#FFF',
                                            marginBottom: 8
                                        }}>{Workouts.title}</Text>
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
                                            }}>{String(TotalHours)}</Text>
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
                                            }}>{String(parseFloat(Workouts.calories).toFixed(0))} kcal</Text>
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
                                            }}>{String(parseFloat(Workouts.point).toFixed(0))}</Text>
                                        </View>

                                        {/* {Workouts.level === 0 &&
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
                                                }}>Başlangıç</Text>
                                            </View>
                                        }

                                        {Workouts.level === 1 &&
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
                                                }}>Orta</Text>
                                            </View>
                                        }

                                        {Workouts.level === 2 &&
                                            <View style={{
                                                flexDirection: 'row',
                                                justifyContent: 'center',
                                                alignItems: 'center'
                                            }}>
                                                <Icon name="bar-chart" color="#FFF" size={20} />
                                                <Text style={{ fontFamily: 'SFProDisplay-Medium', fontSize: 14, color: '#FFF', marginLeft: 5 }}>Zor</Text>
                                            </View>
                                        }

                                        {Workouts.level === 3 &&
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
                                                }}>Uzman</Text>
                                            </View>
                                        } */}


                                    </View>

                                </View>

                                <View style={{ marginTop: 20, width: '100%' }}>
                                    <Text style={{
                                        fontFamily: 'SFProDisplay-Medium',
                                        fontSize: 13,
                                        color: '#D9D9D9',
                                        textAlign: 'justify'
                                    }}>{Workouts.description}
                                    </Text>
                                    <View style={{ flexDirection: 'row', marginTop: 20, justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                                        <TouchableOpacity onPress={() => isFavorited === true ? removeFavorites() : addFavorites()}
                                            style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                                            <Icon name={isFavorited === true ? "favorite" : "favorite-outline"} color="yellow" size={26} />
                                            <Text style={{
                                                fontFamily: 'SFProDisplay-Medium',
                                                fontSize: 15,
                                                color: 'yellow',
                                                marginLeft: 10
                                            }}
                                            >Favori</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity onPress={() => {
                                            if (Workouts.length !== 0 && Movements.length !== 0) {
                                                props.navigation.navigate('WorkoutVideo', { VideoList: VideoList, Workouts: Workouts })
                                            } else {
                                                Alert.alert('Hata', 'Bu antrenmanda hiç video yok.');
                                            }
                                        }}
                                            style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                                            <Text style={{
                                                fontFamily: 'SFProDisplay-Medium',
                                                fontSize: 15,
                                                color: 'yellow',
                                                marginRight: 10
                                            }}
                                            >Hemen Başla</Text>
                                            <Icon name="keyboard-arrow-right" color="yellow" size={26} />
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                <View style={{ width: '100%', marginTop: 20 }}>
                                    {!Loading && VideoList.length !== 0 && Movements.length !== 0 &&
                                        <FlatList
                                            style={{ paddingBottom: 20, width: '100%' }}
                                            scrollEnabled={true}
                                            showsHorizontalScrollIndicator={false}
                                            showsVerticalScrollIndicator={false}
                                            data={VideoList}
                                            keyExtractor={(item, index) => index.toString()}
                                            renderItem={({ item, index }) => (
                                                <TouchableOpacity
                                                    onPress={() => Alert.alert('Bilgi', String(item.info))}
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
                                                            <Text style={{
                                                                marginTop: 5,
                                                                fontFamily: 'SFProDisplay-Medium',
                                                                fontSize: 12,
                                                                color: '#FFF'
                                                            }}>{moment.utc(item.duration * 1000).format('mm:ss')} dk.</Text>

                                                        </View>
                                                    </View>

                                                </TouchableOpacity>
                                            )}

                                        />
                                    }
                                </View>
                            </>
                        }
                    </View>
                </ScrollView>
            </SafeAreaView>
        </ImageBackground >
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    linearGradient: {
        position: 'absolute',
        top: 0,
        width: '100%',
        height: height
    },
    titleStyle: {
        fontFamily: 'SFProDisplay-Bold',
        justifyContent: 'flex-start',
        fontSize: 22,
        color: '#FFF'
    },
    subTitleStyle: {
        fontFamily: 'SFProDisplay-Medium',
        justifyContent: 'flex-start',
        fontSize: 16,
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
    }
})

export default WorkoutDetails;