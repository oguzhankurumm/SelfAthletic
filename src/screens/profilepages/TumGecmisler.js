import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';
import { useSelector } from 'react-redux';
import Icon2 from 'react-native-vector-icons/FontAwesome5';
import { firestore } from '../../config/config';
import moment from 'moment';
import { SCLAlert, SCLAlertButton } from 'react-native-scl-alert';
import MeasurementHistory from '../profilepages/MeasurementHistory';
import TestHistory from '../profilepages/TestHistory';
import ImageLayout from '../../components/image-layout';
import { showMessage } from 'react-native-flash-message';

const TumGecmisler = ({ navigation }) => {
    const userData = useSelector(state => state.authReducer.currentUser);
    const [Loading, setLoading] = useState(true);
    const [Waters, setWaters] = useState([]);
    const [ShowAlert, setShowAlert] = useState(false);
    const [SelectedKey, setSelectedKey] = useState("")
    const [SelectedPage, setSelectedPage] = useState(0);

    const getWaters = async () => {
        setLoading(true);
        try {
            const waterRef = await firestore().collection('users').doc(userData.userId).collection('waters').get();
            const waterList = waterRef.docs.map(doc => {
                return {
                    ...doc.data(),
                    id: doc.id
                }
            });
            setWaters(waterList.sort((a, b) => b.date.localeCompare(a.date)));
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    }

    useEffect(() => {
        getWaters();
    }, [])

    const deleteWater = async id => {
        setShowAlert(false);
        try {
            await firestore().collection('users').doc(userData.userId).collection('waters').doc(id).delete();
            setWaters(Waters.filter(q => q.id !== id))
            showMessage({
                message: "Başarılı",
                description: "Su başarıyla silindi.",
                type: "success",
                icon: "success",
                duration: 3000
            });
        } catch (error) {
            console.log('Kayıt silinemedi.', error);
        }
    }

    return (
        <ImageLayout
            title="Tüm Geçmişler"
            showBack
            isScrollable={true}
            Loading={Loading}
        >

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
                <SCLAlertButton theme="danger" onPress={() => deleteWater(SelectedKey)}>Evet</SCLAlertButton>
                <SCLAlertButton theme="default" onPress={() => setShowAlert(!ShowAlert)}>Vazgeç</SCLAlertButton>
            </SCLAlert>


            {SelectedPage === 0 &&
                <View style={{ width: '100%', marginTop: 20, paddingHorizontal: 20 }}>
                    {!Loading &&
                        <FlatList
                            style={{ paddingBottom: 20, width: '100%', height: '100%' }}
                            scrollEnabled={true}
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                            data={Waters}
                            keyExtractor={item => item.id}
                            ListEmptyComponent={() => (
                                <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: 50 }}>
                                    <Text style={styles.headerText}>Henüz içilen su eklenmemiş.</Text>
                                </View>
                            )}
                            renderItem={({ item, index }) => {
                                return (
                                    <View key={index}
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
                                            <Image source={require('../../assets/img/suicon.png')} width={50} height={50} resizeMode="contain" style={{ width: 50, height: 50 }} />
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
                    }
                </View>
            }

            {SelectedPage === 1 && <MeasurementHistory />}
            {SelectedPage === 2 && <TestHistory />}
        </ImageLayout>
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