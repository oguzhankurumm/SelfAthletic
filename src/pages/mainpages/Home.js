import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, StatusBar, Image, SafeAreaView, Dimensions, ScrollView, Alert, TouchableOpacity, ImageBackground, TouchableHighlight } from 'react-native';
// import Slider from '../../components/Slider';
import LinearGradient from 'react-native-linear-gradient';
import { database2 } from '../../config/config';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { height, width } = Dimensions.get("window");

const Home = () => {

    const [Loading, setLoading] = useState(false);
    const [Campaigns, setCampaigns] = useState([]);
    const [Workouts, setWorkouts] = useState([])

    useEffect(() => {
        getWorkouts();
        getCampaings();
    }, [])

    const getCampaings = () => {
        database2.ref('campaigns').once("value")
            .then((item) => {
                let campList = []
                item.forEach((item) => {
                    campList.push({
                        ...item.val(),
                        id: item.key
                    })
                })
                setCampaigns(campList)
                setLoading(false);
            })
            .catch((err) => {
                setLoading(false);
                setWorkouts(null)
            })
    }

    const getWorkouts = () => {
        database2.ref('workouts').once("value")
            .then((item) => {
                let workoutList = []
                item.forEach((item) => {
                    workoutList.push({
                        ...item.val(),
                        id: item.key
                    })
                })
                setWorkouts(workoutList)
                setLoading(false);
            })
            .catch((err) => {
                setWorkouts(null)
                setLoading(false);
            })
    }

    return (
        <ImageBackground style={{ height: height, width: width }} resizeMode="cover" source={require('../../img/bg.jpg')}>

            <SafeAreaView style={styles.container}>

                <View style={styles.header} >
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                        <Icon name="grid-view" color="#FFF" size={28} style={{ marginRight: 15 }} />
                        <Text style={styles.headerText}>Ana Sayfa</Text>

                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>

                        <TouchableHighlight onPress={() => alert('feed')}>
                            <Icon name="comment" color="#FFF" size={28} style={{ marginRight: 20 }} />
                        </TouchableHighlight>

                        <TouchableHighlight onPress={() => alert('ayarlar')}>
                            <Icon name="settings" color="#FFF" size={28} />
                        </TouchableHighlight>

                    </View>
                </View>

                <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} style={styles.container}>
                    <StatusBar barStyle="light-content" />

                    <View style={{ justifyContent: 'center', alignItems: 'center', paddingHorizontal: 30 }}>

                        <View style={{ width: '100%', height: 200, borderRadius: 18, marginTop: 10, justifyContent: 'center', alignItems: 'center' }}>

                            <Image
                                resizeMode="cover"
                                source={{ uri: "https://d50b62f6164e0c4a0279-11570554cb5edae3285603e6ab25c978.ssl.cf5.rackcdn.com/html_body_blocks/images/000/018/605/original/NoEquipmentWorkout_HERO_LowRes_enadd2be3dd0ba5f2d8b12580e24ea7ee7.jpg?1596499380" }}
                                style={{ width: '100%', height: 200, borderRadius: 18 }}
                            />

                            <LinearGradient
                                start={{ x: 1, y: 1 }}
                                end={{ x: 1, y: 0 }}
                                colors={['rgba(0,0,0,0.9)', 'transparent']}
                                style={{
                                    position: 'absolute',
                                    borderRadius: 18,
                                    width: '100%',
                                    height: 200
                                }}
                            />

                            <View style={{ position: 'absolute', left: 20, bottom: 15 }}>
                                <Text style={{ fontFamily: 'SFProDisplay-Bold', fontSize: 20, color: '#FFF', marginBottom: 8 }}>Yepyeni Kampanya</Text>
                                <Text style={{ fontFamily: 'SFProDisplay-Medium', fontSize: 13, color: '#FFF' }}>SelfAthletic'de %25'e varan indirimler sizi bekliyor!</Text>
                            </View>

                        </View>
                    </View>

                    <View style={{ justifyContent: 'center', alignItems: 'center', paddingHorizontal: 30 }}>
                        <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 }}>

                            <Text style={styles.titleStyle}>Antrenmanlar</Text>

                            <TouchableOpacity
                                onPress={() => alert('go to tüm')}
                                style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text style={styles.subTitleStyle}>Tümünü Gör</Text>
                                <Icon name="keyboard-arrow-right" size={18} color="#FFF" />
                            </TouchableOpacity>

                        </View>

                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                            horizontal
                            style={{ width: '100%', height: 150, marginTop: 20 }}
                        >
                            {!Loading && Workouts.map((item, index) => {
                                return (
                                    <TouchableOpacity onPress={() => Alert.alert(String(item.id))}
                                        style={{
                                            height: 'auto',
                                            width: width / 1.17,
                                            borderRadius: 18
                                        }}>
                                        <Image
                                            resizeMode="cover"
                                            source={{ uri: item.image }}
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
                                        <View style={{ position: 'absolute', left: 20, top: 15 }}>
                                            <Text style={{
                                                fontFamily: 'SFProDisplay-Bold',
                                                fontSize: 20,
                                                color: '#FFF',
                                                marginBottom: 8
                                            }}>{item.title}</Text>
                                            <Text style={{
                                                fontFamily: 'SFProDisplay-Medium',
                                                fontSize: 13,
                                                color: '#FFF'
                                            }}>{item.description}</Text>
                                        </View>

                                        <View style={{
                                            flexDirection: 'row',
                                            position: 'absolute',
                                            left: 20,
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
                                                }}>{item.totalhours}</Text>
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
                                                    }}>Başlangıç</Text>
                                                </View>
                                            }

                                            {item.level === 1 &&
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
                                                    }}>Uzman</Text>
                                                </View>
                                            }

                                        </View>
                                    </TouchableOpacity>
                                )
                            })}
                        </ScrollView>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </ImageBackground>
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
        paddingHorizontal: 30
    },
    headerText: {
        fontFamily: 'SFProDisplay-Medium',
        fontSize: 18,
        color: '#FFF'
    }
})
export default Home;