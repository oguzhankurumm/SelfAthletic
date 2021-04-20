import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, StatusBar, Image, SafeAreaView, ScrollView, Alert, TouchableOpacity, ImageBackground, Dimensions, Linking } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import SpinnerLoading from '../../components/SpinnerLoading';
import { useSelector } from 'react-redux';
import { database2 } from '../../config/config';
import moment from 'moment';

const { height, width } = Dimensions.get("window");

const SliderDetails = props => {
    const profileData = useSelector(state => state.user.users);

    const [Loading, setLoading] = useState(false);
    const [Details, setDetails] = useState(props.route.params.item);

    useEffect(() => {
        if (Details.length !== 0) {
            setLoading(false);
        } else {
            setLoading(true);
        }
    }, [])

    const onButtonClicked = () => {

        setLoading(true);

        if (profileData.usedFreePremium === false) {
            var nextWeek = moment(moment().add(7, 'd').format('DD/MM/YYYY')).unix();

            database2.ref('users').child(profileData.userId).update({ usedFreePremium: true })
                .then(() => {
                    database2.ref('userSubscriptions').child(profileData.userId).set({ expireDate: nextWeek })
                        .then(() => {
                            setLoading(false);
                            setTimeout(() => {
                                Alert.alert('Tebrikler', '7 günlük üyelik kazandınız.', [{
                                    text: 'Ana Sayfaya Dön', onPress: () => props.navigation.goBack(), style: 'default'
                                }]);
                            }, 200);
                        })
                        .catch((err) => {
                            database2.ref('users').child(profileData.userId).update({ usedFreePremium: false })
                            setLoading(false);
                            setTimeout(() => {
                                Alert.alert('Hata', 'Bir hata oluştu, lütfen daha sonra tekrar deneyin.', [{
                                    text: 'Ana Sayfaya Dön', onPress: () => props.navigation.goBack(), style: 'default'
                                }]);
                            }, 200);
                        })
                })
                .catch((err) => {
                    setLoading(false);
                    setTimeout(() => {
                        Alert.alert('Hata', 'Bir hata oluştu, lütfen daha sonra tekrar deneyin.', [{
                            text: 'Ana Sayfaya Dön', onPress: () => props.navigation.goBack(), style: 'default'
                        }]);
                    }, 200);
                })
        } else {
            setLoading(false);
            setTimeout(() => {
                Alert.alert('Hata', '7 günlük denemeden daha önce faydalandınız.', [{
                    text: 'Ana Sayfaya Dön', onPress: () => props.navigation.goBack(), style: 'default'
                }]);
            }, 200);
        }
    }

    return (
        <ImageBackground style={{ height: '100%', width: '100%' }} resizeMode="cover" source={require('../../img/bg.jpg')}>

            <SafeAreaView style={styles.container}>
                <SpinnerLoading Loading={Loading} />


                <View style={styles.header} >
                    <TouchableOpacity onPress={() => props.navigation.goBack()} style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                        <Icon2 name="keyboard-arrow-left" color="#FFF" size={42} style={{ marginRight: 15 }} />
                        <Text style={styles.headerText}>{Details.title}</Text>
                    </TouchableOpacity>

                </View>

                <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} style={styles.container}>
                    <StatusBar barStyle="light-content" />

                    {!Loading &&
                        <>
                            <View style={{
                                height: 'auto',
                                width: '100%',
                                borderRadius: 18,
                                marginTop: 10
                            }}>
                                <Image
                                    resizeMode="cover"
                                    source={{ uri: Details.image }}
                                    style={{
                                        width: '100%',
                                        minHeight: 200,
                                        height: 'auto',
                                        borderRadius: 18
                                    }}
                                />
                                <LinearGradient
                                    start={{ x: 1, y: 1 }}
                                    end={{ x: 1, y: 1 }}
                                    colors={['rgba(0,0,0,0.6)', 'transparent']}
                                    style={{
                                        position: 'absolute',
                                        borderRadius: 18,
                                        width: '100%',
                                        minHeight: 200,
                                        height: 'auto'
                                    }}
                                />

                                <View style={{ position: 'absolute', top: 15, paddingHorizontal: 20 }}>
                                    <Text style={{
                                        fontFamily: 'SFProDisplay-Bold',
                                        fontSize: 20,
                                        color: '#FFF',
                                        marginBottom: 8
                                    }}>{Details.title}</Text>
                                </View>

                                <View style={{ marginTop: 20 }}>
                                    <Text style={{
                                        fontFamily: 'SFProDisplay-Medium',
                                        fontSize: 13,
                                        color: '#FFF'
                                    }}>{Details.description}</Text>
                                </View>


                                <View style={{
                                    flexDirection: 'row',
                                    width: '100%',
                                    justifyContent: 'space-between',
                                    paddingHorizontal: 20,
                                    position: 'absolute',
                                    bottom: 15
                                }}>

                                </View>


                                {Details.showSocials === true &&
                                    <View style={{ flexDirection: 'row', width: '100%', marginTop: 20, justifyContent: 'space-between' }}>
                                        <TouchableOpacity onPress={() => {
                                            var url = 'https://www.instagram.com/selfathletic/'
                                            Linking.canOpenURL(url).then(supported => {
                                                if (supported) {
                                                    Linking.openURL(url);
                                                } else {
                                                    console.log("Don't know how to open URI: " + url);
                                                }
                                            });
                                        }} style={styles.socialButton}>
                                            <Icon name="social-instagram" color="#000" size={22} />
                                            <Text style={styles.socialText}>Takip Et</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity onPress={() => {
                                            var url = 'https://www.facebook.com/selfathletic/'
                                            Linking.canOpenURL(url).then(supported => {
                                                if (supported) {
                                                    Linking.openURL(url);
                                                } else {
                                                    console.log("Don't know how to open URI: " + url);
                                                }
                                            });
                                        }} style={styles.socialButton}>
                                            <Icon name="social-twitter" color="#000" size={22} />
                                            <Text style={styles.socialText}>Takip Et</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity onPress={() => {
                                            var url = 'https://www.twitter.com/selfathletic/'
                                            Linking.canOpenURL(url).then(supported => {
                                                if (supported) {
                                                    Linking.openURL(url);
                                                } else {
                                                    console.log("Don't know how to open URI: " + url);
                                                }
                                            });
                                        }} style={styles.socialButton}>
                                            <Icon name="social-facebook" color="#000" size={22} />
                                            <Text style={styles.socialText}>Takip Et</Text>
                                        </TouchableOpacity>
                                    </View>
                                }

                            </View>
                        </>
                    }
                </ScrollView>
            </SafeAreaView>

            {Details.type === 'coupon' &&
                <TouchableOpacity onPress={onButtonClicked} style={{
                    width: '100%',
                    height: 60,
                    backgroundColor: '#CCCC00',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Text style={{
                        fontFamily: 'SFProDisplay-Bold',
                        justifyContent: 'flex-start',
                        fontSize: 16,
                        color: '#000',
                        marginRight: 5
                    }}>Kampanyayı Kullan</Text>

                </TouchableOpacity>
            }

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
    linearGradient: {
        position: 'absolute',
        top: 0,
        width: '100%',
        height: height
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
    }
})

export default SliderDetails;