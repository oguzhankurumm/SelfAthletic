import React, { useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, ImageBackground, Dimensions, TextInput } from 'react-native';
import styles from './style';
import SpinnerLoading from '../../../components/SpinnerLoading';
import Icon from 'react-native-vector-icons/MaterialIcons'
import { useSelector } from 'react-redux';
import { WebView } from 'react-native-webview';
import { Button } from 'native-base';
import Modal from 'react-native-modal';

const { height, width } = Dimensions.get("window");

const Premium = ({ props, navigation }) => {

    const [Loading, setLoading] = useState(false);
    const [selectedType, setselectedType] = useState(1);
    const profileData = useSelector(state => state.authReducer.currentUser);
    const [SelectedPage, setSelectedPage] = useState(0);

    const [PaymentAddress, setPaymentAddress] = useState("");
    const [PaymentName, setPaymentName] = useState("");
    const [PaymentPhoneNumber, setPaymentPhoneNumber] = useState("");
    const [PaymentEmail, setPaymentEmail] = useState("");

    const [SecureOpen, setSecureOpen] = useState(false);
    const [SecureHtml, setSecureHtml] = useState("");


    const Page1 = () => {
        return (
            <>
                <SafeAreaView style={{ width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: 30 }}>
                    <Text style={styles.textHeader}>Premium Üyelik</Text>

                    <View style={{ marginTop: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon name="check" color="#FFF" size={20} />
                        <Text style={styles.textHeaderSub}>Size özel antrenman programları</Text>
                    </View>

                    <View style={{ marginTop: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon name="check" color="#FFF" size={20} />
                        <Text style={styles.textHeaderSub}>Size özel beslenme programları</Text>
                    </View>

                    <View style={{ marginTop: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon name="check" color="#FFF" size={20} />
                        <Text style={styles.textHeaderSub}>Tüm özelliklerin kilidini açar</Text>
                    </View>
                </SafeAreaView>

                <View style={styles.premiumView}>

                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={[styles.textHeaderSub, { marginLeft: 0, fontWeight: 'bold', fontSize: 17 }]}>Hesap Durumunuz: {profileData.isPremium === true ? 'Premium' : 'Ücretsiz'}</Text>
                    </View>

                    <TouchableOpacity onPress={() => setselectedType(0)} style={selectedType === 0 ? [styles.premiumContainerSelected] : [styles.premiumContainer]}>
                        <Icon name="star" size={32} color='yellow' style={{ marginRight: 10, position: 'absolute', top: -15, left: -10 }} />
                        <Text style={selectedType === 0 ? styles.textSubSelected : styles.textSub}>1 Yıllık Üyelik</Text>
                        <Text style={selectedType === 0 ? styles.textSub2Selected : styles.textSub2}>239.99₺</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setselectedType(1)} style={selectedType === 1 ? styles.premiumContainerSelected : styles.premiumContainer}>
                        <Text style={selectedType === 1 ? styles.textSubSelected : styles.textSub}>6 Aylık Üyelik</Text>
                        <Text style={selectedType === 1 ? styles.textSub2Selected : styles.textSub2}>179.99₺</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setselectedType(2)} style={selectedType === 2 ? styles.premiumContainerSelected : styles.premiumContainer}>
                        <Text style={selectedType === 2 ? styles.textSubSelected : styles.textSub}>3 Aylık Üyelik</Text>
                        <Text style={selectedType === 2 ? styles.textSub2Selected : styles.textSub2}>119.99₺</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setselectedType(3)} style={selectedType === 3 ? styles.premiumContainerSelected : styles.premiumContainer}>
                        <Text style={selectedType === 3 ? styles.textSubSelected : styles.textSub}>1 Aylık Üyelik</Text>
                        <Text style={selectedType === 3 ? styles.textSub2Selected : styles.textSub2}>49.99₺</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.bottomButton, { backgroundColor: '#202026' }]}>
                        <Text style={[styles.textBottomButton, { color: '#FFF' }]}>Geri Dön</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setSelectedPage(SelectedPage + 1)} style={styles.bottomButton}>
                        <Text style={styles.textBottomButton}>Devam Et</Text>
                    </TouchableOpacity>
                </View>
            </>
        )
    }

    const Page2 = () => {
        return (
            <>
                <SafeAreaView style={{ width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: 30 }}>
                    <Text style={styles.textHeader}>Fatura Bilgileri</Text>
                </SafeAreaView>

                <View style={styles.premiumView}>
                    <View style={{ alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                        <TextInput
                            style={styles.textInputStyle}
                            textAlign="left"
                            placeholderTextColor="#FFF"
                            allowFontScaling={false}
                            maxLength={200}
                            value={PaymentName}
                            placeholder={"Adınız Soyadınız"}
                            returnKeyType={"done"}
                            onChangeText={text => setPaymentName(text)}
                            keyboardType="default"
                        />

                        <TextInput
                            style={styles.textInputStyle}
                            textAlign="left"
                            placeholderTextColor="#FFF"
                            allowFontScaling={false}
                            maxLength={200}
                            value={PaymentAddress}
                            placeholder={"Adresiniz"}
                            returnKeyType={"done"}
                            onChangeText={text => setPaymentAddress(text)}
                            keyboardType="default"
                        />

                        <TextInput
                            style={styles.textInputStyle}
                            textAlign="left"
                            placeholderTextColor="#FFF"
                            allowFontScaling={false}
                            maxLength={200}
                            value={PaymentPhoneNumber}
                            placeholder={"Telefon Numaranız"}
                            returnKeyType={"done"}
                            onChangeText={text => setPaymentAddress(text)}
                            keyboardType="number-pad"
                        />

                        <TextInput
                            style={styles.textInputStyle}
                            textAlign="left"
                            placeholderTextColor="#FFF"
                            allowFontScaling={false}
                            maxLength={200}
                            value={PaymentEmail}
                            placeholder={"E-Posta Adresiniz"}
                            returnKeyType={"done"}
                            onChangeText={text => setPaymentEmail(text)}
                            keyboardType="email-address"
                        />
                    </View>

                </View>

                <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => setSelectedPage(SelectedPage - 1)} style={[styles.bottomButton, { backgroundColor: '#202026' }]}>
                        <Text style={[styles.textBottomButton, { color: '#FFF' }]}>Geri Dön</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setSecureOpen(true)} style={styles.bottomButton}>
                        <Text style={styles.textBottomButton}>Ödemeye Geç</Text>
                    </TouchableOpacity>
                </View>
            </>
        )
    }

    return (
        <ImageBackground style={{ height: height, width: width }} resizeMode="cover" source={require('../../../assets/img/bg.jpg')}>
            <View style={{ flex: 1, paddingHorizontal: 20, paddingVertical: 50, alignItems: 'center', justifyContent: 'space-between' }}>

                <SpinnerLoading Loading={Loading} />

                <Modal style={{
                    flex: 1
                }}
                    animationType="fade"
                    backdropOpacity={1}
                    visible={SecureOpen}
                    onRequestClose={() => setSecureOpen(false)}>
                    <View style={{
                        flex: 1,
                        justifyContent: 'center',
                        borderRadius: 10,
                        overflow: 'hidden',
                    }}>
                        <WebView
                            startInLoadingState={true}

                            source={{ uri: "https://www.google.com" }}
                        />
                        <Button
                            onPress={() => setSecureOpen(false)}
                            style={{ position: 'absolute', bottom: 10, left: 10, right: 10, height: 60, backgroundColor: 'yellow', borderRadius: 12, justifyContent: 'center', alignItems: 'center' }}
                        >
                            <Text allowFontScaling={false} style={{
                                fontSize: 16,
                                color: '#000',
                                fontFamily: "SFProDisplay-Bold",
                            }}>Kapat</Text>
                        </Button>
                    </View>
                </Modal>

                {SelectedPage === 0 ?
                    <Page1 />
                    :
                    <Page2 />
                }
            </View >
        </ImageBackground >
    )
}
export default Premium;