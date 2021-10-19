import React, { useState, useEffect } from 'react'
import { View, Text, ImageBackground, SafeAreaView, StyleSheet, Dimensions, StatusBar, TouchableHighlight, TouchableOpacity, Image, FlatList } from 'react-native'
import SpinnerLoading from '../../components/SpinnerLoading';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { database } from '../../config/config';
import { ListItem, Body, Left, Right } from 'native-base';

const { height, width } = Dimensions.get("window");

const StepCounter = ({ props, navigation }) => {

    const [Loading, setLoading] = useState(true);
    const profileData = useSelector(state => state.user.users);
    const [Steps, setSteps] = useState(null);

    useEffect(() => {
        let allSteps = []
        database().ref('steps').once('value').then((snapshot) => {
            snapshot.forEach((item) => {
                item.forEach((newitem) => {
                    database().ref('users').child(item.key).once('value')
                        .then((userData) => {

                            allSteps.push({
                                ...newitem.val(),
                                id: newitem.key,
                                name: String(userData.val().name),
                                userid: item.key
                            })

                            var result = [];

                            setTimeout(() => {
                                allSteps.forEach(function (obj) {
                                    var id = obj.userid
                                    if (!this[id]) result.push(this[id] = obj);
                                    else this[id].value += obj.value;
                                }, Object.create(null));

                                setSteps(result.sort((a, b) => { return b.value - a.value; }));
                                setLoading(false);
                            }, 500);
                        })
                        .catch((error) => {
                            setLoading(false);
                            console.log('get user data error');
                        })
                })
            })
        })
            .catch((err) => {
                setLoading(false);
                console.log('hata: ', err)
            })
    }, [])

    return (
        <ImageBackground style={{ height: height, width: '100%' }} resizeMode="cover" source={require('../../img/bg.jpg')}>
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="light-content" />
                <SpinnerLoading Loading={Loading} />

                <View style={styles.header} >
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                        <Icon name="keyboard-arrow-left" color="#FFF" size={42} style={{ marginRight: 15 }} />
                        <Text style={styles.headerText}>Adım Sayar</Text>
                    </TouchableOpacity>

                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>

                        <TouchableHighlight onPress={() => navigation.navigate('Feed')}>
                            <Icon name="comment" color="#FFF" size={28} style={{ marginRight: 20 }} />
                        </TouchableHighlight>

                        <TouchableHighlight onPress={() => navigation.navigate('Notifications')}>
                            <Icon name="notifications" color="#FFF" size={28} />
                        </TouchableHighlight>

                    </View>
                </View>

                <View style={{ justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, marginTop: 20 }}>

                    {!Loading &&
                        <View style={{
                            height: 200,
                            width: '100%',
                            borderRadius: 18
                        }}>
                            <Image
                                resizeMode="cover"
                                source={require('../../img/adim-sayar.jpg')}
                                style={{
                                    width: '100%',
                                    height: 200,
                                    borderRadius: 18
                                }}
                            />
                        </View>
                    }

                </View>

                <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20, paddingHorizontal: 20 }}>
                    {!Loading && Steps &&
                        <FlatList
                            style={{ paddingBottom: 20, width: '100%' }}
                            scrollEnabled={false}
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                            ListHeaderComponent={() => {
                                return (
                                    <ListItem style={{ flexDirection: 'row', marginBottom: 5, justifyContent: 'center', width: '100%' }}>
                                        <Text style={styles.userListText}>Haftalık Adım Sayar</Text>
                                    </ListItem>
                                )
                            }
                            }
                            data={Steps}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item, index }) => (
                                <ListItem key={item.id} style={{ flexDirection: 'row', marginBottom: 5, justifyContent: 'space-between', width: '100%' }}>
                                    <Text style={item.userid === profileData.userId ? styles.myListText : styles.userListText}>{index + 1}</Text>
                                    <Text style={item.userid === profileData.userId ? styles.myListText : styles.userListText}>{item.name}</Text>
                                    <Text style={item.userid === profileData.userId ? styles.myListText : styles.userListText}>{parseFloat(item.value).toFixed(0)} adım</Text>
                                </ListItem>
                            )}

                        />
                    }
                </View>

            </SafeAreaView>
        </ImageBackground >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
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
    userListText: {
        fontFamily: 'SFProDisplay-Medium',
        justifyContent: 'flex-start',
        fontSize: 16,
        color: '#9D9D9D'
    },
    myListText: {
        fontFamily: 'SFProDisplay-Medium',
        justifyContent: 'flex-start',
        fontSize: 16,
        color: '#D4DA50'
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
export default StepCounter;