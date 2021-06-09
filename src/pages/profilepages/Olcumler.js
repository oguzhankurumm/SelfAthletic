import React, { useState, useEffect, useRef } from 'react'
import { View, Text, StyleSheet, StatusBar, SafeAreaView, Alert, TouchableOpacity, ImageBackground, Dimensions, TextInput, ScrollView, Image } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SpinnerLoading from '../../components/SpinnerLoading';
import moment from 'moment';
import { database2 } from '../../config/config';
import * as actions from '../../redux/actions/profile';
import { SCLAlert, SCLAlertButton } from 'react-native-scl-alert'
import Carousel from 'react-native-snap-carousel';
import Slider from '@react-native-community/slider';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Input from '../../components/Input';

const { height, width } = Dimensions.get("window");


const Olcumler = props => {
    const dispatch = useDispatch()
    const _carousel = useRef(null);
    const [Loading, setLoading] = useState(false);
    const [SelectedIndex, setSelectedIndex] = useState(0);
    const [NewValue, setNewValue] = useState(0);

    const profileData = useSelector(state => state.user.users);
    const [ShowAlert, setShowAlert] = useState(false);
    const [ShowAlert2, setShowAlert2] = useState(false);
    const [Olcumler, setOlcumler] = useState([
        { name_val: "gogus", name: "Göğüs", image: "https://i.ibb.co/qFncfM2/gogus.png", index: 0, value: 0 },
        { name_val: "omuz", name: "Omuz", image: "https://i.ibb.co/qxSTrFq/omuz.png", index: 1, value: 0 },
        { name_val: "bel", name: "Bel", image: "https://i.ibb.co/Czjzq7y/bel.png", index: 2, value: 0 },
        { name_val: "karin", name: "Karın", image: "https://i.ibb.co/0MxMVDq/karin.png", index: 3, value: 0 },
        { name_val: "kol", name: "Kol", image: "https://i.ibb.co/tc6QBz6/kol.png", index: 4, value: 0 },
        { name_val: "omuz", name: "Omuz", image: "https://i.ibb.co/qxSTrFq/omuz.png", index: 5, value: 0 },
        { name_val: "kalca", name: "Kalça", image: "https://i.ibb.co/FBw0PvQ/kalca.png", index: 6, value: 0 }
    ].sort((a, b) => a.index - b.index))

    const onCarouselItemChange = index => {

        if (SelectedIndex !== Olcumler.length) {
            setSelectedIndex(index + 1);
            _carousel.current.snapToItem(index + 1);
            // Olcumler[index].olcu = parseFloat(Yapilan);
        }

    }

    const SaveData = async () => {
        const dateNow = moment().format('DD-MM-YYYY');
        let data = {
            values: [
                { name: "Göğüs", value: Olcumler.find(i => i.name_val === "gogus").value },
                { name: "Bel", value: Olcumler.find(i => i.name_val === "bel").value },
                { name: "Karın", value: Olcumler.find(i => i.name_val === "karin").value },
                { name: "Kol", value: Olcumler.find(i => i.name_val === "kol").value },
                { name: "Omuz", value: Olcumler.find(i => i.name_val === "omuz").value },
                { name: "Kalça", value: Olcumler.find(i => i.name_val === "kalca").value }
            ],
            date: dateNow
        };

        await database2.ref(`users/${profileData.userId}/measurements/${dateNow}`).set(data)
            .then(() => {
                setShowAlert2(true);
            })
            .catch((err) => {
                Alert.alert('Hata', String(err));
            })
    }

    const _renderItem = ({ item, index }) => {
        // console.log('item: ', item)
        return (
            <KeyboardAwareScrollView extraHeight={150}
                enableOnAndroid={true}
                animated={true}
                key={index}
                style={{ height, width: '100%' }}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
            >
                <View style={{
                    width: '100%'
                }}>
                    {!Loading && !Olcumler[index] !== undefined &&
                        <>
                            <Text style={{
                                fontFamily: 'SFProDisplay-Medium',
                                fontSize: 22,
                                color: '#FFF',
                                textAlign: 'center',
                                marginTop: 10,
                                marginBottom: 20
                            }}>{item.name} Ölçüsü</Text>

                            <Image source={{ uri: item.image }} resizeMode="contain" style={{ width: '100%', height: height / 1.5 }} />

                            <View style={{ position: 'absolute', bottom: 0, width: '100%', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 50 }}>
                                <Text style={{
                                    fontFamily: 'SFProDisplay-Medium',
                                    fontSize: 22,
                                    color: '#FFF',
                                    textAlign: 'center',
                                    marginBottom: 20
                                }}>{Olcumler[index].value} cm.</Text>

                                <Slider
                                    onSlidingComplete={(val) => {
                                        Olcumler[index].value = parseFloat(val).toFixed(1);
                                        setNewValue(parseFloat(val).toFixed(1));
                                    }}
                                    value={parseFloat(NewValue)}
                                    style={{ width: width / 1.3 }}
                                    minimumValue={0}
                                    maximumValue={200}
                                    minimumTrackTintColor="yellow"
                                    maximumTrackTintColor="#FFF"
                                />
                            </View>
                        </>

                    }

                </View>

            </KeyboardAwareScrollView>
        );
    }

    return (
        <ImageBackground style={{ height: height, width: width }} resizeMode="cover" source={require('../../img/bg.jpg')}>

            <SafeAreaView style={styles.container}>
                <SpinnerLoading Loading={Loading} />

                <View style={styles.header} >
                    <TouchableOpacity onPress={() => props.navigation.goBack()} style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                        <Icon name="keyboard-arrow-left" color="#FFF" size={42} style={{ marginRight: 10 }} />
                        <Text style={styles.headerText}>Mezura Ölçümleri</Text>
                    </TouchableOpacity>
                </View>

                <View showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} style={styles.container}>

                    <StatusBar barStyle="light-content" />

                    <SCLAlert
                        theme="success"
                        show={ShowAlert2}
                        title="Ölçümler Tamamlandı"
                        subtitle="Tebrikler, ölçümler tamamlandı ve kaydedildi."
                    >
                        <SCLAlertButton theme="success" onPress={() => {
                            setShowAlert2(!ShowAlert2);
                            props.navigation.goBack();
                        }}>Tamam</SCLAlertButton>
                    </SCLAlert>

                    <SCLAlert
                        theme="warning"
                        show={ShowAlert}
                        title="Ölçü Eksik"
                        subtitle={`Lütfen ${Olcumler[SelectedIndex].name} ölçünüzü girin.`}
                    >
                        <SCLAlertButton theme="warning" onPress={() => {
                            setShowAlert(!ShowAlert);
                        }}>Tekrar Dene</SCLAlertButton>
                    </SCLAlert>

                    <View style={{ justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 50 }}>
                        {!Loading &&
                            <Carousel
                                scrollEnabled={false}
                                ref={_carousel}
                                data={Olcumler}
                                renderItem={_renderItem}
                                sliderWidth={width}
                                itemWidth={350}
                                layout={'default'}
                                style={{ paddingHorizontal: 10 }}
                                removeClippedSubviews={false}
                            />

                        }
                    </View>
                </View>
            </SafeAreaView>

            <View style={{
                flexDirection: 'row',
                width: '100%',
                height: 60,
                backgroundColor: '#000',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                {SelectedIndex + 1 !== Olcumler.length ?
                    <TouchableOpacity onPress={() => {
                        if (NewValue >= 1) {
                            onCarouselItemChange(SelectedIndex);
                            setNewValue(0);
                        } else {
                            setShowAlert(true);
                        }
                    }
                    } style={{
                        width: '100%',
                        height: 60,
                        backgroundColor: 'yellow',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Text style={{
                            fontFamily: 'SFProDisplay-Bold',
                            justifyContent: 'flex-start',
                            fontSize: 16,
                            color: '#000',
                            marginRight: 5
                        }}>Devam Et
                        </Text>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity onPress={() => {
                        SaveData();
                    }} style={{
                        width: '100%',
                        height: 60,
                        backgroundColor: 'yellow',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Text style={{
                            fontFamily: 'SFProDisplay-Bold',
                            justifyContent: 'flex-start',
                            fontSize: 16,
                            color: '#000',
                            marginRight: 5
                        }}>Ölçümleri Kaydet</Text>
                    </TouchableOpacity>
                }
            </View>

        </ImageBackground >
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    textStyle: {
        fontFamily: 'SFProDisplay-Medium',
        justifyContent: 'flex-start',
        textAlign: 'justify',
        fontSize: 16,
        color: '#FFF'
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
    headerTimerText: {
        fontFamily: 'SFProDisplay-Medium',
        marginLeft: 5,
        fontSize: 18,
        color: '#FFF'
    }
})

export default Olcumler;