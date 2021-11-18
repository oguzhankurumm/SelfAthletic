import React, { useState } from 'react'
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, Dimensions, SafeAreaView, Image, ImageBackground, Alert, Keyboard } from 'react-native';
import { Bar } from 'react-native-progress';
import SpinnerLoading from '../../components/SpinnerLoading';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';
import Input from '../../components/Input';
import axios from 'axios';
import { useSelector } from 'react-redux';

const { height, width } = Dimensions.get("window");

const Info = props => {
    console.log('props: ', props.route.params)
    const userData = props.route.params?.userData !== undefined ? props.route.params.userData : useSelector(state => state.authReducer.currentUser);
    const userId = props.route.params?.uid !== undefined ? props.route.params.uid : useSelector(state => state.authReducer.currentUser.userId);

    const [Loading, setLoading] = useState(false);

    const [SelectedPage, setSelectedPage] = useState(1);
    const [TotalPage, setTotalPage] = useState(3);
    const [BirthDate, setBirthDate] = useState(userData?.birthdate !== undefined && userData?.birthdate !== null ? moment(userData?.birthdate).format("DD-MM-YYYY") : moment('01-01-1990').format("DD-MM-YYYY"));
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const [Gender, setGender] = useState([
        { value: 'Erkek', checked: false },
        { value: 'Kadın', checked: false },
        { value: 'Belirtmek İstemiyorum', checked: false },
    ])

    const [Days, setDays] = useState([
        { value: 'Pazartesi', checked: false },
        { value: 'Salı', checked: false },
        { value: 'Çarşamba', checked: false },
        { value: 'Perşembe', checked: false },
        { value: 'Cuma', checked: false },
        { value: 'Cumartesi', checked: false },
        { value: 'Pazar', checked: false },
    ])

    const [Boy, setBoy] = useState(userData.height !== undefined && userData.height !== null ? String(userData.height) : '0');
    const [Kilo, setKilo] = useState(userData.weight !== undefined && userData.weight !== null ? String(userData.weight) : '0');

    const showDatePicker = () => {
        Keyboard.dismiss();
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
        setBirthDate(moment(date).format('DD-MM-YYYY'))
        hideDatePicker();
    };

    return (
        <ImageBackground style={{ height: height, width: width }} resizeMode="cover" source={require('../../assets/img/bg.jpg')}>
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="light-content" />
                <SpinnerLoading Loading={Loading} />

                {/* HEADER BAŞLANGIÇ */}
                <View style={styles.header} >

                    {SelectedPage !== 1 ?
                        <TouchableOpacity
                            style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}
                            disabled={SelectedPage !== 1 ? false : true}
                            onPress={() => setSelectedPage(SelectedPage - 1)}>
                            <Icon name="keyboard-arrow-left" color="#FFF" size={42} style={{ marginRight: 5 }} />
                            <Text style={styles.headerText}>Önceki</Text>
                        </TouchableOpacity>
                        : <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                            <Icon name="keyboard-arrow-left" color="#9D9D9D" size={42} style={{ marginRight: 5 }} />
                            <Text style={[styles.headerText, { color: "#9D9D9D" }]}>Önceki</Text>
                        </View>}

                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={styles.headerText}>{SelectedPage}</Text>
                        <Text style={[styles.headerText, { color: '#7D7D7D' }]}>/{TotalPage}</Text>
                    </View>

                    <TouchableOpacity
                        style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}
                        onPress={() => {
                            if (TotalPage !== SelectedPage) {
                                if (SelectedPage === 1) {
                                    var checkedList = Gender.filter(tg => tg.checked);
                                    if (checkedList.length === 0) {
                                        Alert.alert('Uyarı', 'Cinsiyet seçimi yapmalısınız.');
                                    } else {
                                        setLoading(true);
                                        axios.post("https://us-central1-selfathletic-d8b9a.cloudfunctions.net/app/updateUserData", { uid: userId, data: { gender: checkedList[0].value } })
                                            .then((res) => {
                                                if (res.status === 200) {
                                                    setLoading(false);
                                                    setSelectedPage(SelectedPage + 1);
                                                } else {
                                                    setLoading(false);
                                                    setTimeout(() => {
                                                        Alert.alert('Hata', String(res.data))
                                                    }, 200);
                                                }
                                            })
                                            .catch((err) => {
                                                setLoading(false);
                                                setTimeout(() => {
                                                    Alert.alert('Hata', String(err))
                                                }, 200);
                                            })
                                    }
                                }

                                if (SelectedPage === 2) {
                                    if (Boy <= 20 || Boy === '') {
                                        Alert.alert('Uyarı', 'Lütfen boy bilgilerinizi doğru giriniz.', [
                                            { text: 'Tekrar Dene', onPress: () => null, style: 'default' }
                                        ])
                                    } else if (Kilo <= 20 || Kilo === '') {
                                        Alert.alert('Uyarı', 'Lütfen kilo bilgilerinizi doğru giriniz.', [
                                            { text: 'Tekrar Dene', onPress: () => null, style: 'default' }
                                        ])
                                    } else {
                                        setLoading(true);
                                        axios.post("https://us-central1-selfathletic-d8b9a.cloudfunctions.net/app/updateUserData", {
                                            uid: userId, data: {
                                                birthdate: BirthDate,
                                                weight: parseFloat(Kilo),
                                                height: parseFloat(Boy)
                                            }
                                        })
                                            .then((res) => {
                                                if (res.status === 200) {
                                                    setLoading(false);
                                                    setSelectedPage(SelectedPage + 1);
                                                } else {
                                                    setLoading(false);
                                                    setTimeout(() => {
                                                        Alert.alert('Hata', String(res.data))
                                                    }, 200);
                                                }
                                            })
                                            .catch((err) => {
                                                setLoading(false);
                                                setTimeout(() => {
                                                    Alert.alert('Hata', String(err))
                                                }, 200);
                                            })
                                    }
                                }

                            } else {
                                if (SelectedPage === 3) {
                                    var checkedList = Days.filter(tg => tg.checked);
                                    if (checkedList.length === 0) {
                                        Alert.alert('Uyarı', 'Antrenman günü seçmelisiniz.');
                                    } else {
                                        var selectedDays = [];
                                        checkedList.forEach((days) => {
                                            if (days.checked === true) {
                                                selectedDays.push(days.value)
                                            }
                                        })
                                        setLoading(true);
                                        axios.post("https://us-central1-selfathletic-d8b9a.cloudfunctions.net/app/updateUserData", { uid: userId, data: { workoutDays: selectedDays } })
                                            .then((res) => {
                                                if (res.status === 200) {
                                                    setLoading(false);
                                                    if (props.route.params.uid !== null) {
                                                        props.navigation.navigate('Steps', {
                                                            userData: {
                                                                ...userData,
                                                                birthdate: BirthDate,
                                                                weight: parseFloat(Kilo),
                                                                height: parseFloat(Boy)
                                                            }, password: props.route.params.password, uid: props.route.params.uid
                                                        });
                                                    } else {
                                                        props.navigation.navigate('Steps', { userData: userData, password: props.route.params.password, uid: props.route.params.uid });
                                                    }
                                                } else {
                                                    setLoading(false);
                                                    setTimeout(() => {
                                                        Alert.alert('Hata', String(res.data))
                                                    }, 200);
                                                }
                                            })
                                            .catch((err) => {
                                                setLoading(false);
                                                setTimeout(() => {
                                                    Alert.alert('Hata', String(err))
                                                }, 200);
                                            })
                                    }
                                }
                            }
                        }}>
                        <Text style={styles.headerText}>{SelectedPage === 2 ? 'Devam Et' : 'Sonraki'}</Text>
                        <Icon name="keyboard-arrow-right" color="#FFF" size={42} style={{ marginLeft: 5 }} />
                    </TouchableOpacity>

                </View>

                <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: 10, paddingHorizontal: 20 }}>
                    <Bar height={4} style={{ width: '100%' }} width={null} color="yellow" progress={SelectedPage / TotalPage} unfilledColor="#9999" borderWidth={0} />
                </View>
                {/* HEADER SON */}


                <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>

                    {SelectedPage === 1 &&
                        <>
                            <Text style={[styles.headerText, { fontSize: 20, fontWeight: 'bold' }]}>Cinsiyetiniz nedir?</Text>

                            {Gender.map((item, index) => {
                                return (
                                    <TouchableOpacity
                                        onPress={() => {
                                            const newValue = Gender.map((checkbox, i) => {

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

                                            setGender(newValue);
                                        }}
                                        key={index}
                                        style={{ marginTop: 20, width: '80%', backgroundColor: item.checked ? 'yellow' : null, borderRadius: 18, borderWidth: 1, borderColor: 'yellow', justifyContent: 'center', alignItems: 'center', padding: 15 }}>
                                        <Text style={item.checked ? [styles.optionText, { color: '#000' }] : styles.optionText}>{item.value}</Text>
                                    </TouchableOpacity>
                                )
                            })
                            }
                        </>
                    }

                    {SelectedPage === 2 &&
                        <>
                            <Text style={[styles.headerText, { fontSize: 20, fontWeight: 'bold' }]}>Doğum tarihiniz nedir?</Text>
                            <TouchableOpacity
                                onPress={showDatePicker}
                                style={{ marginTop: 20, width: '80%', borderRadius: 18, borderWidth: 1, borderColor: 'yellow', justifyContent: 'center', alignItems: 'center', padding: 15 }}>
                                <Text style={styles.optionText}>{BirthDate}</Text>
                            </TouchableOpacity>
                            <DateTimePickerModal
                                minimumDate={new Date("01/01/1940")}
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

                            <Text style={[styles.headerText, { marginTop: 20, fontSize: 20, fontWeight: 'bold' }]}>Boyunuz?</Text>
                            <Input
                                style={{
                                    textAlign: 'center',
                                    color: "#FFF",
                                    fontFamily: 'SFProDisplay-Bold',
                                    fontSize: 16,
                                    marginTop: 20,
                                    width: '80%',
                                    borderRadius: 18,
                                    borderWidth: 1,
                                    borderColor: 'yellow',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    padding: 15
                                }}
                                autoCorrect={false}
                                autoCapitalize="none"
                                allowFontScaling={false}
                                maxLength={3}
                                placeholderTextColor="#FFF"
                                returnKeyType={"done"}
                                value={Boy}
                                onChangeText={boy => setBoy(boy)}
                                keyboardType="decimal-pad"
                            />

                            <Text style={[styles.headerText, { marginTop: 20, fontSize: 20, fontWeight: 'bold' }]}>Kilonuz?</Text>
                            <Input
                                style={{
                                    textAlign: 'center',
                                    color: "#FFF",
                                    fontFamily: 'SFProDisplay-Bold',
                                    fontSize: 16,
                                    marginTop: 20,
                                    width: '80%',
                                    borderRadius: 18,
                                    borderWidth: 1,
                                    borderColor: 'yellow',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    padding: 15
                                }}
                                autoCorrect={false}
                                autoCapitalize="none"
                                allowFontScaling={false}
                                maxLength={3}
                                placeholderTextColor="#FFF"
                                returnKeyType={"done"}
                                value={Kilo}
                                onChangeText={kilo => setKilo(kilo)}
                                keyboardType="decimal-pad"
                            />
                        </>
                    }

                    {SelectedPage === 3 &&
                        <>
                            <Text style={[styles.headerText, { fontSize: 20, fontWeight: 'bold' }]}>Hangi günler antrenman yapmak istiyorsunuz?</Text>
                            {Days.map((item, index) => {
                                return (
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
                                        style={{ marginTop: 20, width: '80%', backgroundColor: item.checked ? 'yellow' : null, borderRadius: 18, borderWidth: 1, borderColor: 'yellow', justifyContent: 'center', alignItems: 'center', padding: 15 }}>
                                        <Text style={item.checked ? [styles.optionText, { color: '#000' }] : styles.optionText}>{item.value}</Text>
                                    </TouchableOpacity>
                                )
                            })
                            }
                        </>
                    }


                </View>

            </SafeAreaView>
        </ImageBackground >
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
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
    optionText: {
        textAlign: 'center',
        fontFamily: 'SFProDisplay-Medium',
        fontSize: 16,
        color: '#FFF'
    }
})

export default Info;