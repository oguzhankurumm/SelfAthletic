import React, { useState } from 'react'
import { View, Text, ImageBackground, StyleSheet, SafeAreaView, TouchableOpacity, Dimensions, Alert } from 'react-native'
import SpinnerLoading from '../../components/SpinnerLoading';
import Icon from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';
import 'moment/locale/tr';
import { useSelector } from 'react-redux';
import { Card } from 'native-base';
import { KeyboardAwareView } from 'react-native-keyboard-aware-view';
import { database2, auth2 } from '../../config/config';
import Input from '../../components/Input';

const { height, width } = Dimensions.get("window");

const HedefAyarlari = ({ navigation }) => {
    moment.locale('tr');

    const profileData = useSelector(state => state.user.users);
    const [Loading, setLoading] = useState(false);
    const [Steps, setSteps] = useState(profileData.targets?.step !== undefined ? profileData.targets?.step : 0)
    const [Calories, setCalories] = useState(profileData.targets?.calorie !== undefined ? profileData.targets.calorie : 0)

    const onSave = () => {
        setLoading(true);
        database2.ref('users/' + profileData.userId + '/targets').update({
            calorie: parseFloat(Calories),
            step: parseFloat(Steps)
        }).then(() => {
            setLoading(false);
            setTimeout(() => {
                Alert.alert('Başarılı', 'Değişiklikler başarıyla kaydedildi.', [
                    { text: 'Geri Dön', onPress: () => navigation.goBack(), style: 'default' },
                    { text: 'Kapat', style: 'cancel' }
                ])
            }, 200);
        }).catch((err) => {
            setLoading(false);
            setTimeout(() => {
                Alert.alert('Hata', String(err.message))
            }, 200);
        })
    }

    return (
        <ImageBackground style={{ height: height, width: width }} resizeMode="cover" source={require('../../img/bg.jpg')}>
            <KeyboardAwareView animated={true} style={{ flex: 1 }} >

                <SafeAreaView style={styles.container}>

                    <SpinnerLoading Loading={Loading} />

                    <View style={styles.header} >
                        <TouchableOpacity onPress={() => navigation.goBack()} style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                            <Icon name="keyboard-arrow-left" color="#FFF" size={42} style={{ marginRight: 15 }} />
                            <Text style={styles.headerText}>Hedef Ayarları</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.container}>
                        <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%', paddingHorizontal: 20, marginTop: 10 }}>
                            <Text style={styles.textStyleHeader}>Adım Sayısı</Text>
                            <Card style={styles.textContainer}>
                                <Input
                                    style={styles.registerTextInput}
                                    autoCorrect={false}
                                    autoCapitalize="none"
                                    allowFontScaling={false}
                                    maxLength={6}
                                    placeholder="Adım"
                                    returnKeyType={"done"}
                                    value={String(Steps)}
                                    onChangeText={steps => setSteps(steps)}
                                    keyboardType="decimal-pad"
                                />
                            </Card>
                        </View>

                        <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%', paddingHorizontal: 20, marginTop: 10 }}>
                            <Text style={styles.textStyleHeader}>Kalori</Text>
                            <Card style={styles.textContainer}>
                                <Input
                                    style={styles.registerTextInput}
                                    autoCorrect={false}
                                    autoCapitalize="none"
                                    allowFontScaling={false}
                                    maxLength={6}
                                    placeholder="Kalori"
                                    returnKeyType={"done"}
                                    value={String(Calories)}
                                    onChangeText={calorie => setCalories(calorie)}
                                    keyboardType="decimal-pad"
                                />
                            </Card>
                        </View>
                    </View>

                </SafeAreaView>
                <View style={{ width: '100%', justifyContent: 'space-between', flexDirection: 'row' }}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={[styles.bottomButton, { backgroundColor: '#000' }]}>
                        <Text style={{
                            fontFamily: 'SFProDisplay-Bold',
                            justifyContent: 'flex-start',
                            fontSize: 16,
                            color: '#FFF',
                            marginRight: 5
                        }}>Vazgeç</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => onSave()}
                        style={styles.bottomButton}>
                        <Text style={{
                            fontFamily: 'SFProDisplay-Bold',
                            justifyContent: 'flex-start',
                            fontSize: 16,
                            color: '#000',
                            marginRight: 5
                        }}>Kaydet</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAwareView>
        </ImageBackground >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
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
    bottomButton: {
        width: '50%',
        height: 60,
        backgroundColor: 'yellow',
        justifyContent: 'center',
        alignItems: 'center'
    },
    registerTextInput: {
        textAlign: 'center',
        width: '100%',
        padding: 20,
        color: "#2d2d2d",
        fontFamily: 'SFProDisplay-Bold',
        fontSize: 16,
        // fontFamily: "SFProDisplay-Medium",
    },
    textStyleHeader: {
        width: '100%',
        marginBottom: 5,
        color: "#FFF",
        fontFamily: 'SFProDisplay-Bold',
        fontSize: 16,
    },
    textContainer: {
        borderRadius: 12,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    }
})

export default HedefAyarlari;
