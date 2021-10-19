import React, { useState } from 'react'
import { View, Text, ImageBackground, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Dimensions, Alert } from 'react-native'
import SpinnerLoading from '../../components/SpinnerLoading';
import Icon from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';
import 'moment/locale/tr';
import { useSelector } from 'react-redux';
import { Card, Picker } from 'native-base';
import { KeyboardAwareView } from 'react-native-keyboard-aware-view';
import { database } from '../../config/config';
import Input from '../../components/Input';
import DateTimePickerModal from "react-native-modal-datetime-picker";

const { height, width } = Dimensions.get("window");

const KisiselBilgiler = ({ navigation }) => {
    const Item = Picker.Item;

    moment.locale('tr');

    const profileData = useSelector(state => state.user.users);

    const [Name, setName] = useState(profileData.name)
    const [cinsiyet, setcinsiyet] = useState(profileData.gender);
    const [BirthDate, setBirthDate] = useState(profileData.birthdate)
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [Boy, setBoy] = useState(profileData.height ? profileData.height : 0);
    const [Kilo, setKilo] = useState(profileData.weight ? profileData.weight : 0);

    const [Loading, setLoading] = useState(false);

    const cinsiyetValueChange = value => {
        setcinsiyet(value);
    }

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
        const selectedDate = moment(date).format('DD-MM-YYYY')
        setBirthDate(selectedDate)
        hideDatePicker();
    };

    const onSave = () => {
        setLoading(true);
        database().ref('users/' + profileData.userId).update({
            name: Name,
            birthdate: BirthDate,
            gender: cinsiyet,
            height: parseFloat(Boy),
            weight: parseFloat(Kilo)
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
                            <Text style={styles.headerText}>Kişisel Bilgiler</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.container}>

                        <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%', paddingHorizontal: 20, marginTop: 10 }}>
                            <Text style={styles.textStyleHeader}>Ad Soyad</Text>
                            <Card style={styles.textContainer}>
                                <Input
                                    style={styles.registerTextInput}
                                    autoCorrect={false}
                                    autoCapitalize="none"
                                    allowFontScaling={false}
                                    maxLength={100}
                                    placeholder="Ad Soyad"
                                    returnKeyType={"done"}
                                    value={Name}
                                    onChangeText={name => setName(name)}
                                    keyboardType={"default"}
                                />
                            </Card>
                        </View>


                        <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%', paddingHorizontal: 20, marginTop: 10 }}>
                            <Text style={styles.textStyleHeader}>Boyunuz</Text>
                            <Card style={styles.textContainer}>
                                <Input
                                    style={styles.registerTextInput}
                                    autoCorrect={false}
                                    autoCapitalize="none"
                                    allowFontScaling={false}
                                    maxLength={3}
                                    placeholder="Boy"
                                    returnKeyType={"done"}
                                    value={String(Boy)}
                                    onChangeText={boy => setBoy(boy)}
                                    keyboardType="decimal-pad"
                                />
                            </Card>
                        </View>

                        <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%', paddingHorizontal: 20, marginTop: 10 }}>
                            <Text style={styles.textStyleHeader}>Kilonuz</Text>
                            <Card style={styles.textContainer}>
                                <Input
                                    style={styles.registerTextInput}
                                    autoCorrect={false}
                                    autoCapitalize="none"
                                    allowFontScaling={false}
                                    maxLength={3}
                                    placeholder="Kilo"
                                    returnKeyType={"done"}
                                    value={String(Kilo)}
                                    onChangeText={kilo => setKilo(kilo)}
                                    keyboardType="decimal-pad"
                                />
                            </Card>
                        </View>

                        <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%', paddingHorizontal: 20, marginTop: 10 }}>
                            <Text style={styles.textStyleHeader}>Cinsiyet</Text>
                            <Card style={styles.textContainer}>
                                <Picker
                                    style={{ height: 60 }}
                                    itemTextStyle={[styles.registerTextInput, { padding: 0 }]}
                                    textStyle={[styles.registerTextInput, { padding: 0 }]}
                                    iosHeader="Cinsiyet"
                                    autoCorrect={false}
                                    placeholder="Cinsiyet"
                                    mode="dropdown"
                                    headerBackButtonText="Geri"
                                    selectedValue={cinsiyet}
                                    onValueChange={(val) => cinsiyetValueChange(val)}>
                                    <Item label="Erkek" value="Erkek" />
                                    <Item label="Kadın" value="Kadın" />
                                    <Item label="Belirtmek İstemiyorum" value="Belirtmek İstemiyorum" />
                                </Picker>
                            </Card>
                        </View>

                        <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%', paddingHorizontal: 20, marginTop: 10 }}>
                            <Text style={styles.textStyleHeader}>Doğum Tarihi</Text>
                            <Card style={styles.textContainer}>
                                <TouchableOpacity style={styles.textContainer} onPress={() => setDatePickerVisibility(!isDatePickerVisible)}>
                                    <Text style={styles.registerTextInput}>{BirthDate !== undefined ? moment(BirthDate).format("DD-MM-YYYY") : moment().format("DD-MM-YYYY")}</Text>
                                </TouchableOpacity>
                                <DateTimePickerModal
                                    minimumDate={new Date("01-01-1940")}
                                    maximumDate={Date.now()}
                                    date={new Date(BirthDate)}
                                    cancelTextIOS="Vazgeç"
                                    confirmTextIOS="Tamam"
                                    headerTextIOS="Doğum tarihinizi seçin"
                                    locale="TR"
                                    isVisible={isDatePickerVisible}
                                    mode="date"
                                    onConfirm={handleConfirm}
                                    onCancel={hideDatePicker}
                                />
                            </Card>
                        </View>

                        <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%', paddingHorizontal: 20, marginTop: 10, paddingBottom: 100 }}>
                            <Text style={styles.textStyleHeader}>Kayıt Tarihi</Text>
                            <Card style={styles.textContainer}>
                                <Input editable={false}
                                    style={styles.registerTextInput}
                                    autoCorrect={false}
                                    autoCapitalize="none"
                                    allowFontScaling={false}
                                    maxLength={100}
                                    placeholder="Kayıt Tarihi"
                                    returnKeyType={"done"}
                                    value={moment(profileData.registerDate, "DD/MM/YYYYTHH:mm:ss").format('llll')}
                                    keyboardType={"default"}
                                />
                            </Card>
                        </View>

                    </ScrollView>
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
        textAlign: 'left',
        width: '100%',
        padding: 20,
        color: "#FFF",
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
        backgroundColor: '#202026',
        borderColor: '#202026'
    }
})

export default KisiselBilgiler;
