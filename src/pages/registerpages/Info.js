import React, { useState } from 'react'
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, Dimensions, SafeAreaView, Image, ImageBackground, Alert, Keyboard } from 'react-native';
import { Bar } from 'react-native-progress';
import SpinnerLoading from '../../components/SpinnerLoading';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { database2, auth2 } from '../../config/config';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';
import Input from '../../components/Input';

const { height, width } = Dimensions.get("window");

const Info = ({ props, navigation }) => {
    const [Loading, setLoading] = useState(false);

    const [SelectedPage, setSelectedPage] = useState(1);
    const [TotalPage, setTotalPage] = useState(3);
    const [BirthDate, setBirthDate] = useState(moment('01/01/1990').format("DD/MM/YYYY"));
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
        { value: 'Cuma', checked: false },
        { value: 'Cumartesi', checked: false },
        { value: 'Pazar', checked: false },
    ])

    const [Boy, setBoy] = useState(0);
    const [Kilo, setKilo] = useState(0);

    const showDatePicker = () => {
        Keyboard.dismiss();
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
        const selectedDate = moment(date).format('DD-MM-YYYY')
        setBirthDate(selectedDate)
        hideDatePicker();
    };

    return (
        <ImageBackground style={{ height: height, width: width }} resizeMode="cover" source={require('../../img/bg.jpg')}>
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="light-content" />
                <SpinnerLoading Loading={Loading} />

                {/* HEADER BAŞLANGIÇ */}
                <View style={styles.header} >

                    <TouchableOpacity
                        style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}
                        disabled={SelectedPage !== 1 ? false : true}
                        onPress={() => setSelectedPage(SelectedPage - 1)}>
                        <Icon name="keyboard-arrow-left" color="#FFF" size={42} style={{ marginRight: 5 }} />
                        <Text style={styles.headerText}>Önceki</Text>
                    </TouchableOpacity>

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
                                        database2.ref('users').child(auth2.currentUser.uid + '/gender').set(checkedList[0].value)
                                            .then(() => {
                                                setSelectedPage(SelectedPage + 1);
                                            })
                                            .catch(() => {
                                                setSelectedPage(SelectedPage + 1);
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
                                        database2.ref('users').child(auth2.currentUser.uid).update({
                                            birthdate: moment(BirthDate).format('DD/MM/YYYY'),
                                            weight: parseFloat(Kilo),
                                            height: parseFloat(Boy)
                                        })
                                            .then(() => {
                                                setSelectedPage(SelectedPage + 1);
                                            })
                                            .catch((error) => {
                                                setSelectedPage(SelectedPage + 1);
                                                Alert.alert('Hata', String(error))
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
                                        database2.ref('users').child(auth2.currentUser.uid + '/workoutDays').set(selectedDays)
                                            .then(() => {
                                                navigation.navigate('Steps');
                                            })
                                            .catch(() => {
                                                navigation.navigate('Steps');
                                            })
                                    }
                                }
                            }
                        }}>
                        <Text style={styles.headerText}>{SelectedPage === 2 ? 'Devam Et' : 'Sonraki'}</Text>
                        <Icon name="keyboard-arrow-right" color="#FFF" size={42} style={{ marginLeft: 5 }} />
                    </TouchableOpacity>

                </View>

                <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: 10, paddingHorizontal: 30 }}>
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
                                placeholder="Boyunuzu girin"
                                returnKeyType={"done"}
                                value={Boy}
                                onChangeText={boy => setBoy(parseFloat(boy))}
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
                                placeholder="Kilonuzu girin"
                                returnKeyType={"done"}
                                value={Kilo}
                                onChangeText={kilo => setKilo(parseFloat(kilo))}
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