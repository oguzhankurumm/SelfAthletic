import React, { useState } from 'react'
import { View, SafeAreaView, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native'
import { useSelector } from 'react-redux';
import Modal from 'react-native-modal';
import { auth2 } from '../config/config';

const { height, width } = Dimensions.get("window");

const Sidebar = ({ navigation, opened, onClose, selected }) => {
    const profileData = useSelector(state => state.user.users);
    const [Selected, setSelected] = useState(selected);
    const [ShowSideModal, setShowSideModal] = useState(opened)

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
                <View style={styles.container}>
                    <View style={styles.itemStyle}>
                        <Image style={styles.imageView} source={{ uri: profileData.avatar !== '' ? profileData.avatar : 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png' }} />
                        <Text style={styles.textName}>{profileData.name}</Text>
                    </View>

                    <TouchableOpacity onPress={() => {
                        setSelected('');
                        onClose();
                        setShowSideModal(!ShowSideModal);
                        setTimeout(() => {
                            navigation.navigate('Home');
                        }, 100);
                    }} style={styles.itemStyle}>
                        <Text style={styles.text}>Ana Sayfa</Text>
                        {Selected === "Home" &&
                            <View style={{ marginTop: 5, height: 5, width: 5, borderRadius: 100, backgroundColor: 'yellow' }} />
                        }
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {
                        setSelected('')
                        onClose();
                        setShowSideModal(!ShowSideModal);
                        setTimeout(() => {
                            navigation.navigate('Workouts');
                        }, 100);
                    }} style={styles.itemStyle}>
                        <Text style={styles.text}>Antrenman</Text>
                        {Selected === "Workouts" &&
                            <View style={{ marginTop: 5, height: 5, width: 5, borderRadius: 100, backgroundColor: 'yellow' }} />
                        }
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {
                        onClose();
                        setShowSideModal(!ShowSideModal);
                        setTimeout(() => {
                            navigation.navigate('Beslenme');
                        }, 100);
                    }} style={styles.itemStyle}>
                        <Text style={styles.text}>Beslenme</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {
                        onClose();
                        setShowSideModal(!ShowSideModal);
                        setTimeout(() => {
                            navigation.navigate('Profile');
                        }, 100);
                    }} style={styles.itemStyle}>
                        <Text style={styles.text}>Profil</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {
                        onClose();
                        setShowSideModal(!ShowSideModal);
                        setTimeout(() => {
                            navigation.navigate('FavoritedWorkouts');
                        }, 100);
                    }} style={styles.itemStyle}>
                        <Text style={styles.text2}>Favori Antrenmanlarım</Text>
                        {Selected === "FavoritedWorkouts" &&
                            <View style={{ marginTop: 5, height: 5, width: 5, borderRadius: 100, backgroundColor: 'yellow' }} />
                        }
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {
                        onClose();
                        setShowSideModal(!ShowSideModal);
                        setTimeout(() => {
                            navigation.navigate('Profile');
                        }, 100);
                    }} style={styles.itemStyle}>
                        <Text style={styles.text2}>Favori Öğünlerim</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {
                        onClose();
                        setShowSideModal(!ShowSideModal);
                        setTimeout(() => {
                            navigation.navigate('Profile');
                        }, 100);
                    }} style={styles.itemStyle}>
                        <Text style={styles.text2}>Arkadaşına Öner</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {
                        onClose();
                        setShowSideModal(!ShowSideModal);
                        setTimeout(() => {
                            navigation.navigate('Profile');
                        }, 100);
                    }} style={styles.itemStyle}>
                        <Text style={styles.text2}>Egzersiz Kütüphanesi</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {
                        onClose();
                        setShowSideModal(!ShowSideModal);
                        setTimeout(() => {
                            navigation.navigate('Profile');
                        }, 100);
                    }} style={styles.itemStyle}>
                        <Text style={styles.text2}>Besin Kütüphanesi</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {
                        onClose();
                        setShowSideModal(!ShowSideModal);
                        setTimeout(() => {
                            navigation.navigate('Premium');
                        }, 100);
                    }} style={styles.itemStyle}>
                        <Text style={styles.text2}>Üyelik</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {
                        onClose();
                        setShowSideModal(!ShowSideModal);
                        setTimeout(() => {
                            navigation.navigate('Settings');
                        }, 100);
                    }} style={styles.itemStyle}>
                        <Text style={styles.text2}>Ayarlar</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={() => auth2.currentUser.uid !== null ? auth2.signOut() : null} style={styles.itemStyle}>
                    <Text style={styles.text2}>Çıkış Yap</Text>
                </TouchableOpacity>
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
        margin: 12,
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
