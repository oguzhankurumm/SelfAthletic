import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, Dimensions, ImageBackground, SafeAreaView, FlatList, Image, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import SpinnerLoading from '../../components/SpinnerLoading';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon2 from 'react-native-vector-icons/FontAwesome5';
import { database } from '../../config/config';
import moment from 'moment';
import { SCLAlert, SCLAlertButton } from 'react-native-scl-alert'
import Modal from 'react-native-modal';

const { height, width } = Dimensions.get("window");

const OlcumGecmisi = ({ navigation }) => {
    const userData = useSelector(state => state.authReducer.currentUser);
    const [Loading, setLoading] = useState(true);

    const [OlcumList, setOlcumList] = useState([]);

    const [ShowAlert, setShowAlert] = useState(false);
    const [ShowSuccessAlert, setShowSuccessAlert] = useState(false);
    const [SelectedKey, setSelectedKey] = useState("");

    const [SelectedOlcum, setSelectedOlcum] = useState([])
    const [ShowPopup, setShowPopup] = useState(false);

    const getFavorites = async () => {
        setLoading(true);
        var measurementsList = [];

        await database().ref(`users/${userData.userId}/measurements`).once("value")
            .then((snapshot) => {
                if (snapshot.val() !== undefined && snapshot.val() !== null) {
                    snapshot.forEach((item) => {
                        measurementsList.push({
                            ...item.val(),
                            id: item.key
                        });
                    })

                    setOlcumList(measurementsList.sort((a, b) => b.date.localeCompare(a.date)))
                    setLoading(false);
                } else {
                    setOlcumList([]);
                    setLoading(false);
                }
            })
            .catch((err) => {
                setOlcumList([]);
                setLoading(false);
                console.log('hata: ', err)
            })
    }

    useEffect(() => {
        getFavorites();
    }, [])

    const deleteFav = id => {
        database().ref(`users/${userData.userId}/measurements/`).child(id).remove()
            .then(() => {
                setOlcumList(OlcumList.filter(q => q.id !== id))
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
        <>
            <Modal style={{ marginTop: 'auto' }}
                animationIn="fadeIn"
                animationOut="fadeOut"
                isVisible={ShowPopup}
                onBackButtonPress={() => setShowPopup(false)}
                onBackdropPress={() => setShowPopup(false)}
                animationInTiming={500}
                animationOutTiming={500}
                backdropOpacity={0.7}
            >
                <View style={{ backgroundColor: "#202026", justifyContent: 'center', alignItems: 'center', padding: 30, borderRadius: 12 }}>
                    {
                        Object.values(SelectedOlcum.values) !== undefined && Object.values(SelectedOlcum.values).map((opt) => {
                            return (
                                <View style={{ flexDirection: 'row', paddingVertical: 10, justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                    <Text style={{
                                        textAlign: 'left',
                                        fontFamily: 'SFProDisplay-Bold',
                                        fontSize: 18,
                                        color: '#FFF'
                                    }}>{opt.name}:</Text>
                                    <Text style={{
                                        textAlign: 'left',
                                        fontFamily: 'SFProDisplay-Medium',
                                        fontSize: 18,
                                        color: '#FFF'
                                    }}>{opt.value} cm.</Text>

                                </View>
                            )
                        })
                    }
                    <TouchableOpacity onPress={() => setShowPopup(!ShowPopup)} style={{ paddingTop: 20 }}>
                        <Text style={{
                            textAlign: 'center',
                            fontFamily: 'SFProDisplay-Medium',
                            fontSize: 18,
                            color: '#FFF'
                        }}>Kapat</Text>
                    </TouchableOpacity>
                </View>
            </Modal>

            <SCLAlert
                onRequestClose={() => setShowAlert(false)}
                theme="danger"
                show={ShowAlert}
                title="Ölçümü Sil"
                subtitle="Ölçüm silinsin mı?"
            >
                <SCLAlertButton theme="danger" onPress={() => deleteFav(SelectedKey)}>Evet</SCLAlertButton>
                <SCLAlertButton theme="default" onPress={() => setShowAlert(!ShowAlert)}>Vazgeç</SCLAlertButton>
            </SCLAlert>

            <SCLAlert
                onRequestClose={() => setShowSuccessAlert(false)}
                theme="success"
                show={ShowSuccessAlert}
                title="Başarılı"
                subtitle="Ölçüm başarıyla silindi."
            >
                <SCLAlertButton theme="success" onPress={() => setShowSuccessAlert(false)}>Tamam</SCLAlertButton>
            </SCLAlert>

            <View style={{ width: '100%', marginTop: 20, paddingHorizontal: 20 }}>
                {!Loading && OlcumList.length >= 1 ?
                    <FlatList
                        style={{ paddingBottom: 20, width: '100%', height: '100%' }}
                        scrollEnabled={true}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        data={OlcumList}
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
                                        <Image source={require('../../assets/img/mezuraicon.png')} width={50} height={50} resizeMode="contain" style={{ width: 50, height: 50 }} />
                                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                            <Text style={{
                                                fontFamily: 'SFProDisplay-Bold',
                                                fontSize: 18,
                                                color: '#FFF'
                                            }}>{moment(item.date, "DD/MM/YYYYTHH:mm:ss").format('ll')}</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Icon2 onPress={() => {
                                                setSelectedKey(item.id);
                                                setShowAlert(!ShowAlert);
                                            }} size={22} color="#F1F1F1" name="minus-circle" />
                                            <Icon2 onPress={() => {
                                                setSelectedOlcum(item);
                                                setTimeout(() => {
                                                    setShowPopup(true);
                                                }, 200);
                                            }} size={22} color="#F1F1F1" name="info-circle" style={{ marginLeft: 10 }} />
                                        </View>
                                    </View>
                                </View>
                            )
                        }}
                    />
                    : <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: 50 }}>
                        <Text style={styles.headerText}>Henüz ölçüm eklenmemiş.</Text>
                    </View>
                }
            </View>
        </>
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
export default OlcumGecmisi;