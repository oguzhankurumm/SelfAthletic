import React, { useState } from 'react'
import { View, Text, Pressable, SafeAreaView, Dimensions } from 'react-native'
import * as Yup from 'yup';
import { Formik } from 'formik';
import { auth, firestore } from '../../../../config/config';
import { showMessage } from 'react-native-flash-message';
import { Card, Picker } from 'native-base';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import moment from 'moment';
import 'moment/locale/tr';
import Input from '../../../../components/Input';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import styles from './style';

const Item = Picker.Item;

const { width, height } = Dimensions.get('window');

const Page1 = ({ submitHandler, setLoading }) => {
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const registerScheme = Yup.object().shape({
        firstName: Yup.string().min(3, 'Adınız en az 3 karakter olmalıdır.'),
        lastName: Yup.string().min(2, 'Soyadınız en az 2 karakter olmalıdır.'),
        username: Yup.string().min(3, 'Kullanıcı adınız en az 3 karakter olmalıdır.'),
        // birthDate: Yup.date().required('Doğum tarihinizi seçmelisiniz.'),
        height: Yup.number().min(3, 'Boyunuz doğru görünmüyor.'),
        weight: Yup.number().min(2, 'Kilonuz doğru görünmüyor.'),
        gender: Yup.string().min(2, 'Cinsiyet seçmelisiniz'),
    })

    const handleConfirm = (date) => {
        setBirthDate(date);
        setDatePickerVisibility(false);
    };

    return (
        <Formik
            initialValues={{ firstName: '', lastName: '', username: '', height: 170, weight: 60, gender: 'male' }}
            onSubmit={submitHandler}
            validationSchema={registerScheme}
            validateOnMount={true}
        >
            {({
                handleBlur,
                handleChange,
                handleSubmit,
                values,
                errors,
                isValid
            }) => (
                <SafeAreaView style={{ height: '100%', width }}>
                    <KeyboardAwareScrollView
                        extraHeight={150}
                        enableOnAndroid={true}
                        animated={true}
                        style={{ flex: 1 }}
                    >
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
                                    placeholderTextColor="gray"
                                    returnKeyType="next"
                                    value={values.firstName}
                                    onChangeText={handleChange('firstName')}
                                    onBlur={handleBlur('firstName')}
                                    keyboardType={"default"}
                                />
                            </Card>
                            {errors.firstName && (
                                <Text style={{ fontSize: 13, color: 'red', textAlign: 'left', width: '100%' }}>
                                    {errors.firstName}
                                </Text>
                            )}
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
                                    placeholderTextColor="gray"
                                    returnKeyType="done"
                                    value={values.lastName}
                                    onChangeText={handleChange('lastName')}
                                    onBlur={handleBlur('lastName')}
                                    keyboardType={"default"}
                                />
                            </Card>
                            {errors.lastName && (
                                <Text style={{ fontSize: 13, color: 'red', textAlign: 'left', width: '100%' }}>
                                    {errors.lastName}
                                </Text>
                            )}
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
                                    placeholderTextColor="gray"
                                    returnKeyType={"done"}
                                    value={String(values.height)}
                                    onChangeText={handleChange('height')}
                                    onBlur={handleBlur('height')}
                                    keyboardType="decimal-pad"
                                />
                            </Card>
                            {errors.height && (
                                <Text style={{ fontSize: 13, color: 'red', textAlign: 'left', width: '100%' }}>
                                    {errors.height}
                                </Text>
                            )}
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
                                    placeholderTextColor="gray"
                                    returnKeyType={"done"}
                                    value={String(values.weight)}
                                    onChangeText={handleChange('weight')}
                                    onBlur={handleBlur('weight')}
                                    keyboardType="decimal-pad"
                                />
                            </Card>
                            {errors.weight && (
                                <Text style={{ fontSize: 13, color: 'red', textAlign: 'left', width: '100%' }}>
                                    {errors.weight}
                                </Text>
                            )}
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
                                    placeholderTextColor="gray"
                                    mode="dropdown"
                                    headerBackButtonText="Geri"
                                    selectedValue={values.gender}
                                    onValueChange={handleChange('gender')}
                                    onBlur={handleBlur('gender')}
                                >
                                    <Item label="Erkek" value="male" />
                                    <Item label="Kadın" value="female" />
                                    <Item label="Belirtmek İstemiyorum" value="none" />
                                </Picker>
                            </Card>
                            {errors.gender && (
                                <Text style={{ fontSize: 13, color: 'red', textAlign: 'left', width: '100%' }}>
                                    {errors.gender}
                                </Text>
                            )}
                        </View>

                        {/* <View style={styles.cardContainer}>
                                    <Text style={styles.textStyleHeader}>Doğum Tarihi</Text>
                                    <Card style={styles.textContainer}>
                                        {errors.birthDate && (
                                            <Text style={{ fontSize: 14, color: 'red' }}>
                                                {errors.birthDate}
                                            </Text>
                                        )}
                                        <Pressable style={styles.textContainer} onPress={() => setDatePickerVisibility(!isDatePickerVisible)}>
                                            <Text style={styles.textInput}>{values.birthDate !== undefined ? moment(values.birthDate).format("LL") : moment().format("LL")}</Text>
                                        </Pressable>
                                        <DateTimePickerModal
                                            minimumDate={new Date("01-01-1940")}
                                            maximumDate={Date.now()}
                                            date={values.birthDate}
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
                                </View> */}
                    </KeyboardAwareScrollView>
                    <View style={{ marginHorizontal: 20 }}>
                        <Pressable
                            onPress={handleSubmit}
                            style={styles.bottomButton}>
                            <Text style={styles.buttonText}>Devam Et</Text>
                        </Pressable>
                    </View>
                </SafeAreaView>
            )}
        </Formik>
    )
}

export default Page1;