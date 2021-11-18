import React, { useState, useEffect } from 'react'
import { View, Text, Pressable, SafeAreaView } from 'react-native'
import ImageLayout from '../../../components/image-layout';
import { useSelector } from 'react-redux';
import { auth, firestore } from '../../../config/config';
import { showMessage } from 'react-native-flash-message';
import { Card, Picker } from 'native-base';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import moment from 'moment';
import 'moment/locale/tr';
import Input from '../../../components/Input';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import styles from './style';

const PersonalSettings = () => {
    moment.locale('tr');
    const Item = Picker.Item;
    const profileData = useSelector(state => state.authReducer.currentUser);
    const [Loading, setLoading] = useState(false);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [firstName, setFirstName] = useState(profileData.firstName);
    const [lastName, setLastName] = useState(profileData.lastName);
    const [gender, setGender] = useState(profileData.gender);
    const [birthDate, setBirthDate] = useState(profileData.birthDate);
    const [weight, setWeight] = useState(profileData.values.weight ? profileData.values.weight : 0);
    const [height, setHeight] = useState(profileData.values.height ? [{ id: "height", value: profileData.values.height }] : 0);


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

    const onSave = async () => {
        setLoading(true);
        try {
            const profileValues = {
                firstName,
                lastName,
                birthDate: moment(birthDate).unix(),
                gender,
                values: {
                    weight: parseInt(weight),
                    height: parseInt(height)
                }
            }
            await firestore().collection('users').doc(auth().currentUser.email).set(profileValues, { merge: true });
            showMsg({ message: 'Başarılı', description: 'Kişisel bilgileriniz başarıyla kaydedildi', type: 'success' });
        } catch (error) {
            showMsg({ message: 'Hata', description: 'Kişisel bilgileriniz kaydedilirken bir hata oluştu', type: 'danger' });
        }
    }

    const handleConfirm = (date) => {
        setBirthDate(date);
        setDatePickerVisibility(false);
    };

    return (
        <ImageLayout
            title="Kişisel Bilgiler"
            Loading={Loading}
            showBack
            isScrollable={false}
        >
            <KeyboardAwareScrollView
                extraHeight={150}
                enableOnAndroid={true}
                animated={true}
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingBottom: 50 }}
            >
                <SafeAreaView style={styles.container}>
                    <View style={styles.cardContainer}>
                        <Text style={styles.textStyleHeader}>Adınız</Text>
                        <Card style={styles.textContainer}>
                            <Input
                                style={styles.textInput}
                                autoCorrect={false}
                                autoCapitalize="none"
                                allowFontScaling={false}
                                maxLength={100}
                                placeholder="Adınız"
                                returnKeyType={"done"}
                                value={firstName}
                                onChangeText={value => setFirstName(value)}
                                keyboardType={"default"}
                            />
                        </Card>
                    </View>

                    <View style={styles.cardContainer}>
                        <Text style={styles.textStyleHeader}>Soyadınız</Text>
                        <Card style={styles.textContainer}>
                            <Input
                                style={styles.textInput}
                                autoCorrect={false}
                                autoCapitalize="none"
                                allowFontScaling={false}
                                maxLength={100}
                                placeholder="Soyadınız"
                                returnKeyType="done"
                                value={lastName}
                                onChangeText={value => setLastName(value)}
                                keyboardType={"default"}
                            />
                        </Card>
                    </View>

                    <View style={styles.cardContainer}>
                        <Text style={styles.textStyleHeader}>Boyunuz</Text>
                        <Card style={styles.textContainer}>
                            <Input
                                style={styles.textInput}
                                autoCorrect={false}
                                autoCapitalize="none"
                                allowFontScaling={false}
                                maxLength={3}
                                placeholder="Boy"
                                returnKeyType={"done"}
                                value={String(height)}
                                onChangeText={value => setHeight(value)}
                                keyboardType="decimal-pad"
                            />
                        </Card>
                    </View>

                    <View style={styles.cardContainer}>
                        <Text style={styles.textStyleHeader}>Kilonuz</Text>
                        <Card style={styles.textContainer}>
                            <Input
                                style={styles.textInput}
                                autoCorrect={false}
                                autoCapitalize="none"
                                allowFontScaling={false}
                                maxLength={3}
                                placeholder="Kilo"
                                returnKeyType={"done"}
                                value={String(weight)}
                                onChangeText={value => setWeight(value)}
                                keyboardType="decimal-pad"
                            />
                        </Card>
                    </View>

                    <View style={styles.cardContainer}>
                        <Text style={styles.textStyleHeader}>Cinsiyet</Text>
                        <Card style={styles.textContainer}>
                            <Picker
                                style={{ height: 60 }}
                                itemTextStyle={[styles.textInput, { padding: 0, color: '#242424' }]}
                                textStyle={[styles.textInput, { padding: 0 }]}
                                iosHeader="Cinsiyet"
                                autoCorrect={false}
                                placeholder="Cinsiyet"
                                mode="dropdown"
                                headerBackButtonText="Geri"
                                selectedValue={gender}
                                onValueChange={(value) => setGender(value)}>
                                <Item label="Erkek" value="male" />
                                <Item label="Kadın" value="female" />
                                <Item label="Belirtmek İstemiyorum" value="none" />
                            </Picker>
                        </Card>
                    </View>

                    <View style={styles.cardContainer}>
                        <Text style={styles.textStyleHeader}>Doğum Tarihi</Text>
                        <Card style={styles.textContainer}>
                            <Pressable style={styles.textContainer} onPress={() => setDatePickerVisibility(!isDatePickerVisible)}>
                                <Text style={styles.textInput}>{birthDate !== undefined ? moment(birthDate).format("LL") : moment().format("LL")}</Text>
                            </Pressable>
                            <DateTimePickerModal
                                minimumDate={new Date("01-01-1940")}
                                maximumDate={Date.now()}
                                date={new Date(birthDate)}
                                cancelTextIOS="Vazgeç"
                                confirmTextIOS="Tamam"
                                headerTextIOS="Doğum tarihinizi seçin"
                                locale="TR"
                                isVisible={isDatePickerVisible}
                                mode="date"
                                onConfirm={handleConfirm}
                                onCancel={() => setDatePickerVisibility(false)}
                            />
                        </Card>
                    </View>

                    <View style={styles.cardContainer}>
                        <Text style={styles.textStyleHeader}>Kayıt Tarihi</Text>
                        <Card style={styles.textContainer}>
                            <Input
                                editable={false}
                                style={styles.textInput}
                                allowFontScaling={false}
                                placeholder="Kayıt Tarihi"
                                value={moment(auth().currentUser.metadata.creationTime).format('llll')}
                            />
                        </Card>
                    </View>

                </SafeAreaView>
            </KeyboardAwareScrollView>

            <View style={{ marginHorizontal: 20 }}>
                <Pressable
                    onPress={onSave}
                    style={styles.bottomButton}>
                    <Text style={styles.buttonText}>Kaydet</Text>
                </Pressable>
            </View>
        </ImageLayout>
    )
}

export default PersonalSettings;