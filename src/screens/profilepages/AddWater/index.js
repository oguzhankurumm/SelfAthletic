import React, { useState } from 'react'
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import styles from './style';
import moment from 'moment';
import 'moment/locale/tr';
import { useSelector } from 'react-redux';
import { firestore } from '../../../config/config';
import { showMessage } from 'react-native-flash-message';
import ImageLayout from '../../../components/image-layout';
import BottomButton from '../../../components/bottom-button';

const AddWater = ({ navigation }) => {
    const [Loading, setLoading] = useState(false);
    const profileData = useSelector(state => state.authReducer.currentUser);
    const [WaterType, setWaterType] = useState(0);
    const [WaterValue, setWaterValue] = useState("");


    const AddWater = async () => {
        setLoading(true);
        const date = moment().format("DD-MM-YYYYTHH:mm:ss");

        const obj = {
            value: parseFloat(WaterValue),
            type: parseFloat(WaterType),
            date: date
        }

        if (WaterValue !== "" && WaterValue > 0) {
            try {
                await firestore().collection('users').doc(profileData.userId).collection('waters').add(obj);
                setWaterValue("");
                setLoading(false);
                showMessage({
                    message: "Başarılı",
                    description: "İçtiğiniz su değeri başarıyla kaydedildi",
                    type: "success",
                    duration: 3000
                })
            } catch (error) {
                setLoading(false);
                showMessage({
                    message: "Hata",
                    description: "Su eklenirken bir hata oluştu",
                    type: "danger",
                    icon: "danger",
                    duration: 3000
                })
            }
        } else {
            setLoading(false);
            showMessage({
                message: "Hata",
                description: "Lütfen tüm bilgileri eksiksiz girin",
                type: "danger",
                icon: "danger",
                duration: 3000
            })
        }
    }


    return (
        <ImageLayout
            title="Su Ekle"
            showBack
            isScrollable={false}
            Loading={Loading}
        >
            <View style={{ flex: 1, paddingHorizontal: 20 }}>
                <View style={{ width: '100%', marginTop: 30 }}>
                    <Text style={[styles.headerText, { fontSize: 16 }]}>İçmeniz gereken su, Dünya Sağlık Örgütü'nün önerisi doğrultusunda {parseFloat(parseFloat(profileData.values.weight) * parseFloat(0.0350)).toFixed(2)} litre olarak hesaplanmıştır.</Text>
                </View>

                <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: 30 }}>
                    <TouchableOpacity
                        onPress={() => setWaterType(0)}
                        style={WaterType !== 0 ? styles.touchableStyle : styles.touchableStyleSelected}>
                        <Text style={WaterType !== 0 ? styles.touchableText : styles.touchableTextSelected}>Bardak (0.2L)</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => setWaterType(1)}
                        style={WaterType !== 1 ? styles.touchableStyle : styles.touchableStyleSelected}>
                        <Text style={WaterType !== 1 ? styles.touchableText : styles.touchableTextSelected}>Litre</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => setWaterType(2)}
                        style={WaterType !== 2 ? styles.touchableStyle : styles.touchableStyleSelected}>
                        <Text style={WaterType !== 2 ? styles.touchableText : styles.touchableTextSelected}>Şişe (0.5L)</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: 30 }}>
                    <Text style={styles.inputTitle}>Ne kadar su içtin?</Text>
                    <TextInput
                        style={styles.input}
                        textAlign="left"
                        placeholderTextColor="#FFF"
                        allowFontScaling={false}
                        maxLength={4}
                        value={WaterValue}
                        placeholder={WaterType === 0 ? "Bardak" : WaterType === 1 ? "Litre" : "Şişe"}
                        returnKeyType={"done"}
                        onChangeText={text => setWaterValue(parseFloat(text))}
                        keyboardType="decimal-pad"
                    />
                </View>

            </View>

            <BottomButton
                onPress={AddWater}
                title="Su Ekle"
            />
        </ImageLayout >
    )
}

export default AddWater;