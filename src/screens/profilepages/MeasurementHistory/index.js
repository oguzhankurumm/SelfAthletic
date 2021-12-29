import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, FlatList, Image } from 'react-native';
import { useSelector } from 'react-redux';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { firestore } from '../../../config/config';
import moment from 'moment';
import { SCLAlert, SCLAlertButton } from 'react-native-scl-alert'
import Modal from 'react-native-modal';
import { showMessage } from 'react-native-flash-message';
import styles from './style';

const MeasurementHistory = () => {
    const userData = useSelector(state => state.authReducer.currentUser);
    const [Loading, setLoading] = useState(true);
    const [MeasurementList, setMeasurementList] = useState([]);
    const [ShowAlert, setShowAlert] = useState(false);
    const [SelectedKey, setSelectedKey] = useState("");
    const [SelectedMeasurement, setSelectedMeasurement] = useState([])
    const [ShowPopup, setShowPopup] = useState(false);

    const getMeasurements = async () => {
        try {
            setLoading(true);
            const measurementRef = await firestore().collection('users').doc(userData.userId).collection('measurements').orderBy('date', 'desc').get()
            const data = measurementRef.docs.map(doc => {
                return {
                    id: doc.id,
                    ...doc.data()
                }
            })
            setMeasurementList(data.sort((a, b) => b.date.localeCompare(a.date)))
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    }

    useEffect(() => {
        getMeasurements();
    }, [])

    const deleteMeasurement = async id => {
        setShowAlert(false);
        try {
            await firestore().collection('users').doc(userData.userId).collection('measurements').doc(id).delete()
            setMeasurementList(MeasurementList.filter(q => q.id !== id))
            showMessage({
                message: "Başarılı",
                description: 'Ölçüm silindi.',
                type: "success",
                icon: "success",
                duration: 3000
            })
        } catch (error) {
            console.log('ölçüm silinemedi', error);
        }
    }

    const ModalView = () => (
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
            <View style={styles.modalContainer}>
                {
                    Object.values(SelectedMeasurement.values) !== undefined && Object.values(SelectedMeasurement.values).map((opt) => {
                        return (
                            <View style={styles.titleContainer}>
                                <Text style={styles.nameText}>{opt.title}:</Text>
                                <Text style={styles.meterTitle}>{opt.value} cm</Text>
                            </View>
                        )
                    })
                }
                <TouchableOpacity onPress={() => setShowPopup(!ShowPopup)} style={{ paddingTop: 20 }}>
                    <Text style={styles.closeText}>Kapat</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    )
    return (
        <View style={styles.container}>
            <SCLAlert
                onRequestClose={() => setShowAlert(false)}
                theme="danger"
                show={ShowAlert}
                title="Ölçümü Sil"
                subtitle="Ölçüm silinsin mı?"
            >
                <SCLAlertButton theme="danger" onPress={() => deleteMeasurement(SelectedKey)}>Evet</SCLAlertButton>
                <SCLAlertButton theme="default" onPress={() => setShowAlert(!ShowAlert)}>Vazgeç</SCLAlertButton>
            </SCLAlert>
            <ModalView />
            {!Loading &&
                <FlatList
                    style={styles.list}
                    scrollEnabled={true}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    data={MeasurementList}
                    keyExtractor={item => item.name}
                    ListEmptyComponent={() => (
                        <View style={styles.nullContainer}>
                            <Text style={styles.text}>Henüz ölçüm eklenmemiş.</Text>
                        </View>
                    )}
                    renderItem={({ item, index }) => {
                        return (
                            <View key={index} style={styles.itemContainer}>
                                <View style={styles.subContainer}>
                                    <Image source={require('../../../assets/img/mezuraicon.png')} width={50} height={50} resizeMode="contain" style={{ width: 50, height: 50 }} />
                                    <View style={styles.leftContainer}>
                                        <Text style={styles.date}>{moment(item.date, "DD/MM/YYYYTHH:mm:ss").format('ll')}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <FontAwesome5 onPress={() => {
                                            setSelectedKey(item.id);
                                            setShowAlert(!ShowAlert);
                                        }} size={22} color="#F1F1F1" name="minus-circle" />
                                        <FontAwesome5 onPress={() => {
                                            setSelectedMeasurement(item);
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

            }
        </View>
    )
}

export default MeasurementHistory;