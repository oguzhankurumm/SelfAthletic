import React, { useState, useEffect } from 'react'
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import SpinnerLoading from '../../../components/SpinnerLoading';
import { firestore } from '../../../config/config';
import styles from './style';
import moment from 'moment';
import Icon2 from 'react-native-vector-icons/FontAwesome5';
import Modal from 'react-native-modal';

const TestHistory = ({ navigation }) => {
    const userData = useSelector(state => state.authReducer.currentUser);
    const [Loading, setLoading] = useState(true);

    const [TestList, setTestList] = useState([]);
    const [SelectedTest, setSelectedTest] = useState([])
    const [ShowPopup, setShowPopup] = useState(false);

    const getTests = async () => {
        setLoading(true);

        try {
            const testRef = await firestore().collection('users').doc(userData.userId).collection('tests').get();
            const testList = testRef.docs.map(doc => {
                return {
                    ...doc.data(),
                    id: doc.id
                }
            });
            setTestList(testList.sort((a, b) => b.date.localeCompare(a.date)));
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    }

    useEffect(() => {
        getTests();
    }, [])

    const GetPoint = (point) => {
        if (point <= 10000) {
            return "Seviye 1"
        } else if (point >= 10001 && point <= 15000) {
            return "Seviye 2"
        } else if (point >= 15000) {
            return "Seviye 3"
        }
    }

    return (
        <>
            <SpinnerLoading Loading={Loading} />
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

                    <View style={{ flexDirection: 'row', paddingVertical: 10, justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <Text style={{
                            textAlign: 'left',
                            fontFamily: 'SFProDisplay-Bold',
                            fontSize: 18,
                            color: '#FFF'
                        }}>Toplam Tekrar Sayısı:</Text>
                        <Text style={{
                            textAlign: 'left',
                            fontFamily: 'SFProDisplay-Medium',
                            fontSize: 18,
                            color: '#FFF'
                        }}>{SelectedTest.reps}</Text>
                    </View>

                    <View style={{ flexDirection: 'row', paddingVertical: 10, justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <Text style={{
                            textAlign: 'left',
                            fontFamily: 'SFProDisplay-Bold',
                            fontSize: 18,
                            color: '#FFF'
                        }}>Süre:</Text>
                        <Text style={{
                            textAlign: 'left',
                            fontFamily: 'SFProDisplay-Medium',
                            fontSize: 18,
                            color: '#FFF'
                        }}>{moment.utc(SelectedTest.time * 1000).format('mm:ss')} dk.</Text>
                    </View>

                    <View style={{ flexDirection: 'row', paddingVertical: 10, justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                        <Text style={{
                            textAlign: 'left',
                            fontFamily: 'SFProDisplay-Bold',
                            fontSize: 18,
                            color: '#FFF'
                        }}>Test Sonucu:</Text>
                        <Text style={{
                            textAlign: 'left',
                            fontFamily: 'SFProDisplay-Medium',
                            fontSize: 18,
                            color: '#FFF'
                        }}>{GetPoint(SelectedTest.point)}</Text>
                    </View>


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
            <View style={{ width: '100%', marginTop: 20, paddingHorizontal: 20 }}>
                {!Loading && TestList.length >= 1 ?
                    <FlatList
                        style={{ paddingBottom: 20, width: '100%', height: '100%' }}
                        scrollEnabled={true}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        data={TestList}
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
                                        <Image source={require('../../../assets/img/seviyeicon.png')} width={50} height={50} resizeMode="contain" style={{ width: 50, height: 50 }} />
                                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                            <Text style={{
                                                fontFamily: 'SFProDisplay-Bold',
                                                fontSize: 18,
                                                color: '#FFF'
                                            }}>{moment(item.date, "DD/MM/YYYYTHH:mm:ss").format('ll')}</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Icon2 onPress={() => {
                                                setSelectedTest(item);
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
                        <Text style={styles.headerText}>Henüz teste girilmemiş.</Text>
                    </View>
                }
            </View>
        </>
    )
}

export default TestHistory;