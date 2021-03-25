import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, StatusBar, Image, SafeAreaView, ScrollView, Alert, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import SpinnerLoading from '../../components/SpinnerLoading';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import { SwipeListView } from 'react-native-swipe-list-view';
import { CardItem, Button } from 'native-base';
import BildirimList from '../../components/BildirimList';
import 'moment/locale/tr';
import * as bildirimActions from '../../redux/actions/bildirim';

moment.locale('tr')

const { height, width } = Dimensions.get("window");

const Notifications = props => {
    const dispatch = useDispatch();

    const currentUserData = useSelector(state => state.user.users.userId);

    const [bildirimData, setbildirimData] = useState(useSelector(state => state.bildirimler.bildirimler))
    const [Loading, setLoading] = useState(true);
    const [bildirimler, setbildirimler] = useState([]);

    const getBildirimler = async () => {

        bildirimData.sort(function (a, b) {
            var formattedA = moment(a.timestamp, "DD/MM/YYYY HH:mm:ss");
            var formattedB = moment(b.timestamp, "DD/MM/YYYY HH:mm:ss");
            return moment(formattedB).diff(formattedA);
        });
        setbildirimler(bildirimData);
        setLoading(false);
    }

    useEffect(() => {
        getBildirimler();
    }, [])

    const bildirimleriTemizle = () => {
        dispatch(bildirimActions.deleteallnotifications(currentUserData))
    }

    const removeNotifications = () => {
        Alert.alert('Tüm Bildirimleri Sil', 'Bildirimler silinsin mi ?',
            [
                {
                    text: 'Sil', style: 'destructive', onPress: () => bildirimleriTemizle()
                },
                {
                    text: 'Vazgeç', style: 'cancel', onPress: () => null
                }
            ]
        )
    }

    return (
        <ImageBackground style={{ height: '100%', width: '100%' }} resizeMode="cover" source={require('../../img/bg.jpg')}>

            <SafeAreaView style={styles.container}>
                <SpinnerLoading Loading={Loading} />

                <View style={styles.header} >
                    <TouchableOpacity onPress={() => props.navigation.goBack()} style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                        <Icon2 name="keyboard-arrow-left" color="#FFF" size={42} style={{ marginRight: 15 }} />
                        <Text style={styles.headerText}>Bildirimler</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => removeNotifications()} style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                        <Icon name="trash" color="#FFF" size={22} style={{ marginRight: 10 }} />
                    </TouchableOpacity>
                </View>

                {bildirimler.length >= 1 ?
                    <ScrollView
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        style={styles.scrollstyle2}
                    >
                        <View style={{ marginBottom: 50, marginTop: 20 }}>
                            <SwipeListView
                                data={bildirimler}
                                renderItem={(bildirim, i) => {
                                    return (
                                        <BildirimList
                                            key={i}
                                            bildirimBody={bildirim.item.body}
                                            bildirimTime={String(moment(bildirim.item.timestamp, "DD/MM/YYYY HH:mm:ss").format("lll"))}
                                        />
                                    );
                                }}
                                renderHiddenItem={(bildirim, i) => {
                                    return (
                                        <CardItem key={i} style={{ borderRadius: 10, marginHorizontal: 30, marginBottom: 5, height: 80 }}>

                                            <View style={{ flex: 1, flexDirection: 'row', height: 60, justifyContent: 'center', alignItems: 'center', position: 'absolute', right: 0 }}>
                                                <Button onPress={() => {
                                                    const newData = bildirimData.filter(q => q.id !== bildirim.item.id)
                                                    setbildirimler(newData)
                                                    dispatch(bildirimActions.deletenotification({ id: bildirim.item.id, userid: currentUserData }));
                                                }} style={{ flex: 1, alignItems: 'center', width: 60, height: 60, justifyContent: 'center', backgroundColor: '#FF2222', borderRadius: 10 }}>
                                                    <Icon name="trash" color="#FFF" size={20} />
                                                </Button>
                                            </View>

                                        </CardItem>
                                    )
                                }}
                                disableRightSwipe={true}
                                // disableLeftSwipe={true}
                                leftOpenValue={75}
                                rightOpenValue={-65}
                            />
                        </View>
                    </ScrollView> : <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Icon name="bell" size={48} color="#FFF" />

                        <Text allowFontScaling={false} style={styles.textStyle}>
                            Herhangi bir bildiriminiz yok.
                            </Text>
                    </View>
                }
            </SafeAreaView>

        </ImageBackground >
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
        paddingHorizontal: 30
    },
    socialButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'yellow',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 18
    },
    socialText: {
        marginLeft: 10,
        fontFamily: 'SFProDisplay-Bold',
        justifyContent: 'flex-start',
        fontSize: 14,
        color: '#000'
    },
    titleStyle: {
        fontFamily: 'SFProDisplay-Bold',
        justifyContent: 'flex-start',
        fontSize: 22,
        color: '#FFF'
    },
    subTitleStyle: {
        fontFamily: 'SFProDisplay-Medium',
        justifyContent: 'flex-start',
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
    scrollstyle: {
        flex: 1
    },
    scrollstyle2: {
        flex: 1,
        width: width,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
    },
    textStyle: {
        fontSize: 16,
        color: '#FFF',
        fontFamily: "SFProDisplay-Bold",
        fontWeight: '500',
        marginBottom: 2,
        marginTop: 20
    }
})

export default Notifications;