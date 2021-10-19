import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, Dimensions, ImageBackground, SafeAreaView, FlatList, Image, Alert } from 'react-native';
import { database } from '../../config/config';
import SpinnerLoading from '../../components/SpinnerLoading';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Modal from 'react-native-modal';

const { height, width } = Dimensions.get("window");

const FoodLib = props => {
    const [Loading, setLoading] = useState(true);
    const [FoodList, setFoodList] = useState([]);
    const [SelectedFood, setSelectedFood] = useState([]);
    const [ShowPopup, setShowPopup] = useState(false);

    useEffect(() => {
        getFoods();
    }, [])

    const getFoods = async () => {
        let fbFoodsArr = [];
        let newFoodList = [];

        await database().ref('foods').once('value')
            .then((snapshot) => {
                snapshot.forEach((item) => {
                    fbFoodsArr.push({
                        ...item.val(),
                        id: item.key
                    })
                })

                fbFoodsArr.forEach((item) => {
                    var newitem = item;

                    var besinSut = 0;
                    var besinEkmek = 0;
                    var besinMeyve = 0;
                    var besinYag = 0;
                    var besinEYP = 0;
                    var besinSebze = 0;

                    if (newitem.birim1 !== undefined || newitem.birim2 !== undefined || newitem.birim3 !== undefined) {

                        if (newitem.birim1 === "Süt") {
                            besinSut = parseFloat(besinSut) + parseFloat(newitem.deger1);
                        } else if (newitem.birim2 === "Süt") {
                            besinSut = parseFloat(besinSut) + parseFloat(newitem.deger1);
                        } else if (newitem.birim3 === "Süt") {
                            besinSut = parseFloat(besinSut) + parseFloat(newitem.deger1);
                        }

                        if (newitem.birim1 === "Ekmek") {
                            besinEkmek = parseFloat(besinEkmek) + parseFloat(newitem.deger1);
                        } else if (newitem.birim2 === "Ekmek") {
                            besinEkmek = parseFloat(besinEkmek) + parseFloat(newitem.deger1);
                        } else if (newitem.birim3 === "Ekmek") {
                            besinEkmek = parseFloat(besinEkmek) + parseFloat(newitem.deger1);
                        }

                        if (newitem.birim1 === "Meyve") {
                            besinMeyve = parseFloat(besinMeyve) + parseFloat(newitem.deger1);
                        } else if (newitem.birim2 === "Meyve") {
                            besinMeyve = parseFloat(besinMeyve) + parseFloat(newitem.deger1);
                        } else if (newitem.birim3 === "Meyve") {
                            besinMeyve = parseFloat(besinMeyve) + parseFloat(newitem.deger1);
                        }

                        if (newitem.birim1 === "Yağ") {
                            besinYag = parseFloat(besinYag) + parseFloat(newitem.deger1);
                        } else if (newitem.birim2 === "Yağ") {
                            besinYag = parseFloat(besinYag) + parseFloat(newitem.deger1);
                        } else if (newitem.birim3 === "Yağ") {
                            besinYag = parseFloat(besinYag) + parseFloat(newitem.deger1);
                        }

                        if (newitem.birim1 === "EYP") {
                            besinEYP = parseFloat(besinEYP) + parseFloat(newitem.deger1);
                        } else if (newitem.birim2 === "EYP") {
                            besinEYP = parseFloat(besinEYP) + parseFloat(newitem.deger1);
                        } else if (newitem.birim3 === "EYP") {
                            besinEYP = parseFloat(besinEYP) + parseFloat(newitem.deger1);
                        }

                        if (newitem.birim1 === "Sebze") {
                            besinSebze = parseFloat(besinSebze) + parseFloat(newitem.deger1);
                        } else if (newitem.birim2 === "Sebze") {
                            besinSebze = parseFloat(besinSebze) + parseFloat(newitem.deger1);
                        } else if (newitem.birim3 === "Sebze") {
                            besinSebze = parseFloat(besinSebze) + parseFloat(newitem.deger1);
                        }

                        var newBesin = {
                            ...item,
                            id: item.id,
                            besinSut: besinSut,
                            besinEkmek: besinEkmek,
                            besinMeyve: besinMeyve,
                            besinYag: besinYag,
                            besinEYP: besinEYP,
                            besinSebze: besinSebze
                        }

                        newFoodList.push(newBesin);
                    }


                })

                setFoodList(newFoodList.sort((a, b) => a.name.localeCompare(b.name)));
                setLoading(false);
            })
            .catch((err) => {
                setLoading(false);
            })
    }
    return (
        <ImageBackground style={{ height: height, width: width }} resizeMode="cover" source={require('../../img/bg.jpg')}>
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="light-content" />
                <SpinnerLoading Loading={Loading} />

                <Modal style={{ marginTop: 'auto' }}
                    animationIn="fadeIn"
                    animationOut="fadeOut"
                    isVisible={ShowPopup}
                    animationInTiming={500}
                    animationOutTiming={500}
                    backdropOpacity={0.7}
                >
                    <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#202026', padding: 20, borderRadius: 20 }}>

                        <View style={{ marginTop: -60, height: 80, width: 80, backgroundColor: '#D1DC26', borderRadius: 12, justifyContent: 'center', alignItems: 'center' }}>
                            <Icon name="info-outline" size={42} color="#202026" />
                        </View>

                        <View style={styles.modalStyle}>
                            <Text style={styles.popupText}>Demir:</Text>
                            <Text style={styles.popupText}>{SelectedFood.demir !== undefined ? SelectedFood.demir : 0} mg.</Text>
                        </View>

                        <View style={styles.modalStyle}>
                            <Text style={styles.popupText}>Kalori:</Text>
                            <Text style={styles.popupText}>{SelectedFood.kalori !== undefined ? SelectedFood.kalori : 0} kcal.</Text>
                        </View>

                        <View style={styles.modalStyle}>
                            <Text style={styles.popupText}>Kalsiyum:</Text>
                            <Text style={styles.popupText}>{SelectedFood.kalsiyum !== undefined ? SelectedFood.kalsiyum : 0} mg.</Text>
                        </View>

                        <View style={styles.modalStyle}>
                            <Text style={styles.popupText}>Karbonhidrat:</Text>
                            <Text style={styles.popupText}>{SelectedFood.karbonhidrat !== undefined ? SelectedFood.karbonhidrat : 0} g.</Text>
                        </View>

                        <View style={styles.modalStyle}>
                            <Text style={styles.popupText}>Lif:</Text>
                            <Text style={styles.popupText}>{SelectedFood.lif !== undefined ? SelectedFood.lif : 0} g.</Text>
                        </View>

                        <View style={styles.modalStyle}>
                            <Text style={styles.popupText}>Potasyum:</Text>
                            <Text style={styles.popupText}>{SelectedFood.potasyum !== undefined ? SelectedFood.potasyum : 0} mg.</Text>
                        </View>

                        <View style={styles.modalStyle}>
                            <Text style={styles.popupText}>Protein:</Text>
                            <Text style={styles.popupText}>{SelectedFood.protein !== undefined ? SelectedFood.protein : 0} g.</Text>
                        </View>

                        <View style={styles.modalStyle}>
                            <Text style={styles.popupText}>Sodyum:</Text>
                            <Text style={styles.popupText}>{SelectedFood.soydum !== undefined ? SelectedFood.sodyum : 0} mg.</Text>
                        </View>

                        <View style={styles.modalStyle}>
                            <Text style={styles.popupText}>Yağ:</Text>
                            <Text style={styles.popupText}>{SelectedFood.yag !== undefined ? SelectedFood.yag : 0} g.</Text>
                        </View>

                        <View style={styles.modalStyle}>
                            <Text style={styles.popupText}>Fosfor:</Text>
                            <Text style={styles.popupText}>{SelectedFood.fosfor !== undefined ? SelectedFood.fosfor : 0} mg.</Text>
                        </View>

                        <View style={styles.modalStyle}>
                            <Text style={styles.popupText}>A Vit. :</Text>
                            <Text style={styles.popupText}>{SelectedFood.avitamin !== undefined ? SelectedFood.avitamin : 0} µg.</Text>
                        </View>

                        <View style={styles.modalStyle}>
                            <Text style={styles.popupText}>C Vit. :</Text>
                            <Text style={styles.popupText}>{SelectedFood.cvitamin !== undefined ? SelectedFood.cvitamin : 0} µg.</Text>
                        </View>

                        {SelectedFood.tarif !== undefined && SelectedFood.tarif !== "" &&
                            <View style={[styles.modalStyle, { marginTop: 20, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }]}>
                                <Text style={[styles.popupText, { marginBottom: 10, fontWeight: '700' }]}>Tarif:</Text>
                                <Text style={[styles.popupText, { textAlign: 'justify', fontSize: 16 }]}>{String(SelectedFood.tarif)}</Text>
                            </View>
                        }

                        <TouchableOpacity onPress={() => setShowPopup(!ShowPopup)} style={{ marginTop: 20, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={[styles.popupText, { color: '#FFF' }]}>Kapat</Text>
                        </TouchableOpacity>

                    </View>
                </Modal>

                <View style={styles.header} >
                    <TouchableOpacity onPress={() => props.navigation.goBack()} style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                        <Icon name="keyboard-arrow-left" color="#FFF" size={42} style={{ marginRight: 15 }} />
                        <Text style={styles.headerText}>Besin Kütüphanesi</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ width: '100%', marginTop: 20 }}>
                    {!Loading && FoodList.length > 0 ?
                        <FlatList style={{ height: 'auto', paddingHorizontal: 20, marginBottom: 50, marginTop: 10 }}
                            scrollEnabled={true}
                            showsVerticalScrollIndicator={true}
                            data={FoodList}
                            keyExtractor={(item, index) => index.toString()}
                            ListHeaderComponent={() => {
                                return (
                                    <View style={{ flexDirection: 'row', borderTopLeftRadius: 12, borderTopRightRadius: 12, paddingVertical: 10, width: '100%', justifyContent: 'center', alignItems: 'center' }} />
                                )
                            }}
                            renderItem={(food) => {
                                var item = food.item;
                                return (item &&
                                    <View key={item.id} style={{
                                        padding: 10,
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        height: 'auto',
                                        width: '100%'
                                    }}>
                                        <View style={{ width: '70%', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <Text style={styles.foodName}>{item.name}</Text>
                                            {item.note !== "" && item.note !== undefined &&
                                                <Text style={[styles.foodName, { color: '#9D9D9D', fontSize: 14, marginTop: 5 }]}>{item.note}</Text>
                                            }
                                        </View>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Icon onPress={() => {
                                                setSelectedFood(item);
                                                setTimeout(() => {
                                                    setShowPopup(!ShowPopup)
                                                }, 200);
                                            }} name="info-outline" size={20} color="#FFF" />
                                        </View>
                                    </View>
                                )
                            }}
                        />
                        : <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={[styles.headerText, { fontSize: 14, marginTop: 50 }]}>Kütüphanede hiç besin yok.</Text>
                        </View>
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
    popupText: {
        fontFamily: 'SFProDisplay-Medium',
        fontSize: 18,
        color: '#FFF',
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
    foodName: {
        fontFamily: 'SFProDisplay-Medium',
        fontSize: 16,
        color: '#FFF'
    },
    modalStyle: {
        paddingVertical: 5,
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center'
    }
})
export default FoodLib;