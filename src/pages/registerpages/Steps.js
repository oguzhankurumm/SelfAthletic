import React, { useState } from 'react'
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, Dimensions, SafeAreaView, Image, ImageBackground, Alert } from 'react-native';
import { Bar } from 'react-native-progress';
import SpinnerLoading from '../../components/SpinnerLoading';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { database2, auth2 } from '../../config/config';
import { useSelector } from 'react-redux';
import moment from 'moment';

const { height, width } = Dimensions.get("window");

const Steps = ({ props, navigation }) => {
    const [Loading, setLoading] = useState(false);
    const profileData = useSelector(state => state.user.users);

    const [SelectedPage, setSelectedPage] = useState(1);
    const [TotalPage, setTotalPage] = useState(5);
    const [Target, setTarget] = useState([
        { value: "Yağ Oranı Azaltma", checked: false },
        { value: "Formda Kalma", checked: false },
        { value: "Kas Kütlesi Artışı", checked: false }
    ])
    const [HealthProblems, setHealthProblems] = useState([
        { value: "Diyabet/İnsülin Direnci", checked: false },
        { value: "Yüksek Tansiyon", checked: false },
        { value: "Tiroid", checked: false },
        { value: "Kalp-Damar Hastalıkları", checked: false },
        { value: "Hiçbiri", checked: false }
    ]);
    const [CronicProblems, setCronicProblems] = useState([
        { value: "Ayak Bileği", checked: false },
        { value: "Diz", checked: false },
        { value: "Kalça", checked: false },
        { value: "Bel", checked: false },
        { value: "Omuz / Boyun", checked: false },
        { value: "Hiçbiri", checked: false }
    ]);
    const [Nutrition, setNutrition] = useState([
        { value: "Normal", checked: false },
        { value: "Vejetaryen", checked: false }
    ]);
    const [Aktiflik, setAktiflik] = useState([
        { value: "Kısmen aktif\n(Masa başı iş/ haftada 1-2 gün hareket)", deger: 1.1, checked: false },
        { value: "Yeterince Aktif\n(Haftada 3 gün düzenli hareket)", deger: 1.2, checked: false },
        { value: "Çok Aktif\n(Haftada 4-5 gün hareket", deger: 1.3, checked: false },
        { value: "Ağır Düzeyde Aktif\n(Haftada 6-7 gün aktif)", deger: 1.4, checked: false },
        { value: "Ekstra Aktif\n(Günde 2 kez spor yapan)", deger: 1.5, checked: false },
    ]);

    const CalculateAge = () => {
        if (profileData.birthdate) {
            var birthDate = moment(profileData.birthdate, "DD-MM-YYYY").format("DD-MM-YYYY")
            return moment().diff(moment(birthDate, 'DD-MM-YYYY'), 'years')
        }
    }

    const userAge = CalculateAge();

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
                                    var checkedList = Target.filter(tg => tg.checked);
                                    if (checkedList.length === 0) {
                                        Alert.alert('Uyarı', 'Hedef seçimi yapmalısınız.');
                                    } else {
                                        database2.ref('users').child(auth2.currentUser.uid + '/questions/target').set(checkedList[0].value)
                                            .then(() => {
                                                setSelectedPage(SelectedPage + 1);
                                            })
                                            .catch(() => {
                                                setSelectedPage(SelectedPage + 1);
                                            })
                                    }
                                }

                                if (SelectedPage === 2) {
                                    var checkedList = HealthProblems.filter(tg => tg.checked);
                                    if (checkedList.length === 0) {
                                        Alert.alert('Uyarı', 'Bir seçim yapmalısınız.');
                                    } else if (checkedList[0].value === "Hiçbiri") {
                                        setSelectedPage(SelectedPage + 1);
                                    } else {
                                        database2.ref('users').child(auth2.currentUser.uid + '/questions/healthproblems').set(checkedList[0].value)
                                            .then(() => {
                                                setSelectedPage(SelectedPage + 1);
                                            })
                                            .catch(() => {
                                                setSelectedPage(SelectedPage + 1);
                                            })
                                    }
                                }

                                if (SelectedPage === 3) {
                                    var checkedList = CronicProblems.filter(tg => tg.checked);
                                    if (checkedList.length === 0) {
                                        Alert.alert('Uyarı', 'Bir seçim yapmalısınız.');
                                    } else if (checkedList[0].value === "Hiçbiri") {
                                        setSelectedPage(SelectedPage + 1);
                                    } else {
                                        database2.ref('users').child(auth2.currentUser.uid + '/questions/cronicproblems').set(checkedList[0].value)
                                            .then(() => {
                                                setSelectedPage(SelectedPage + 1);
                                            })
                                            .catch(() => {
                                                setSelectedPage(SelectedPage + 1);
                                            })
                                    }
                                }

                                if (SelectedPage === 4) {
                                    var checkedList = Nutrition.filter(tg => tg.checked);
                                    if (checkedList.length === 0) {
                                        Alert.alert('Uyarı', 'Beslenme türü seçmelisiniz.');
                                    } else {
                                        database2.ref('users').child(auth2.currentUser.uid + '/questions/nutrition').set(checkedList[0].value)
                                            .then(() => {
                                                setSelectedPage(SelectedPage + 1);
                                            })
                                            .catch(() => {
                                                setSelectedPage(SelectedPage + 1);
                                            })
                                    }
                                }
                            } else {

                                if (SelectedPage === 5) {
                                    var checkedList = Aktiflik.filter(tg => tg.checked);
                                    if (checkedList.length === 0) {
                                        Alert.alert('Uyarı', 'Bir seçim yapmalısınız.');
                                    } else if (checkedList[0].value === "Hiçbiri") {
                                        setSelectedPage(SelectedPage + 1);
                                    } else {
                                        var cinsiyet = profileData.gender !== undefined ? profileData.gender : "Erkek";
                                        var boy = profileData.height !== undefined ? profileData.height : 160;
                                        var kilo = profileData.weight !== undefined ? profileData.weight : 50;
                                        var yas = userAge;
                                        var userTarget = profileData.questions.target !== undefined ? profileData.questions.target : "Kas Kütlesi Artışı";
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

                                        // console.log('degerler: ', {
                                        //     aktifliksecimi: checkedList[0].value,
                                        //     bmh: Bmh,
                                        //     boy: boy,
                                        //     cinsiyet: cinsiyet,
                                        //     faDegeri: faDeger,
                                        //     gunlukEnerji: gunlukEnerji,
                                        //     hedef: userTarget,
                                        //     kilo: kilo,
                                        //     yas: yas,
                                        // })

                                        database2.ref('users').child(auth2.currentUser.uid).update({
                                            fa: checkedList[0].deger,
                                            gunlukEnerji: gunlukEnerji
                                        })
                                            .then(() => {
                                                navigation.navigate('Home');
                                            })
                                            .catch(() => {
                                                navigation.navigate('Home');
                                            })
                                    }
                                }
                            }
                        }}>
                        <Text style={styles.headerText}>Sonraki</Text>
                        <Icon name="keyboard-arrow-right" color="#FFF" size={42} style={{ marginLeft: 5 }} />
                    </TouchableOpacity>

                </View>

                <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: 10, paddingHorizontal: 30 }}>
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
                            <View style={{ width: '100%', paddingHorizontal: 30 }}>
                                <Text style={[styles.headerText, { fontSize: 20, fontWeight: 'bold', textAlign: 'center' }]}>Herhangi bir sağlık probleminiz var mı?</Text>
                            </View>

                            {HealthProblems.map((item, index) => {
                                return (
                                    <TouchableOpacity
                                        onPress={() => {
                                            const newValue = HealthProblems.map((checkbox, i) => {

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

                                            setHealthProblems(newValue);
                                        }}
                                        key={index}
                                        style={{ marginTop: 20, width: '80%', backgroundColor: item.checked ? 'yellow' : null, borderRadius: 18, borderWidth: 1, borderColor: 'yellow', justifyContent: 'center', alignItems: 'center', padding: 15 }}>
                                        <Text style={item.checked ? [styles.optionText, { color: '#000' }] : styles.optionText}>{item.value}</Text>
                                    </TouchableOpacity>
                                )
                            })}
                        </>
                    }

                    {SelectedPage === 3 &&
                        <>
                            <View style={{ width: '100%', paddingHorizontal: 30 }}>
                                <Text style={[styles.headerText, { fontSize: 20, fontWeight: 'bold', textAlign: 'center' }]}>Herhangi bir kronik ağrınız var mı?</Text>
                            </View>

                            {CronicProblems.map((item, index) => {
                                return (
                                    <TouchableOpacity
                                        onPress={() => {
                                            const newValue = CronicProblems.map((checkbox, i) => {

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

                                            setCronicProblems(newValue);
                                        }}
                                        key={index}
                                        style={{ marginTop: 20, width: '80%', backgroundColor: item.checked ? 'yellow' : null, borderRadius: 18, borderWidth: 1, borderColor: 'yellow', justifyContent: 'center', alignItems: 'center', padding: 15 }}>
                                        <Text style={item.checked ? [styles.optionText, { color: '#000' }] : styles.optionText}>{item.value}</Text>
                                    </TouchableOpacity>
                                )
                            })}
                        </>
                    }

                    {SelectedPage === 4 &&
                        <>
                            <View style={{ width: '100%', paddingHorizontal: 30 }}>
                                <Text style={[styles.headerText, { fontSize: 20, fontWeight: 'bold', textAlign: 'center' }]}>Beslenme programınızın temel içeriği nasıl olsun?</Text>
                            </View>

                            {Nutrition.map((item, index) => {
                                return (
                                    <TouchableOpacity
                                        onPress={() => {
                                            const newValue = Nutrition.map((checkbox, i) => {

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

                                            setNutrition(newValue);
                                        }}
                                        key={index}
                                        style={{ marginTop: 20, width: '80%', backgroundColor: item.checked ? 'yellow' : null, borderRadius: 18, borderWidth: 1, borderColor: 'yellow', justifyContent: 'center', alignItems: 'center', padding: 15 }}>
                                        <Text style={item.checked ? [styles.optionText, { color: '#000' }] : styles.optionText}>{item.value}</Text>
                                    </TouchableOpacity>
                                )
                            })}
                        </>
                    }

                    {SelectedPage === 5 &&
                        <>
                            <View style={{ width: '100%', paddingHorizontal: 30 }}>
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

export default Steps;