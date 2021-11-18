import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, Dimensions, SafeAreaView, ImageBackground, Alert } from 'react-native';
import { Bar } from 'react-native-progress';
import SpinnerLoading from '../../components/SpinnerLoading';
import Icon from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';
import axios from 'axios';
import { auth } from '../../config/config';
import { useSelector, useDispatch } from 'react-redux';
import * as actions from '../../redux/actions/auth';

const { height, width } = Dimensions.get("window");

const Steps = props => {
    const dispatch = useDispatch();
    console.log('propsssss: ', props.route.params)

    const { index, routes } = props.navigation.dangerouslyGetState();
    const currentRoute = routes[index].name;

    const userData = props.route.params?.userData !== undefined ? props.route.params.userData : useSelector(state => state.authReducer.currentUser);

    const [UserTarget, setUserTarget] = useState(null);
    const [UserCronicProblems, setUserCronicProblems] = useState(null);
    const [UserHealthProblems, setUserHealthProblems] = useState(null);
    const [UserNutrition, setUserNutrition] = useState(null);
    const [Program, setProgram] = useState("");

    const [Loading, setLoading] = useState(true);

    const [profileData, setProfileData] = useState([]);

    const [SelectedPage, setSelectedPage] = useState(1);
    const [TotalPage, setTotalPage] = useState(5);
    const [Target, setTarget] = useState([
        { name: "Yağ Oranı Azaltma", value: -1, checked: false },
        { name: "Formda Kalma", value: 0, checked: false },
        { name: "Kas Kütlesi Artışı", value: 1, checked: false }
    ]);
    const [HealthProblems, setHealthProblems] = useState([
        { value, name: "Diyabet/İnsülin Direnci", checked: false },
        { value, name: "Yüksek Tansiyon", checked: false },
        { value, name: "Tiroid", checked: false },
        { value, name: "Kalp-Damar Hastalıkları", checked: false },
        { value, name: "Hiçbiri", checked: false }
    ]);
    const [CronicProblems, setCronicProblems] = useState([
        { value, name: "Ayak Bileği", checked: false },
        { value, name: "Diz", checked: false },
        { value, name: "Kalça", checked: false },
        { value, name: "Bel", checked: false },
        { value, name: "Omuz / Boyun", checked: false },
        { value, name: "Hiçbiri", checked: false }
    ]);
    const [Nutrition, setNutrition] = useState([
        { value, name: "Normal", checked: false },
        { value, name: "Vejetaryen", checked: false }
    ]);
    const [Aktiflik, setAktiflik] = useState([
        { value, name: "Kısmen Aktif\n(Masa başı iş/ haftada 1-2 gün hareket)", deger: 1.1, checked: false },
        { value, name: "Yeterince Aktif\n(Haftada 3 gün düzenli hareket)", deger: 1.2, checked: false },
        { value, name: "Çok Aktif\n(Haftada 4-5 gün hareket)", deger: 1.3, checked: false },
        { value, name: "Ağır Düzeyde Aktif\n(Haftada 6-7 gün aktif)", deger: 1.4, checked: false },
        { value, name: "Ekstra Aktif\n(Günde 2 kez spor yapan)", deger: 1.5, checked: false },
    ]);

    const CalculateAge = () => {
        if (profileData?.birthdate !== undefined && profileData?.birthdate !== null) {
            var birthDate = moment(profileData?.birthdate, "DD-MM-YYYY").format("DD-MM-YYYY")
            return moment().diff(moment(birthDate, 'DD-MM-YYYY'), 'years')
        } else {
            var birthDate = moment(userData?.birthdate, "DD-MM-YYYY").format("DD-MM-YYYY")
            return moment().diff(moment(birthDate, 'DD-MM-YYYY'), 'years')
        }
    }

    const userAge = CalculateAge();

    const fetchData = async () => {
        await axios.post("https://us-central1-selfathletic-d8b9a.cloudfunctions.net/app/getUserData", { uid: props.route.params.uid })
            .then((res) => {
                if (res.status === 200) {
                    setProfileData(res.data.userData);
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
    useEffect(() => {
        fetchData().then(() => {
            setLoading(false);
        })
    }, [])

    return (
        <ImageBackground style={{ height: height, width: width }} resizeMode="cover" source={require('../../assets/img/bg.jpg')}>
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="light-content" />
                <SpinnerLoading Loading={Loading} />

                {/* HEADER BAŞLANGIÇ */}
                <View style={styles.header} >

                    <TouchableOpacity
                        style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}
                        onPress={() => SelectedPage !== 1 ? setSelectedPage(SelectedPage - 1) : props.navigation.goBack()}>
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

                                if (SelectedPage === 2) {
                                    var healthCheck = HealthProblems.filter(tg => tg.checked);

                                    if (healthCheck.length === 0) {
                                        Alert.alert('Uyarı', 'Bir seçim yapmalısınız.');
                                    } else if (healthCheck[0].value === "Hiçbiri") {
                                        setSelectedPage(SelectedPage + 1);
                                    } else {
                                        setUserHealthProblems(healthCheck[0].value);
                                        setSelectedPage(SelectedPage + 1);
                                    }
                                }

                                if (SelectedPage === 3) {
                                    var cronicCheck = CronicProblems.filter(tg => tg.checked)
                                    if (cronicCheck.length === 0) {
                                        Alert.alert('Uyarı', 'Bir seçim yapmalısınız.');
                                    } else if (cronicCheck[0].value === "Hiçbiri") {
                                        setSelectedPage(SelectedPage + 1);
                                    } else {
                                        setUserCronicProblems(cronicCheck[0].value);
                                        setSelectedPage(SelectedPage + 1);
                                    }
                                }

                                if (SelectedPage === 4) {
                                    var nutritionCheck = Nutrition.filter(tg => tg.checked)
                                    if (nutritionCheck.length === 0) {
                                        Alert.alert('Uyarı', 'Beslenme türü seçmelisiniz.');
                                    } else {
                                        setUserNutrition(nutritionCheck[0].value)
                                        setSelectedPage(SelectedPage + 1);
                                    }
                                }
                            } else {

                                if (SelectedPage === 5) {
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

                                        let newData = {
                                            questions: {
                                                cronicproblems: UserCronicProblems,
                                                healthproblems: UserHealthProblems,
                                                nutrition: UserNutrition,
                                                target: UserTarget,
                                                program: Program
                                            },
                                            fa: checkedList[0].deger,
                                            gunlukEnerji: gunlukEnerji,
                                        }

                                        axios.post("https://us-central1-selfathletic-d8b9a.cloudfunctions.net/app/updateUserData", {
                                            uid: props.route.params.uid,
                                            data: {
                                                ...newData
                                            }
                                        })
                                            .then((res) => {
                                                if (res.status === 200) {
                                                    // if (auth().currentUser.uid === null) {
                                                    //     console.log('burda null:')
                                                    auth().signInWithEmailAndPassword(userData.email, props.route.params.password)
                                                        .then((userRes) => {
                                                            console.log('usss: ', userRes.user)

                                                            if (userRes.user.uid !== null) {
                                                                dispatch(actions.fetchUserData(auth().currentUser.email));
                                                                var newInt = setInterval(() => {
                                                                    if (currentRoute !== "Steps") {
                                                                        setLoading(false);
                                                                        clearInterval(newInt);
                                                                    }
                                                                }, 500);
                                                            }
                                                        })
                                                        .catch((err) => {
                                                            console.log('func ici err', err)
                                                            setLoading(false);
                                                            setTimeout(() => {
                                                                Alert.alert('Hata', 'Giriş yapılırken bir problem oluştu.')
                                                            }, 200)
                                                        })
                                                } else {
                                                    setLoading(false);
                                                    setTimeout(() => {
                                                        Alert.alert('Hata', String(res.data))
                                                    }, 200);
                                                }
                                            })
                                            .catch((err) => {
                                                console.log('err burda: ', err)
                                                setLoading(false);
                                                setTimeout(() => {
                                                    Alert.alert('Hata', String(err))
                                                }, 200);
                                            })
                                    }
                                }
                            }
                        }}>
                        <Text style={styles.headerText}>Sonraki</Text>
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
                                        <Text style={item.checked ? [styles.optionText, { color: '#000' }] : styles.optionText}>{item.name}</Text>
                                    </TouchableOpacity>
                                )
                            })}
                        </>
                    }

                    {SelectedPage === 2 &&
                        <>
                            <View style={{ width: '100%', paddingHorizontal: 20 }}>
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
                                        <Text style={item.checked ? [styles.optionText, { color: '#000' }] : styles.optionText}>{item.name}</Text>
                                    </TouchableOpacity>
                                )
                            })}
                        </>
                    }

                    {SelectedPage === 3 &&
                        <>
                            <View style={{ width: '100%', paddingHorizontal: 20 }}>
                                <Text style={[styles.headerText, { fontSize: 20, fontWeight: 'bold', textAlign: 'center' }]}>Herhangi bir eklem ağrınız var mı?</Text>
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
                                        <Text style={item.checked ? [styles.optionText, { color: '#000' }] : styles.optionText}>{item.name}</Text>
                                    </TouchableOpacity>
                                )
                            })}
                        </>
                    }

                    {SelectedPage === 4 &&
                        <>
                            <View style={{ width: '100%', paddingHorizontal: 20 }}>
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
                                        <Text style={item.checked ? [styles.optionText, { color: '#000' }] : styles.optionText}>{item.name}</Text>
                                    </TouchableOpacity>
                                )
                            })}
                        </>
                    }

                    {SelectedPage === 5 &&
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
                                        <Text style={item.checked ? [styles.optionText, { color: '#000' }] : styles.optionText}>{item.name}</Text>
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