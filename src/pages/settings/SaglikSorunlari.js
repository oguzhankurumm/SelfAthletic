import React, { useState, useEffect } from 'react'
import { View, Text, ImageBackground, StyleSheet, SafeAreaView, TouchableOpacity, Dimensions, StatusBar } from 'react-native'
import SpinnerLoading from '../../components/SpinnerLoading';
import Icon from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';
import 'moment/locale/tr';
import { useSelector } from 'react-redux';
import { database, auth } from '../../config/config';
import { Bar } from 'react-native-progress';

const { height, width } = Dimensions.get("window");

const SaglikSorunlari = ({ navigation }) => {
    moment.locale('tr');

    const [SelectedPage, setSelectedPage] = useState(1);
    const profileData = useSelector(state => state.authReducer.currentUser);
    const [TotalPage, setTotalPage] = useState(2);
    const [Loading, setLoading] = useState(false);

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

    const checkValues = () => {
        if (profileData.questions?.cronicproblems !== undefined) {
            const newValue = CronicProblems.map((checkbox, i) => {

                if (checkbox.value === profileData.questions.cronicproblems) {
                    const item = {
                        ...checkbox,
                        checked: !checkbox.checked,
                    }
                    return item
                }

                return checkbox
            })
            setCronicProblems(newValue);
        }

        if (profileData.questions?.healthproblems !== undefined) {

            const newValue2 = HealthProblems.map((checkbox, i) => {
                if (checkbox.value === profileData.questions.healthproblems) {
                    const item = {
                        ...checkbox,
                        checked: !checkbox.checked,
                    }
                    return item
                }

                if (profileData.questions.healthproblems === undefined && checkbox.value === "Hiçbiri") {
                    const item = {
                        ...checkbox,
                        checked: !checkbox.checked,
                    }
                    return item
                }

                return checkbox
            })
            setHealthProblems(newValue2);
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

                <View style={styles.header} >
                    <TouchableOpacity
                        style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}
                        onPress={() => SelectedPage === 1 ? navigation.goBack() : setSelectedPage(SelectedPage - 1)}>
                        <Icon name="keyboard-arrow-left" color="#FFF" size={42} style={{ marginRight: 5 }} />
                        <Text style={styles.headerText}>{SelectedPage === 1 ? 'Geri Dön' : 'Önceki'}</Text>
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
                                    var checkedList = HealthProblems.filter(tg => tg.checked);
                                    if (checkedList.length === 0) {
                                        database().ref('users').child(auth().currentUser.uid + '/questions').child('healthproblems').remove()
                                        setSelectedPage(SelectedPage + 1);
                                    } else if (checkedList[0].value === "Hiçbiri") {
                                        database().ref('users').child(auth().currentUser.uid + '/questions').child('healthproblems').remove()
                                        setSelectedPage(SelectedPage + 1);
                                    } else {
                                        database().ref('users').child(auth().currentUser.uid + '/questions/healthproblems').set(checkedList[0].value)
                                            .then(() => {
                                                setSelectedPage(SelectedPage + 1);
                                            })
                                            .catch(() => {
                                                setSelectedPage(SelectedPage + 1);
                                            })
                                    }
                                }
                            } else {
                                if (SelectedPage === 2) {
                                    var checkedList = CronicProblems.filter(tg => tg.checked);
                                    if (checkedList.length === 0) {
                                        database().ref('users').child(auth().currentUser.uid + '/questions').child('cronicproblems').remove()
                                        navigation.goBack();
                                    } else if (checkedList[0].value === "Hiçbiri") {
                                        database().ref('users').child(auth().currentUser.uid + '/questions').child('cronicproblems').remove()
                                        navigation.goBack();
                                    } else {
                                        database().ref('users').child(auth().currentUser.uid + '/questions/cronicproblems').set(checkedList[0].value)
                                            .then(() => {
                                                navigation.goBack();
                                            })
                                            .catch(() => {
                                                navigation.goBack();
                                            })
                                    }
                                }
                            }
                        }}>
                        <Text style={styles.headerText}>{SelectedPage === TotalPage ? 'Tamamla' : 'Sonraki'}</Text>
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
                                        <Text style={item.checked ? [styles.optionText, { color: '#000' }] : styles.optionText}>{item.value}</Text>
                                    </TouchableOpacity>
                                )
                            })}
                        </>
                    }

                    {SelectedPage === 2 &&
                        <>
                            <View style={{ width: '100%', paddingHorizontal: 20 }}>
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
        fontFamily: 'SFProDisplay-Medium',
        fontSize: 16,
        color: '#FFF'
    }
})

export default SaglikSorunlari;