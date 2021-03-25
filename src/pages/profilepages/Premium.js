import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import SpinnerLoading from '../../components/SpinnerLoading';
import Icon from 'react-native-vector-icons/MaterialIcons'

const Premium = ({ props, navigation }) => {

    const [Loading, setLoading] = useState(false);
    const [selectedType, setselectedType] = useState(0);

    return (
        <View style={{ flex: 1, backgroundColor: '#1E2537', paddingHorizontal: 30, paddingVertical: 50, alignItems: 'center', justifyContent: 'space-between' }}>
            <SpinnerLoading Loading={Loading} />

            <TouchableOpacity style={{ position: 'absolute', top: 50, left: 30, height: 50, width: 50 }} onPress={() => navigation.goBack()}>
                <View style={{ backgroundColor: '#FFF', borderRadius: 50, justifyContent: 'center', alignItems: 'center', height: 45, width: 45 }}>
                    <Icon name="keyboard-arrow-left" size={25} color="#000" style={{ top: 1 }} />
                </View>
            </TouchableOpacity>

            <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: 60 }}>
                <Text style={styles.textHeader}>Premium Üyelik</Text>

                <View style={{ marginTop: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name="check" color="#FFF" size={20} />
                    <Text style={styles.textHeaderSub}>Size özel antrenmanlar</Text>
                </View>

                <View style={{ marginTop: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name="check" color="#FFF" size={20} />
                    <Text style={styles.textHeaderSub}>Size özel besinler</Text>
                </View>

                <View style={{ marginTop: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name="check" color="#FFF" size={20} />
                    <Text style={styles.textHeaderSub}>Diğer özellikler</Text>
                </View>
            </View>

            <View style={styles.premiumView}>
                <TouchableOpacity onPress={() => setselectedType(0)} style={selectedType === 0 ? [styles.premiumContainerSelected, { marginTop: 0 }] : [styles.premiumContainer, { marginTop: 0 }]}>
                    <Text style={selectedType === 0 ? styles.textSubSelected : styles.textSub}>1 Yıllık Üyelik</Text>
                    <Text style={selectedType === 0 ? styles.textSub2Selected : styles.textSub2}>29.99₺/yıl</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setselectedType(1)} style={selectedType === 1 ? styles.premiumContainerSelected : styles.premiumContainer}>
                    <Text style={selectedType === 1 ? styles.textSubSelected : styles.textSub}>6 Aylık Üyelik</Text>
                    <Text style={selectedType === 1 ? styles.textSub2Selected : styles.textSub2}>29.99₺/yıl</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setselectedType(2)} style={selectedType === 2 ? styles.premiumContainerSelected : styles.premiumContainer}>
                    <Text style={selectedType === 2 ? styles.textSubSelected : styles.textSub}>3 Aylık Üyelik</Text>
                    <Text style={selectedType === 2 ? styles.textSub2Selected : styles.textSub2}>29.99₺/yıl</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setselectedType(3)} style={selectedType === 3 ? styles.premiumContainerSelected : styles.premiumContainer}>
                    <Text style={selectedType === 3 ? styles.textSubSelected : styles.textSub}>1 Aylık Üyelik</Text>
                    <Text style={selectedType === 3 ? styles.textSub2Selected : styles.textSub2}>29.99₺/yıl</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => Alert.alert('Yes', String(selectedType))} style={styles.bottomButton}>
                <Text style={styles.textBottomButton}>Üyeliğimi Başlat</Text>
            </TouchableOpacity>
        </View >
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