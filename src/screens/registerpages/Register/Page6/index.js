import React, { useState } from 'react'
import { View, Text, Pressable, SafeAreaView, Dimensions, TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import styles from './style';

const { width, height } = Dimensions.get('window');

const Page6 = ({ submitHandler, handleGoBack }) => {
    const [Nutrition, setNutrition] = useState([
        { value: 0, name: "Normal", checked: true },
        { value: -1, name: "Vejetaryen", checked: false }
    ]);

    const handleSubmit = () => {
        const nutrition = Nutrition.filter(tg => tg.checked);
        submitHandler(nutrition);
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
                    <Text style={[styles.headerText, { fontSize: 20, fontWeight: 'bold' }]}>Beslenme programınızın temel içeriği nasıl olsun?</Text>
                    {Nutrition.map((item, index) => (
                        <TouchableOpacity
                            onPress={() => {
                                const newValue = Nutrition.map((checkbox, i) => {
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

                                setNutrition(newValue);
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

export default Page6;