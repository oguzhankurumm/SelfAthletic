import React, { useState } from 'react'
import { View, Text, Pressable } from 'react-native'
import ImageLayout from '../../../components/image-layout';
import { useSelector } from 'react-redux';
import { auth, firestore } from '../../../config/config';
import { showMessage } from 'react-native-flash-message';
import styles from './style';

const TargetSettings = ({ navigation }) => {
    const profileData = useSelector(state => state.authReducer.currentUser);
    const [Loading, setLoading] = useState(false);
    const [currentIndex, setcurrentIndex] = useState(0);
    const [Targets, setTargets] = useState([
        { name: "Yağ Oranı Azaltma", value: -1, checked: profileData?.values?.target === -1 ? true : false },
        { name: "Formda Kalma", value: 0, checked: profileData?.values?.target === 0 ? true : false },
        { name: "Kas Kütlesi Artışı", value: 1, checked: profileData?.values?.target === 1 ? true : false }
    ]);
    const [Activities, setActivities] = useState([
        { name: "Kısmen Aktif\n(Masa başı iş/ haftada 1-2 gün hareket)", value: 1.1, checked: profileData?.values?.activity === 1.1 ? true : false },
        { name: "Yeterince Aktif\n(Haftada 3 gün düzenli hareket)", value: 1.2, checked: profileData?.values?.activity === 1.2 ? true : false },
        { name: "Çok Aktif\n(Haftada 4-5 gün hareket)", value: 1.3, checked: profileData?.values?.activity === 1.3 ? true : false },
        { name: "Ağır Düzeyde Aktif\n(Haftada 6-7 gün aktif)", value: 1.4, checked: profileData?.values?.activity === 1.4 ? true : false },
        { name: "Ekstra Aktif\n(Günde 2 kez spor yapan)", value: 1.5, checked: profileData?.values?.activity === 1.5 ? true : false },
    ]);

    const showMsg = ({ message, description, type }) => {
        setLoading(false);
        showMessage({
            message,
            description,
            type: type,
            icon: type,
            hideStatusBar: true
        });
    }

    const onNext = () => {
        setcurrentIndex(currentIndex + 1);
    }

    const onBack = () => {
        setcurrentIndex(currentIndex - 1);
    }

    const onFinish = async () => {
        const selectedActivity = Activities.filter(item => item.checked === true);
        const selectedTarget = Targets.filter(item => item.checked === true);
        const gender = profileData.gender;
        const age = profileData.age;
        const weight = profileData.values.weight;
        const height = profileData.values.height;
        const faValue = selectedActivity[0].value;
        const genderValue = gender === "male" ? 5 : -161;
        const bmhValue = parseFloat(10 * parseFloat(weight)) + parseFloat(6.25 * parseFloat(height)) - parseFloat(5 * parseFloat(age)) - genderValue;
        const energy = selectedTarget[0].value === -1 ? parseInt(bmhValue * faValue) - 500 : selectedTarget[0].value === 0 ? parseInt(bmhValue * faValue) : parseInt(bmhValue * faValue) + 500;

        setLoading(true);

        try {
            const newValues = {
                target: selectedTarget[0].value,
                activity: selectedActivity[0].value,
                energy: energy,
                faValue: bmhValue,
            }
            await firestore().collection('users').doc(auth().currentUser.email).set({ values: newValues }, { merge: true });
            showMsg({ message: 'Başarılı', description: 'Hedef ayarlarınız başarıyla değiştirildi.', type: 'success' });
            navigation.goBack();
        } catch (error) {
            showMsg({ message: 'Hata', description: 'Hedef ayarlarınız kaydedilirken bir sorun oluştu.', type: 'danger' });
        }
    }

    const Page1 = () => (
        <View style={{ flex: 1, justifyContent: 'space-between' }}>
            <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                {Targets.map((item, index) => {
                    return (
                        <Pressable
                            onPress={() => {
                                const newValue = Targets.map((checkbox, i) => {
                                    if (i !== index)
                                        return {
                                            ...checkbox,
                                            checked: false,
                                        }

                                    if (i === index) {
                                        const item = {
                                            ...checkbox,
                                            checked: !checkbox.checked,
                                        }
                                        return item
                                    }

                                    return checkbox
                                })

                                setTargets(newValue);
                            }}
                            key={index}
                            style={{ marginTop: 15, width: '80%', backgroundColor: item.checked ? 'yellow' : null, borderRadius: 18, borderWidth: 1, borderColor: 'yellow', justifyContent: 'center', alignItems: 'center', padding: 15 }}>
                            <Text style={item.checked ? [styles.optionText, { color: '#000' }] : styles.optionText}>{item.name}</Text>
                        </Pressable>
                    )
                })
                }
            </View>
            <View style={{ marginHorizontal: 20 }}>
                <Pressable
                    onPress={onNext}
                    style={styles.bottomButton}>
                    <Text style={styles.buttonText}>Devam Et</Text>
                </Pressable>
            </View>
        </View>
    )

    const Page2 = () => (
        <View style={{ flex: 1, justifyContent: 'space-between' }}>
            <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                {Activities.map((item, index) => {
                    return (
                        <Pressable
                            onPress={() => {
                                const newValue = Activities.map((checkbox, i) => {
                                    if (i !== index)
                                        return {
                                            ...checkbox,
                                            checked: false,
                                        }

                                    if (i === index) {
                                        const item = {
                                            ...checkbox,
                                            checked: !checkbox.checked,
                                        }
                                        return item
                                    }

                                    return checkbox
                                })

                                setActivities(newValue);
                            }}
                            key={index}
                            style={{ marginTop: 15, width: '80%', backgroundColor: item.checked ? 'yellow' : null, borderRadius: 18, borderWidth: 1, borderColor: 'yellow', justifyContent: 'center', alignItems: 'center', padding: 15 }}>
                            <Text style={item.checked ? [styles.optionText, { color: '#000' }] : styles.optionText}>{item.name}</Text>
                        </Pressable>
                    )
                })
                }
            </View>
            <View style={styles.bottom50Container}>
                <Pressable
                    onPress={onBack}
                    style={styles.bottomButton50}>
                    <Text style={styles.buttonText}>Geri Dön</Text>
                </Pressable>
                <Pressable
                    onPress={onFinish}
                    style={styles.bottomButton50}>
                    <Text style={styles.buttonText}>Kaydet</Text>
                </Pressable>
            </View>
        </View>
    )

    return (
        <ImageLayout
            title="Hedef Ayarları"
            Loading={Loading}
            showBack
            isScrollable={false}
        >
            {currentIndex === 0 ? <Page1 /> : <Page2 />}
        </ImageLayout>
    )
}

export default TargetSettings;