import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, Dimensions, ImageBackground, SafeAreaView, FlatList, Image, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import SpinnerLoading from '../../components/SpinnerLoading';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon2 from 'react-native-vector-icons/FontAwesome5';
import { database2 } from '../../config/config';
import moment from 'moment';
import { SCLAlert, SCLAlertButton } from 'react-native-scl-alert'

const { height, width } = Dimensions.get("window");

const SuGecmisi = ({ navigation }) => {
    const userData = useSelector(state => state.user.users);
    const [Loading, setLoading] = useState(true);

    const [Waters, setWaters] = useState([]);

    const [ShowAlert, setShowAlert] = useState(false);
    const [ShowSuccessAlert, setShowSuccessAlert] = useState(false);
    const [SelectedKey, setSelectedKey] = useState("")

    const getFavorites = async () => {
        setLoading(true);
        var waterList = [];

        await database2.ref(`users/${userData.userId}/waters`).once("value")
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
        database2.ref(`users/${userData.userId}/waters/`).child(id).remove()
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
                        <Text style={styles.headerText}>Su Geçmişi</Text>
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

                                        <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>

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
                        : <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={styles.headerText}>Henüz içilen su eklenmemiş.</Text>
                        </View>
                    }
                </View>
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
})
export default SuGecmisi;