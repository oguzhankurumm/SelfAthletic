import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, Dimensions, ImageBackground, SafeAreaView, FlatList, Image, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import SpinnerLoading from '../../components/SpinnerLoading';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Sidebar from '../../components/Sidebar';
import moment from 'moment';

const { height, width } = Dimensions.get("window");

const FavoritedFoods = ({ navigation }) => {
    const userData = useSelector(state => state.user.users);
    const [Loading, setLoading] = useState(true);

    const [FavoritedList, setFavoritedList] = useState([]);
    const [ShowSideModal, setShowSideModal] = useState(false);

    const closeModal = () => {
        setShowSideModal(!ShowSideModal);
    }

    const getFavorites = () => {
        var favoritedList = [];

        if (userData.favorites?.foods !== undefined && userData.favorites?.foods !== null) {
            Object.keys(userData.favorites?.foods).forEach((key) => {
                Object.values(userData.favorites?.foods).forEach((item) => {
                    favoritedList[key] = item
                })
            })
            setFavoritedList(favoritedList)
            setLoading(false);
        } else {
            setFavoritedList([]);
            setLoading(false);
        }
    }

    useEffect(() => {
        getFavorites();
    }, [])

    return (
        <ImageBackground style={{ height: height, width: width }} resizeMode="cover" source={require('../../img/bg.jpg')}>
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="light-content" />
                <SpinnerLoading Loading={Loading} />
                <Sidebar navigation={navigation} opened={ShowSideModal} onClose={() => closeModal()} />

                <View style={styles.header} >
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                        <Icon name="keyboard-arrow-left" color="#FFF" size={42} style={{ marginRight: 15 }} />
                        <Text style={styles.headerText}>Favori Öğünlerim</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ width: '100%', marginTop: 20, paddingHorizontal: 20 }}>
                    {!Loading && FavoritedList.length >= 1 ?
                        <FlatList
                            style={{ paddingBottom: 20, width: '100%', height: '100%' }}
                            scrollEnabled={true}
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                            data={FavoritedList}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item, index }) => (
                                <TouchableOpacity
                                    style={{
                                        backgroundColor: 'rgba(0,0,0,0.2)',
                                        padding: 10,
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
                                            source={{ uri: item.image }}
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
                                                marginTop: 8,
                                                fontFamily: 'SFProDisplay-Medium',
                                                fontSize: 12,
                                                color: '#FFF'
                                            }}>{moment(item.date, "DD/MM/YYYYTHH:mm:ss").format('lll')}</Text>

                                        </View>
                                    </View>

                                </TouchableOpacity>
                            )}

                        />
                        : <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={styles.headerText}>Favori öğününüz yok.</Text>
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
export default FavoritedFoods;