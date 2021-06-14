import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, Dimensions, SafeAreaView, Image, ImageBackground, Alert } from 'react-native';
import { Bar } from 'react-native-progress';
import SpinnerLoading from '../../components/SpinnerLoading';
import Icon from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import * as actions from '../../redux/actions/profile';

const { height, width } = Dimensions.get("window");

const HedefAyarlari = props => {

    const dispatch = useDispatch();

    const userData = useSelector(state => state.user.users);
    const userId = useSelector(state => state.user.users.userId);

    const [UserTarget, setUserTarget] = useState(null);
    const [Program, setProgram] = useState("");

    const [Loading, setLoading] = useState(false);

    const [profileData, setProfileData] = useState(userData);

    const [SelectedPage, setSelectedPage] = useState(1);
    const [TotalPage, setTotalPage] = useState(2);
    const [Target, setTarget] = useState([
        { value: "Yağ Oranı Azaltma", checked: false },
        { value: "Formda Kalma", checked: false },
        { value: "Kas Kütlesi Artışı", checked: false }
    ]);
    const [Aktiflik, setAktiflik] = useState([
        { value: "Kısmen Aktif\n(Masa başı iş/ haftada 1-2 gün hareket)", deger: 1.1, checked: false },
        { value: "Yeterince Aktif\n(Haftada 3 gün düzenli hareket)", deger: 1.2, checked: false },
        { value: "Çok Aktif\n(Haftada 4-5 gün hareket)", deger: 1.3, checked: false },
        { value: "Ağır Düzeyde Aktif\n(Haftada 6-7 gün aktif)", deger: 1.4, checked: false },
        { value: "Ekstra Aktif\n(Günde 2 kez spor yapan)", deger: 1.5, checked: false },
    ]);

    const CalculateAge = () => {
        if (profileData?.birthdate !== undefined && profileData?.birthdate !== null) {
            var birthDate = moment(profileData?.birthdate, "DD/MM/YYYY").format("DD-MM-YYYY")
            return moment().diff(moment(birthDate, 'DD/MM/YYYY'), 'years')
        } else {
            var birthDate = moment(userData?.birthdate, "DD/MM/YYYY").format("DD-MM-YYYY")
            return moment().diff(moment(birthDate, 'DD/MM/YYYY'), 'years')
        }
    }

    const userAge = CalculateAge();

    const checkValues = () => {
        if (profileData.questions?.target !== undefined) {
            const newValue = Target.map((checkbox, i) => {

                if (checkbox.value === profileData.questions.target) {
                    const item = {
                        ...checkbox,
                        checked: !checkbox.checked,
                    }
                    return item
                }

                return checkbox
            })
            setTarget(newValue);
        }

        if (profileData.fa !== undefined) {
            const newValue = Aktiflik.map((checkbox, i) => {

                if (checkbox.deger === profileData.fa) {
                    const item = {
                        ...checkbox,
                        checked: !checkbox.checked,
                    }
                    return item
                }

                return checkbox
            })
            setAktiflik(newValue);
        }
    }

    useEffect(() => {
        checkValues();
    }, [])

    return (
        <ImageBackground style={{ height: height, width: width }} resizeMode="cover" source={require('../../img/bg.jpg')}>
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="light-content" />
                <SpinnerLoading Loading={Loading} />

                {/* HEADER BAŞLANGIÇ */}
                <View style={styles.header} >

                    <TouchableOpacity
                        style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}
                        onPress={() => SelectedPage !== 1 ? setSelectedPage(SelectedPage - 1) : props.navigation.goBack()}>
                        <Icon name="keyboard-arrow-left" color="#FFF" size={42} style={{ marginRight: 5 }} />
                        <Text style={styles.headerText}>{SelectedPage !== TotalPage ? "Geri Dön" : "Önceki"}</Text>
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
                                    var targetCheck = Target.filter(tg => tg.checked)

                                    if (targetCheck.length === 0) {
                                        Alert.alert('Uyarı', 'Hedef seçimi yapmalısınız.');
                                    } else {
                                        setUserTarget(targetCheck[0].value);
                                        setSelectedPage(SelectedPage + 1);

                                        if (targetCheck[0].value === "Yağ Oranı Azaltma") {
                                            setProgram("Dengeli");
                                        } else {
                                            setProgram("");
                                        }
                                    }
                                }

                            } else {

                                if (SelectedPage === 2) {
                                    var checkedList = Aktiflik.filter(tg => tg.checked);
                                    if (checkedList.length === 0) {
                                        Alert.alert('Uyarı', 'Bir seçim yapmalısınız.');
                                    } else {
                                        setLoading(true);

                                        var cinsiyet = profileData.gender;
                                        var boy = profileData.height;
                                        var kilo = profileData.weight;
                                        var yas = userAge;
                                        var userTarget = UserTarget !== undefined ? UserTarget : "Kas Kütlesi Artışı";
                                        var faDeger = checkedList[0].deger

                                        let Bmh = 0;
                                        let gunlukEnerji = 0;

                                        if (cinsiyet === "Kadın") {
                                            var newBmh = parseFloat(10 * parseFloat(kilo)) + parseFloat(6.25 * parseFloat(boy)) - parseFloat(5 * parseFloat(yas)) - 161;
                                            Bmh = newBmh
                                        } else if (cinsiyet === "Erkek") {
                                            var newBmh = parseFloat(10 * parseFloat(kilo)) + parseFloat(6.25 * parseFloat(boy)) - parseFloat(5 * parseFloat(yas)) + 5;
                                            Bmh = newBmh
                                        }

                                        if (userTarget === "Kas Kütlesi Artışı") {
                                            gunlukEnerji = parseFloat(parseFloat(Bmh) * faDeger) + 500;
                                        }

                                        if (userTarget === "Yağ Oranı Azaltma") {
                                            gunlukEnerji = parseFloat(parseFloat(Bmh) * faDeger) - 500;
                                        }

                                        if (userTarget === "Formda Kalma") {
                                            gunlukEnerji = parseFloat(parseFloat(Bmh) * faDeger);
                                        }

                                        let Healt = profileData.questions.healthproblems !== undefined ? profileData.questions.healthproblems : null;
                                        let Nutrition = profileData.questions.nutrition !== undefined ? profileData.questions.nutrition : "Normal";


                                        let newData = {
                                            questions: {
                                                target: UserTarget,
                                                program: Program,
                                                healthproblems: Healt,
                                                nutrition: Nutrition
                                            },
                                            fa: checkedList[0].deger,
                                            gunlukEnerji: gunlukEnerji,
                                        }

                                        axios.post("https://us-central1-selfathletic-d8b9a.cloudfunctions.net/app/updateUserData", {
                                            uid: userId,
                                            data: {
                                                ...newData
                                            }
                                        })
                                            .then((res) => {
                                                if (res.status === 200) {
                                                    dispatch(actions.fetchUserData(userId));
                                                    setTimeout(() => {
                                                        setLoading(false);
                                                        props.navigation.goBack();
                                                    }, 300);
                                                } else {
                                                    setLoading(false);
                                                    setTimeout(() => {
                                                        Alert.alert('Hata', String(res.data))
                                                    }, 200);
                                                }
                                            })
                                            .catch((err) => {
                                                console.log('err: ', err)
                                                setLoading(false);
                                                setTimeout(() => {
                                                    Alert.alert('Hata', String(err))
                                                }, 200);
                                            })
                                    }
                                }
                            }
                        }}>
                        <Text style={styles.headerText}>{SelectedPage !== TotalPage ? "Sonraki" : "Tamamla"}</Text>
                        <Icon name="keyboard-arrow-right" color="#FFF" size={42} style={{ marginLeft: 5 }} />
                    </TouchableOpacity>

                </View>

                <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: 10, paddingHorizontal: 20 }}>
                    <Bar height={4} style={{ width: '100%' }} width={null} color="yellow" progress={SelectedPage / TotalPage} unfilledColor="#9999" borderWidth={0} />
                </View>
                {/* HEADER SON */}


                {/* SORULAR BAŞLANGIÇ */}
                <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>

                    {SelectedPage === 1 &&
                        <>
                            <Text style={[styles.headerText, { fontSize: 20, fontWeight: 'bold' }]}>Hedefiniz nedir?</Text>

                            {Target.map((item, index) => {
                                return (
                                    <TouchableOpacity
                                        onPress={() => {
                                            const newValue = Target.map((checkbox, i) => {
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

                                            setTarget(newValue);
                                        }}
                                        key={index}
                                        style={{ marginTop: 20, width: '80%', backgroundColor: item.checked ? 'yellow' : null, borderRadius: 18, borderWidth: 1, borderColor: 'yellow', justifyContent: 'center', alignItems: 'center', padding: 15 }}>
                                        <Text style={item.checked ? [styles.optionText, { color: '#000' }] : styles.optionText}>{item.value}</Text>
                                    </TouchableOpacity>
                                )
                            })}
                        </>
                    }

                    {SelectedPage === 2 &&
                        <>
                            <View style={{ width: '100%', paddingHorizontal: 20 }}>
                                <Text style={[styles.headerText, { fontSize: 20, fontWeight: 'bold', textAlign: 'center' }]}>Günlük yaşamınızda fiziksel olarak ne kadar aktifsiniz?</Text>
                            </View>

                            {Aktiflik.map((item, index) => {
                                return (
                                    <TouchableOpacity
                                        onPress={() => {
                                            const newValue = Aktiflik.map((checkbox, i) => {

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

                                            setAktiflik(newValue);
                                        }}
                                        key={index}
                                        style={{ marginTop: 20, width: '80%', backgroundColor: item.checked ? 'yellow' : null, borderRadius: 18, borderWidth: 1, borderColor: 'yellow', justifyContent: 'center', alignItems: 'center', padding: 15 }}>
                                        <Text style={item.checked ? [styles.optionText, { color: '#000' }] : styles.optionText}>{item.value}</Text>
                                    </TouchableOpacity>
                                )
                            })}
                        </>
                    }

                </View>


                {/* SORULAR SON */}



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
        fontFamily: 'SFProDisplay-Medium',
        textAlign: 'center',
        fontSize: 16,
        color: '#FFF'
    }
})

export default HedefAyarlari;