import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, Dimensions, ImageBackground, SafeAreaView, FlatList, Image, Alert } from 'react-native';
import { database } from '../../config/config';
import SpinnerLoading from '../../components/SpinnerLoading';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Modal from 'react-native-modal';

const { height, width } = Dimensions.get("window");

const LikedList = props => {
    const [Loading, setLoading] = useState(true);
    const [UserList, setUserList] = useState([]);

    useEffect(() => {
        GetUsers();
    }, [])

    const GetUsers = async () => {
        let usrArr = [];

        const users = Object.values(props.route.params.users);
        if (users.length !== 0) {
            users.forEach(usr => {
                database().ref(`users/${usr}`).once('value')
                    .then((item) => {
                        usrArr.push({
                            ...item.val(),
                            id: item.key
                        });

                        if (usrArr.length === users.length) {
                            setUserList(usrArr);
                            setLoading(false);
                        }

                    })
                    .catch((err) => {
                        setLoading(false);
                    })
            })
        }
    }
    return (
        <ImageBackground style={{ height: height, width: width }} resizeMode="cover" source={require('../../assets/img/bg.jpg')}>
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="light-content" />
                <SpinnerLoading Loading={Loading} />

                <View style={styles.header} >
                    <TouchableOpacity onPress={() => props.navigation.goBack()} style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                        <Icon name="keyboard-arrow-left" color="#FFF" size={42} style={{ marginRight: 15 }} />
                        <Text style={styles.headerText}>Beğenenler</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ width: '100%' }}>
                    {!Loading && UserList.length > 0 ?
                        <FlatList style={{ height: 'auto', paddingHorizontal: 20, marginBottom: 50 }}
                            scrollEnabled={true}
                            showsVerticalScrollIndicator={true}
                            data={UserList}
                            keyExtractor={(item, index) => index.toString()}
                            ListHeaderComponent={() => {
                                return (
                                    <View style={{ flexDirection: 'row', borderTopLeftRadius: 12, borderTopRightRadius: 12, paddingVertical: 10, width: '100%', justifyContent: 'center', alignItems: 'center' }} />
                                )
                            }}
                            renderItem={(food) => {
                                var item = food.item;
                                return (item &&
                                    <View key={item.id} style={{
                                        padding: 10,
                                        flexDirection: 'row',
                                        justifyContent: 'flex-start',
                                        alignItems: 'center',
                                        height: 'auto',
                                        width: '100%'
                                    }}>
                                        <Image style={{ height: 40, width: 40, borderRadius: 50 }} resizeMode="cover" width={40} height={40} source={{ uri: item.profile_picture !== undefined && item.profile_picture !== "" ? item.profile_picture : 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png' }} />
                                        <Text style={styles.foodName}>{item.name}</Text>
                                    </View>
                                )
                            }}
                        />
                        : <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={[styles.headerText, { fontSize: 14, marginTop: 50 }]}>Henüz hiç beğeni yok.</Text>
                        </View>
                    }
                </View>
            </SafeAreaView>
        </ImageBackground >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
    popupText: {
        fontFamily: 'SFProDisplay-Medium',
        fontSize: 18,
        color: '#FFF',
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
    foodName: {
        paddingLeft: 30,
        fontFamily: 'SFProDisplay-Medium',
        fontSize: 16,
        color: '#FFF'
    }
})
export default LikedList;