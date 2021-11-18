import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, Dimensions, ImageBackground, SafeAreaView, FlatList, Image, Alert, ScrollView } from 'react-native';
import { database } from '../../config/config';
import SpinnerLoading from '../../components/SpinnerLoading';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';

const { height, width } = Dimensions.get("window");

const WorkoutLib = props => {
    const [Loading, setLoading] = useState(true);
    const [VideoList, setVideoList] = useState([]);

    useEffect(() => {
        getWorkouts();
    }, [])

    const getWorkouts = async () => {
        setLoading(true);
        var wList = [];
        await database().ref('workouts').once('value')
            .then((snapshot) => {
                snapshot.forEach((item) => {
                    wList.push({
                        ...item.val(),
                        id: item.key
                    })
                })
                setVideoList(wList.sort((a, b) => a.name.localeCompare(b.name)))
                setLoading(false)
            })
            .catch((err) => {
                setLoading(false);
            })
    }
    return (
        <ImageBackground style={{ height: height, width: width }} resizeMode="cover" source={require('../../assets/img/bg.jpg')}>
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="light-content" />
                <SpinnerLoading Loading={Loading} />

                <View style={styles.header} >
                    <TouchableOpacity onPress={() => props.navigation.goBack()} style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                        <Icon name="keyboard-arrow-left" color="#FFF" size={42} style={{ marginRight: 15 }} />
                        <Text style={styles.headerText}>Egzersiz Kütüphanesi</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView style={{ width: '100%', marginTop: 20 }}>
                    {!Loading && VideoList.length !== 0 ?
                        <FlatList style={{ height: 'auto', paddingHorizontal: 20, marginBottom: 50, marginTop: 10 }}
                            scrollEnabled={false}
                            showsVerticalScrollIndicator={true}
                            data={VideoList}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={(workouts) => {
                                var item = workouts.item;
                                return (item &&
                                    <TouchableOpacity key={item.id} onPress={() => props.navigation.navigate('MoveThumb', { item: item })}
                                        style={{
                                            marginBottom: 10,
                                            backgroundColor: 'rgba(0,0,0,0.3)',
                                            padding: 20,
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            height: 'auto',
                                            width: '100%',
                                            borderRadius: 18
                                        }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                            <View>
                                                <Text style={{
                                                    fontFamily: 'SFProDisplay-Bold',
                                                    fontSize: 16,
                                                    color: '#FFF'
                                                }}>{item.name}</Text>
                                                <View style={{ marginTop: 5, flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'flex-start' }}>
                                                    <Icon name="arrow-right" color="#FFF" size={20} style={{ marginLeft: -8 }} />
                                                    <Text numberOfLines={2} style={{
                                                        fontFamily: 'SFProDisplay-Medium',
                                                        fontSize: 13,
                                                        color: '#FFF'
                                                    }}>{item.category}</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                )
                            }}
                        />
                        : <>{Loading === false ? <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={[styles.headerText, { fontSize: 14, marginTop: 50 }]}>Kütüphanede hiç egzersiz yok.</Text>
                        </View> : <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={[styles.headerText, { fontSize: 14, marginTop: 50 }]}>Egzersizler yükleniyor...</Text>
                        </View>
                        }
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
export default WorkoutLib;