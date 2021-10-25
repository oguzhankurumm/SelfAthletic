import React, { useState } from 'react'
import { View, SafeAreaView, Text, StyleSheet, Image, TouchableOpacity, Dimensions, Alert, ScrollView } from 'react-native'
import { useSelector } from 'react-redux';
import Modal from 'react-native-modal';
import { auth } from '../config/config';
import SpinnerLoading from '../components/SpinnerLoading';
import { SCLAlert, SCLAlertButton } from 'react-native-scl-alert';
import { useNavigation } from '@react-navigation/core';
import themeColors from '../styles/colors';
import themeFonts from '../styles/fonts';

const { height, width } = Dimensions.get("window");

const Sidebar = ({ opened, onClose }) => {
    const navigation = useNavigation();
    const profileData = useSelector(state => state.user.users);
    const [ShowSideModal, setShowSideModal] = useState(opened)
    const [Loading, setLoading] = useState(false);
    const [ShowWarning, setShowWarning] = useState(false);

    const { index, routes } = navigation.dangerouslyGetState();
    const currentRoute = routes[index].name;

    return (
        <Modal
            isVisible={opened}
            onBackdropPress={() => {
                onClose();
                setShowSideModal(!ShowSideModal)
            }}
            onSwipeComplete={() => {
                onClose();
                setShowSideModal(!ShowSideModal);
            }}
            animationIn="slideInLeft"
            animationOut="slideOutLeft"
            swipeDirection="left"
            useNativeDriver
            hideModalContentWhileAnimating
            propagateSwipe
            style={{
                margin: 0,
                width: width * 0.75
            }}
        >
            <SafeAreaView style={styles.safeAreaView}>
                <SCLAlert
                    theme="warning"
                    show={ShowWarning}
                    title="Çıkış Yap"
                    subtitle="Hesabınızdan çıkılsın mı?"
                >
                    <SCLAlertButton theme="warning" onPress={() => {
                        setLoading(true);
                        auth().signOut()
                            .then(() => {
                                setLoading(false);
                            })
                            .catch((err) => {
                                console.log('Hata: ', err)
                            })
                    }}>Çıkış Yap</SCLAlertButton>
                    <SCLAlertButton theme="default" onPress={() => setShowWarning(false)}>Vazgeç</SCLAlertButton>
                </SCLAlert>
                <ScrollView
                    style={{
                        margin: 0,
                        width: width * 0.75
                    }}>
                    <View style={styles.container}>
                        <SpinnerLoading Loading={Loading} />

                        <View style={styles.itemStyle}>
                            <Image style={styles.imageView} resizeMode="cover" source={{ uri: profileData.profile_picture !== '' && profileData.profile_picture !== undefined ? profileData.profile_picture : 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png' }} />
                            <Text style={styles.textName}>{profileData.name}</Text>
                        </View>

                        <TouchableOpacity onPress={() => {
                            onClose();
                            setShowSideModal(!ShowSideModal);
                            setTimeout(() => {
                                navigation.navigate('ANASAYFA');
                            }, 100);
                        }} style={styles.itemStyle}>
                            <Text style={styles.text}>Ana Sayfa</Text>
                            {currentRoute === "ANASAYFA" &&
                                <View style={{ marginTop: 5, height: 5, width: 5, borderRadius: 100, backgroundColor: 'yellow' }} />
                            }
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => {
                            onClose();
                            setShowSideModal(!ShowSideModal);
                            setTimeout(() => {
                                navigation.navigate('ANTRENMAN');
                            }, 100);
                        }} style={styles.itemStyle}>
                            <Text style={styles.text}>Antrenman</Text>
                            {currentRoute === "ANTRENMAN" &&
                                <View style={{ marginTop: 5, height: 5, width: 5, borderRadius: 100, backgroundColor: 'yellow' }} />
                            }
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => {
                            onClose();
                            setShowSideModal(!ShowSideModal);
                            setTimeout(() => {
                                navigation.navigate('BESLENME');
                            }, 100);
                        }} style={styles.itemStyle}>
                            <Text style={styles.text}>Beslenme</Text>
                            {currentRoute === "BESLENME" &&
                                <View style={{ marginTop: 5, height: 5, width: 5, borderRadius: 100, backgroundColor: 'yellow' }} />
                            }
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => {
                            onClose();
                            setShowSideModal(!ShowSideModal);
                            setTimeout(() => {
                                navigation.navigate('PROFİLİM');
                            }, 100);
                        }} style={styles.itemStyle}>
                            <Text style={styles.text}>Profil</Text>
                            {currentRoute === "PROFİLİM" &&
                                <View style={{ marginTop: 5, height: 5, width: 5, borderRadius: 100, backgroundColor: 'yellow' }} />
                            }
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => {
                            onClose();
                            setShowSideModal(!ShowSideModal);
                            setTimeout(() => {
                                navigation.navigate('TumGecmisler');
                            }, 100);
                        }} style={styles.itemStyle}>
                            <Text style={styles.text2}>Geçmiş</Text>
                            {currentRoute === "Gecmis" &&
                                <View style={{ marginTop: 5, height: 5, width: 5, borderRadius: 100, backgroundColor: 'yellow' }} />
                            }
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => {
                            onClose();
                            setShowSideModal(!ShowSideModal);
                            setTimeout(() => {
                                navigation.navigate('FavoritedWorkouts');
                            }, 100);
                        }} style={styles.itemStyle}>
                            <Text style={styles.text2}>Favori Antrenmanlarım</Text>
                            {currentRoute === "FavoritedWorkouts" &&
                                <View style={{ marginTop: 5, height: 5, width: 5, borderRadius: 100, backgroundColor: 'yellow' }} />
                            }
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => {
                            onClose();
                            setShowSideModal(!ShowSideModal);
                            setTimeout(() => {
                                navigation.navigate('FavoritedFoods');
                            }, 100);
                        }} style={styles.itemStyle}>
                            <Text style={styles.text2}>Favori Öğünlerim</Text>
                            {currentRoute === "FavoritedFoods" &&
                                <View style={{ marginTop: 5, height: 5, width: 5, borderRadius: 100, backgroundColor: 'yellow' }} />
                            }
                        </TouchableOpacity>

                        {/* <TouchableOpacity onPress={() => {
                        onClose();
                        setShowSideModal(!ShowSideModal);
                        setTimeout(() => {
                            navigation.navigate('ArkadasinaOner');
                        }, 100);
                    }} style={styles.itemStyle}>
                        <Text style={styles.text2}>Arkadaşına Öner</Text>
                    </TouchableOpacity> */}

                        <TouchableOpacity onPress={() => {
                            onClose();
                            setShowSideModal(!ShowSideModal);
                            setTimeout(() => {
                                navigation.navigate('WorkoutLib');
                            }, 100);
                        }} style={styles.itemStyle}>
                            <Text style={styles.text2}>Egzersiz Kütüphanesi</Text>
                            {currentRoute === "WorkoutLib" &&
                                <View style={{ marginTop: 5, height: 5, width: 5, borderRadius: 100, backgroundColor: 'yellow' }} />
                            }
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => {
                            onClose();
                            setShowSideModal(!ShowSideModal);
                            setTimeout(() => {
                                navigation.navigate('FoodLib');
                            }, 100);
                        }} style={styles.itemStyle}>
                            <Text style={styles.text2}>Besin Kütüphanesi</Text>
                            {currentRoute === "FoodLib" &&
                                <View style={{ marginTop: 5, height: 5, width: 5, borderRadius: 100, backgroundColor: 'yellow' }} />
                            }
                        </TouchableOpacity>

                        {/* <TouchableOpacity onPress={() => {
                            onClose();
                            setShowSideModal(!ShowSideModal);
                            setTimeout(() => {
                                navigation.navigate('Premium');
                            }, 100);
                        }} style={styles.itemStyle}>
                            <Text style={[styles.text2, { fontWeight: 'bold' }]}>Üyelik (Premium)</Text>
                            {currentRoute === "Premium" &&
                                <View style={{ marginTop: 5, height: 5, width: 5, borderRadius: 100, backgroundColor: 'yellow' }} />
                            }
                        </TouchableOpacity> */}

                        <TouchableOpacity onPress={() => {
                            onClose();
                            setShowSideModal(!ShowSideModal);
                            setTimeout(() => {
                                navigation.navigate('Settings');
                            }, 100);
                        }} style={styles.itemStyle}>
                            <Text style={styles.text2}>Ayarlar</Text>
                            {currentRoute === "Settings" &&
                                <View style={{ marginTop: 5, height: 5, width: 5, borderRadius: 100, backgroundColor: 'yellow' }} />
                            }
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity onPress={() => setShowWarning(true)} style={styles.itemStyle}>
                        <Text style={styles.text2}>Çıkış Yap</Text>
                    </TouchableOpacity>
                </ScrollView>
            </SafeAreaView>
        </Modal>
    )
}


const styles = StyleSheet.create({
    safeAreaView: {
        flex: 1,
        backgroundColor: "#111111",
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    container: {
        marginVertical: 20,
        flex: 1,
        alignItems: 'center'
    },
    text: {
        color: themeColors.yellow,
        fontFamily: themeFonts.mediumText,
        fontSize: 16
    },
    text2: {
        color: themeColors.lightGray,
        fontFamily: themeFonts.mediumText,
        fontSize: 16
    },
    textName: {
        marginTop: 20,
        color: themeColors.white,
        fontFamily: themeFonts.boldText,
        fontSize: 18
    },
    imageView: {
        borderRadius: 100,
        backgroundColor: 'red',
        height: 100,
        width: 100
    },
    itemStyle: {
        width: '100%',
        padding: 15,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default Sidebar;
