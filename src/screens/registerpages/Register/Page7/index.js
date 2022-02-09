import React, { useState } from 'react'
import { View, Text, Pressable, SafeAreaView, Dimensions, TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import styles from './style';

const { width, height } = Dimensions.get('window');

const Page7 = ({ submitHandler, handleGoBack }) => {
    const [Aktiflik, setAktiflik] = useState([
        { value: "Kısmen Aktif\n(Masa başı iş/ haftada 1-2 gün hareket)", name: "Kısmen Aktif\n(Masa başı iş/ haftada 1-2 gün hareket)", deger: 1.1, checked: true },
        { value: "Yeterince Aktif\n(Haftada 3 gün düzenli hareket)", name: "Yeterince Aktif\n(Haftada 3 gün düzenli hareket)", deger: 1.2, checked: false },
        { value: "Çok Aktif\n(Haftada 4-5 gün hareket)", name: "Çok Aktif\n(Haftada 4-5 gün hareket)", deger: 1.3, checked: false },
        { value: "Ağır Düzeyde Aktif\n(Haftada 6-7 gün aktif)", name: "Ağır Düzeyde Aktif\n(Haftada 6-7 gün aktif)", deger: 1.4, checked: false },
        { value: "Ekstra Aktif\n(Günde 2 kez spor yapan)", name: "Ekstra Aktif\n(Günde 2 kez spor yapan)", deger: 1.5, checked: false },
    ]);

    const handleSubmit = () => {
        const aktiflik = Aktiflik.filter(tg => tg.checked);
        submitHandler(aktiflik);
    }

    return (
        <SafeAreaView style={{ height: '100%', width }}>
            <KeyboardAwareScrollView
                extraHeight={150}
                enableOnAndroid={true}
                animated={true}
                style={{ flex: 1 }}
            >
                <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                    <Text style={[styles.headerText, { fontSize: 20, fontWeight: 'bold', paddingHorizontal: 15 }]}>Günlük yaşamınızda fiziksel olarak ne kadar aktifsiniz?</Text>
                    {Aktiflik.map((item, index) => (
                        <TouchableOpacity
                            onPress={() => {
                                const newValue = Aktiflik.map((checkbox, i) => {
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

                                setAktiflik(newValue);
                            }}
                            key={index}
                            style={item.checked ? styles.optionButtonSelected : styles.optionButton}>
                            <Text style={item.checked ? [styles.optionText, { color: '#000' }] : styles.optionText}>{item.name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </KeyboardAwareScrollView>
            <View style={{ marginHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Pressable
                    onPress={handleGoBack}
                    style={styles.bottomButton}>
                    <Text style={styles.buttonText}>Geri Dön</Text>
                </Pressable>
                <Pressable
                    onPress={handleSubmit}
                    style={styles.bottomButton}>
                    <Text style={styles.buttonText}>Devam Et</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    )
}

export default Page7;