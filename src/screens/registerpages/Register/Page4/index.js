import React, { useState } from 'react'
import { View, Text, Pressable, SafeAreaView, Dimensions, TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import styles from './style';

const { width, height } = Dimensions.get('window');

const Page4 = ({ submitHandler, handleGoBack }) => {
    const [HealthProblems, setHealthProblems] = useState([
        { value: "Diyabet/İnsülin Direnci", name: "Diyabet/İnsülin Direnci", checked: false },
        { value: "Yüksek Tansiyon", name: "Yüksek Tansiyon", checked: false },
        { value: "Tiroid", name: "Tiroid", checked: false },
        { value: "Kalp-Damar Hastalıkları", name: "Kalp-Damar Hastalıkları", checked: false },
        { value: "Hiçbiri", name: "Hiçbiri", checked: true }
    ]);

    const handleSubmit = () => {
        const problem = HealthProblems.filter(tg => tg.checked)
        submitHandler(problem);
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
                    <Text style={[styles.headerText, { fontSize: 20, fontWeight: 'bold' }]}>Herhangi bir sağlık probleminiz var mı?</Text>
                    {HealthProblems.map((item, index) => (
                        <TouchableOpacity
                            onPress={() => {
                                const newValue = HealthProblems.map((checkbox, i) => {
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

                                setHealthProblems(newValue);
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

export default Page4;