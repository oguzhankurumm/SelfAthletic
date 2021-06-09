import React, { useState } from 'react'
import { View, SafeAreaView, Text, StyleSheet, Image, TouchableOpacity, Dimensions, Alert, ScrollView } from 'react-native'
import { useSelector } from 'react-redux';
import Modal from 'react-native-modal';
import { auth2 } from '../config/config';
import SpinnerLoading from '../components/SpinnerLoading';

const { height, width } = Dimensions.get("window");

const Sidebar = ({ navigation, opened, onClose }) => {
    const profileData = useSelector(state => state.user.users);
    const [ShowSideModal, setShowSideModal] = useState(opened)
    const [Loading, setLoading] = useState(false);

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
                <ScrollView
                    style={{
                        margin: 0,
                        width: width * 0.75
                    }}>
                    <View style={styles.container}>
                        <SpinnerLoading Loading={Loading} />

                        <View style={styles.itemStyle}>
                            <Image style={styles.imageView} resizeMode="cover" source={{ uri: profileData.avatar !== '' && profileData.avatar !== undefined ? profileData.avatar : 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png' }} />
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

                        <TouchableOpacity onPress={() => {
                            onClose();
                            setShowSideModal(!ShowSideModal);
                            setTimeout(() => {
                                navigation.navigate('OlcumGecmisi');
                            }, 100);
                        }} style={styles.itemStyle}>
                            <Text style={styles.text2}>Ölçüm Geçmişi</Text>
                            {currentRoute === "OlcumGecmisi" &&
                                <View style={{ marginTop: 5, height: 5, width: 5, borderRadius: 100, backgroundColor: 'yellow' }} />
                            }
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => {
                            onClose();
                            setShowSideModal(!ShowSideModal);
                            setTimeout(() => {
                                navigation.navigate('SuGecmisi');
                            }, 100);
                        }} style={styles.itemStyle}>
                            <Text style={styles.text2}>Su Geçmişi</Text>
                            {currentRoute === "SuGecmisi" &&
                                <View style={{ marginTop: 5, height: 5, width: 5, borderRadius: 100, backgroundColor: 'yellow' }} />
                            }
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => {
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
                        </TouchableOpacity>

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

                    <TouchableOpacity onPress={() => {
                        Alert.alert('Çıkış Yap', 'Hesabınızdan çıkılsın mı?', [
                            {
                                text: 'Evet', onPress: () => {
                                    setLoading(true);
                                    auth2.signOut()
                                        .then(() => {
                                            setLoading(false);
                                        })
                                        .catch((err) => {
                                            setLoading(false);
                                            Alert.alert('Hata', 'Çıkış yapılırken bir hata oluştu.');
                                            console.log('Hata: ', err)
                                        })
                                }, style: 'default'
                            },
                            { text: 'Vazgeç', onPress: () => null, style: 'cancel' }
                        ])
                    }} style={styles.itemStyle}>
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
        color: 'yellow',
        fontFamily: 'SFProDisplay-Medium',
        fontSize: 16
    },
    text2: {
        color: '#D1D1D1',
        fontFamily: 'SFProDisplay-Medium',
        fontSize: 16
    },
    textName: {
        marginTop: 20,
        color: 'white',
        fontFamily: 'SFProDisplay-Bold',
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
