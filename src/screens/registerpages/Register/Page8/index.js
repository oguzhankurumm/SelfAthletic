import React, { useState } from 'react'
import { View, Text, Pressable, SafeAreaView, Dimensions, TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import styles from './style';

const { width, height } = Dimensions.get('window');

const Page8 = ({ submitHandler, handleGoBack }) => {
    const [Days, setDays] = useState([
        { name: 'Pazartesi', value: 1, checked: true },
        { name: 'Salı', value: 2, checked: false },
        { name: 'Çarşamba', value: 3, checked: true },
        { name: 'Perşembe', value: 4, checked: false },
        { name: 'Cuma', value: 5, checked: true },
        { name: 'Cumartesi', value: 6, checked: false },
        { name: 'Pazar', value: 0, checked: false },
    ])

    const handleSubmit = () => {
        const days = Days.filter(tg => tg.checked);
        submitHandler(days);
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
                    <Text style={[styles.headerText, { fontSize: 20, fontWeight: 'bold', paddingHorizontal: 10 }]}>Hangi günler antrenman yapmak istiyorsunuz?</Text>
                    {Days.map((item, index) => (
                        <TouchableOpacity
                            onPress={() => {
                                const options = Days;
                                options.forEach((newitem) => {
                                    if (newitem.checked === false) {
                                        newitem.checked === true
                                    }
                                })
                                var tempItem = item;
                                tempItem.checked = !item.checked;
                                const tempArr = [...Days];
                                setDays(tempArr);
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

export default Page8;