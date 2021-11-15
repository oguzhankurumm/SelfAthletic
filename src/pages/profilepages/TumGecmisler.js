import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, Dimensions, ImageBackground, SafeAreaView, FlatList, Image, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import SpinnerLoading from '../../components/SpinnerLoading';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon2 from 'react-native-vector-icons/FontAwesome5';
import { database } from '../../config/config';
import moment from 'moment';
import { SCLAlert, SCLAlertButton } from 'react-native-scl-alert';
import OlcumGecmisi from '../profilepages/OlcumGecmisi';
import TestGecmisi from '../profilepages/TestGecmisi';


const { height, width } = Dimensions.get("window");

const TumGecmisler = ({ navigation }) => {
    const userData = useSelector(state => state.authReducer.currentUser);
    const [Loading, setLoading] = useState(true);

    const [Waters, setWaters] = useState([]);

    const [ShowAlert, setShowAlert] = useState(false);
    const [ShowSuccessAlert, setShowSuccessAlert] = useState(false);
    const [SelectedKey, setSelectedKey] = useState("")

    const [SelectedPage, setSelectedPage] = useState(0);

    const getFavorites = async () => {
        setLoading(true);
        var waterList = [];

        await database().ref(`users/${userData.userId}/waters`).once("value")
            .then((snapshot) => {
                if (snapshot.val() !== undefined && snapshot.val() !== null) {
                    snapshot.forEach((item) => {
                        waterList.push({
                            ...item.val(),
                            id: item.key
                        });
                    })

                    setWaters(waterList.sort((a, b) => b.date.localeCompare(a.date)))
                    setLoading(false);
                } else {
                    setWaters([]);
                    setLoading(false);
                }
            })
            .catch((err) => {
                setWaters([]);
                setLoading(false);
            })
    }

    useEffect(() => {
        getFavorites();
    }, [])

    const deleteFav = id => {
        database().ref(`users/${userData.userId}/waters/`).child(id).remove()
            .then(() => {
                setWaters(Waters.filter(q => q.id !== id))
                setShowAlert(false);
                setTimeout(() => {
                    setShowSuccessAlert(true);
                }, 300);
            })
            .catch((err) => {
                console.log('err: ', err)
            })
    }

    return (
        <ImageBackground style={{ height: height, width: width }} resizeMode="cover" source={require('../../img/bg.jpg')}>
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="light-content" />
                <SpinnerLoading Loading={Loading} />

                <View style={styles.header} >
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                        <Icon name="keyboard-arrow-left" color="#FFF" size={42} style={{ marginRight: 15 }} />
                        <Text style={styles.headerText}>Tüm Geçmiş</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: 30, paddingHorizontal: 20 }}>
                    <TouchableOpacity
                        onPress={() => setSelectedPage(0)}
                        style={SelectedPage !== 0 ? styles.touchableStyle : [styles.touchableStyle, { backgroundColor: '#202026' }]}>
                        <Text style={styles.touchableText}>Su</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => setSelectedPage(1)}
                        style={SelectedPage !== 1 ? styles.touchableStyle : [styles.touchableStyle, { backgroundColor: '#202026' }]}>
                        <Text style={styles.touchableText}>Ölçüm</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => setSelectedPage(2)}
                        style={SelectedPage !== 2 ? styles.touchableStyle : [styles.touchableStyle, { backgroundColor: '#202026' }]}>
                        <Text style={styles.touchableText}>Test</Text>
                    </TouchableOpacity>
                </View>

                <SCLAlert
                    onRequestClose={() => setShowAlert(false)}
                    theme="danger"
                    show={ShowAlert}
                    title="Suyu Sil"
                    subtitle="Su silinsin mı?"
                >
                    <SCLAlertButton theme="danger" onPress={() => deleteFav(SelectedKey)}>Evet</SCLAlertButton>
                    <SCLAlertButton theme="default" onPress={() => setShowAlert(!ShowAlert)}>Vazgeç</SCLAlertButton>
                </SCLAlert>

                <SCLAlert
                    onRequestClose={() => setShowSuccessAlert(false)}
                    theme="success"
                    show={ShowSuccessAlert}
                    title="Başarılı"
                    subtitle="Su başarıyla silindi."
                >
                    <SCLAlertButton theme="success" onPress={() => setShowSuccessAlert(false)}>Tamam</SCLAlertButton>
                </SCLAlert>

                {SelectedPage === 0 &&
                    <View style={{ width: '100%', marginTop: 20, paddingHorizontal: 20 }}>
                        {!Loading && Waters.length >= 1 ?
                            <FlatList
                                style={{ paddingBottom: 20, width: '100%', height: '100%' }}
                                scrollEnabled={true}
                                showsHorizontalScrollIndicator={false}
                                showsVerticalScrollIndicator={false}
                                data={Waters}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item, index }) => {
                                    return (
                                        <View
                                            style={{
                                                backgroundColor: '#202026',
                                                padding: 15,
                                                marginBottom: 10,
                                                flexDirection: 'row',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                height: 'auto',
                                                width: '100%',
                                                borderRadius: 18
                                            }}>

                                            <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 }}>
                                                <Image source={require('../../img/suicon.png')} width={50} height={50} resizeMode="contain" style={{ width: 50, height: 50 }} />
                                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                                    <View>
                                                        <View style={{ marginBottom: 10, flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
                                                            <Text style={{
                                                                textAlign: 'left',
                                                                fontFamily: 'SFProDisplay-Bold',
                                                                fontSize: 18,
                                                                color: '#FFF'
                                                            }}>{item.value} {item.type === 0 ? "Bardak" : item.type === 1 ? "Litre" : "Şişe"}</Text>
                                                        </View>

                                                        <Text style={{
                                                            fontFamily: 'SFProDisplay-Medium',
                                                            fontSize: 14,
                                                            color: '#FFF',
                                                        }}>{moment(item.date, "DD/MM/YYYYTHH:mm:ss").format('lll')}</Text>
                                                    </View>
                                                </View>

                                                <View style={{ flexDirection: 'row' }}>
                                                    <Icon2 onPress={() => {
                                                        setSelectedKey(item.id);
                                                        setShowAlert(!ShowAlert);
                                                    }} size={20} color="#F1F1F1" name="minus-circle" />
                                                </View>

                                            </View>

                                        </View>
                                    )
                                }}
                            />
                            : <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: 50 }}>
                                <Text style={styles.headerText}>Henüz içilen su eklenmemiş.</Text>
                            </View>
                        }
                    </View>
                }

                {SelectedPage === 1 &&
                    <OlcumGecmisi />
                }

                {SelectedPage === 2 &&
                    <TestGecmisi />
                }
            </SafeAreaView >
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
    touchableText: {
        textAlign: 'center',
        fontFamily: 'SFProDisplay-Medium',
        fontSize: 14,
        color: '#FFF'
    },
    touchableStyle: {
        width: '33%',
        marginHorizontal: 1,
        paddingVertical: 10,
        paddingHorizontal: 5,
        borderRadius: 12
    }
})
export default TumGecmisler;