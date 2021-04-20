import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ImageBackground, Dimensions } from 'react-native';
import SpinnerLoading from '../../components/SpinnerLoading';
import Icon from 'react-native-vector-icons/MaterialIcons'
import { useSelector } from 'react-redux';

const { height, width } = Dimensions.get("window");

const Premium = ({ props, navigation }) => {

    const [Loading, setLoading] = useState(false);
    const [selectedType, setselectedType] = useState(0);
    const profileData = useSelector(state => state.user.users);

    console.log('profileData: ', profileData.isPremium)
    return (
        <ImageBackground style={{ height: height, width: width }} resizeMode="cover" source={require('../../img/bg.jpg')}>
            <View style={{ flex: 1, paddingHorizontal: 30, paddingVertical: 50, alignItems: 'center', justifyContent: 'space-between' }}>

                <SpinnerLoading Loading={Loading} />

                <TouchableOpacity style={{ position: 'absolute', top: 60, right: 30, height: 50, width: 50 }} onPress={() => props !== undefined ? props.registerPress : navigation.goBack()}>
                    <View style={{ backgroundColor: '#FFF', borderRadius: 50, justifyContent: 'center', alignItems: 'center', height: 45, width: 45 }}>
                        <Icon name="close" size={28} color="#000" style={{ top: 1 }} />
                    </View>
                </TouchableOpacity>

                <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: 60 }}>
                    <Text style={styles.textHeader}>Premium Üyelik</Text>

                    <View style={{ marginTop: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon name="check" color="#FFF" size={20} />
                        <Text style={styles.textHeaderSub}>Size özel antrenman programları</Text>
                    </View>

                    <View style={{ marginTop: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon name="check" color="#FFF" size={20} />
                        <Text style={styles.textHeaderSub}>Size özel beslesnme programları</Text>
                    </View>

                    <View style={{ marginTop: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon name="check" color="#FFF" size={20} />
                        <Text style={styles.textHeaderSub}>Tüm özelliklerin kilidini açar</Text>
                    </View>
                </View>

                <View style={styles.premiumView}>

                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={[styles.textHeaderSub, { fontWeight: 'bold', fontSize:17 }]}>Hesap Durumunuz: {profileData.isPremium === true ? 'Premium' : 'Deneme Sürümü'}</Text>
                    </View>

                    <TouchableOpacity onPress={() => setselectedType(0)} style={selectedType === 0 ? [styles.premiumContainerSelected] : [styles.premiumContainer]}>
                        <Text style={selectedType === 0 ? styles.textSubSelected : styles.textSub}>1 Yıllık Üyelik</Text>
                        <Text style={selectedType === 0 ? styles.textSub2Selected : styles.textSub2}>239.99₺</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setselectedType(1)} style={selectedType === 1 ? styles.premiumContainerSelected : styles.premiumContainer}>
                        <Text style={selectedType === 1 ? styles.textSubSelected : styles.textSub}>6 Aylık Üyelik</Text>
                        <Text style={selectedType === 1 ? styles.textSub2Selected : styles.textSub2}>179.99₺/yıl</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setselectedType(2)} style={selectedType === 2 ? styles.premiumContainerSelected : styles.premiumContainer}>
                        <Text style={selectedType === 2 ? styles.textSubSelected : styles.textSub}>3 Aylık Üyelik</Text>
                        <Text style={selectedType === 2 ? styles.textSub2Selected : styles.textSub2}>119.99₺/yıl</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setselectedType(3)} style={selectedType === 3 ? styles.premiumContainerSelected : styles.premiumContainer}>
                        <Text style={selectedType === 3 ? styles.textSubSelected : styles.textSub}>1 Aylık Üyelik</Text>
                        <Text style={selectedType === 3 ? styles.textSub2Selected : styles.textSub2}>49.99₺/yıl</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={() => Alert.alert('Yakında', String(selectedType))} style={styles.bottomButton}>
                    <Text style={styles.textBottomButton}>Üyeliğimi Başlat</Text>
                </TouchableOpacity>
            </View >
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    premiumContainer: {
        marginTop: 15,
        width: '100%',
        flexDirection: 'row',
        height: 60,
        backgroundColor: 'white',
        borderRadius: 12,
        paddingHorizontal: 30,
        paddingVertical: 12,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    premiumContainerSelected: {
        marginTop: 15,
        width: '100%',
        flexDirection: 'row',
        height: 60,
        backgroundColor: 'yellow',
        borderRadius: 12,
        paddingHorizontal: 30,
        paddingVertical: 12,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    premiumView: {
        width: '100%'
    },
    textContainer: {
        width: '100%',
        paddingHorizontal: 30
    },
    textHeader: {
        fontFamily: 'SFProDisplay-Bold',
        fontSize: 24,
        color: '#FFF'
    },
    textHeaderSub: {
        fontFamily: 'SFProDisplay-Medium',
        fontSize: 18,
        color: '#FFF',
        marginLeft: 5
    },
    textSub: {
        fontFamily: 'SFProDisplay-Bold',
        fontSize: 16,
        color: '#2D2D2D'
    },
    textSub2: {
        fontFamily: 'SFProDisplay-Medium',
        fontSize: 16,
        color: '#2D2D2D'
    },
    textSubSelected: {
        fontFamily: 'SFProDisplay-Bold',
        fontSize: 16,
        color: '#000'
    },
    textSub2Selected: {
        fontFamily: 'SFProDisplay-Medium',
        fontSize: 16,
        color: '#000'
    },
    closeView: {
        position: 'absolute',
        width: '100%',
        marginTop: 60
    },
    closeButton: {
        fontFamily: 'SFProDisplay-Medium',
        fontSize: 16,
        color: '#FFF'
    },
    textBottomButton: {
        fontFamily: 'SFProDisplay-Bold',
        fontSize: 16,
        color: '#000'
    },
    bottomButton: {
        marginTop: 10,
        width: '100%',
        height: 60,
        backgroundColor: 'yellow',
        borderRadius: 12,
        paddingHorizontal: 30,
        paddingVertical: 12,
        justifyContent: 'center',
        alignItems: 'center'
    },
})

export default Premium;