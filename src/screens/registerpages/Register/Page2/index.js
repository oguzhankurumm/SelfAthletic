import React, { useState } from 'react'
import { View, Text, Pressable, SafeAreaView, Dimensions } from 'react-native'
import * as Yup from 'yup';
import { Formik } from 'formik';
import { Card, Picker } from 'native-base';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Input from '../../../../components/Input';
import styles from './style';

const Item = Picker.Item;

const { width, height } = Dimensions.get('window');

const Page2 = ({ submitHandler, handleGoBack }) => {
    const registerScheme = Yup.object().shape({
        email: Yup.string().min(5, 'E-posta adresiniz doğru görünmüyor.'),
        password: Yup.string().min(6, 'Parolanız en az 6 karakter olmalıdır.'),
        username: Yup.string().min(6, 'Kullanıcı adı en az 6 karakter olmalıdır.'),
    })

    return (
        <Formik
            initialValues={{ email: '', password: '', username: '' }}
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
                            <Text style={styles.textStyleHeader}>E-Posta Adresi</Text>
                            <Card style={styles.textContainer}>
                                <Input
                                    style={styles.textInput}
                                    autoCorrect={false}
                                    autoCapitalize="none"
                                    allowFontScaling={false}
                                    maxLength={150}
                                    placeholder="E-Mail"
                                    placeholderTextColor="gray"
                                    returnKeyType="next"
                                    value={values.email}
                                    onChangeText={handleChange('email')}
                                    onBlur={handleBlur('email')}
                                    keyboardType={"email-address"}
                                />
                            </Card>
                            {errors.email && (
                                <Text style={{ fontSize: 13, color: 'red', textAlign: 'left', width: '100%' }}>
                                    {errors.email}
                                </Text>
                            )}
                        </View>

                        <View style={styles.cardContainer}>
                            <Text style={styles.textStyleHeader}>Parola</Text>
                            <Card style={styles.textContainer}>
                                <Input
                                    secureTextEntry={true}
                                    style={styles.textInput}
                                    autoCorrect={false}
                                    autoCapitalize="none"
                                    allowFontScaling={false}
                                    maxLength={100}
                                    placeholder="Parola"
                                    placeholderTextColor="gray"
                                    returnKeyType="done"
                                    value={values.password}
                                    onChangeText={handleChange('password')}
                                    onBlur={handleBlur('password')}
                                    keyboardType={"default"}
                                />
                            </Card>
                            {errors.password && (
                                <Text style={{ fontSize: 13, color: 'red', textAlign: 'left', width: '100%' }}>
                                    {errors.password}
                                </Text>
                            )}
                        </View>

                        <View style={styles.cardContainer}>
                            <Text style={styles.textStyleHeader}>Kullanıcı Adı</Text>
                            <Card style={styles.textContainer}>
                                <Input
                                    style={styles.textInput}
                                    autoCorrect={false}
                                    autoCapitalize="none"
                                    allowFontScaling={false}
                                    maxLength={100}
                                    placeholder="Kullanıcı Adı"
                                    placeholderTextColor="gray"
                                    returnKeyType={"done"}
                                    value={values.username}
                                    onChangeText={handleChange('username')}
                                    onBlur={handleBlur('username')}
                                    keyboardType="decimal-pad"
                                />
                            </Card>
                            {errors.username && (
                                <Text style={{ fontSize: 13, color: 'red', textAlign: 'left', width: '100%' }}>
                                    {errors.username}
                                </Text>
                            )}
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
                            <Text style={styles.buttonText}>Kaydı Tamamla</Text>
                        </Pressable>
                    </View>
                </SafeAreaView>
            )}
        </Formik>
    )
}

export default Page2;