import React, { useState } from 'react'
import { View, Text, StyleSheet, StatusBar, Image, SafeAreaView, TouchableOpacity, ImageBackground, Dimensions, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SpinnerLoading from '../../components/SpinnerLoading';
import { Textarea } from 'native-base';
import { useSelector } from 'react-redux';
import moment from 'moment';
import axios from 'axios';

const { height, width } = Dimensions.get("window");

const SendPost = props => {
    const profileData = useSelector(state => state.user.users);

    const [Loading, setLoading] = useState(false);
    const [myText, setmyText] = useState("");
    const [Image, setImage] = useState("");

    const SharePost = async () => {

        if (myText === "") {
            Alert.alert("Hata", "Paylaşım boş olamaz!", [
                { text: "Tekrar Dene", onPress: () => null, style: 'cancel' }
            ])
        } else {
            setLoading(true);
            const data = {
                date: moment().format("DD/MM/YYYYTHH:mm:ss"),
                title: myText,
                type: "text"
            }

            await axios.post("https://us-central1-selfathletic-d8b9a.cloudfunctions.net/app/sendPost", { data: data, userid: profileData.userId })
                .then((res) => {
                    if (res.status === 200) {
                        setLoading(false);
                        setmyText("");
                        setTimeout(() => {
                            Alert.alert('Başarılı', 'Paylaşım yapıldı.', [
                                { text: 'Geri Dön', onPress: () => props.navigation.goBack(), style: 'cancel' }
                            ])
                        }, 200);
                    }
                })
                .catch((err) => {
                    setLoading(false);
                    setTimeout(() => {
                        Alert.alert('Hata', String(err))
                    }, 200);
                })
        }

    }

    return (
        <ImageBackground style={{ height: height, width: width }} resizeMode="cover" source={require('../../img/bg.jpg')}>
            <StatusBar barStyle="light-content" />

            <SafeAreaView style={styles.container}>
                <SpinnerLoading Loading={Loading} />

                <View style={styles.header}>
                    <TouchableOpacity onPress={() => props.navigation.goBack()} style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                        <Icon name="keyboard-arrow-left" color="#FFF" size={42} style={{ marginRight: 15 }} />
                        <Text style={styles.headerText}>Paylaşım Yap</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ marginTop: 10, marginHorizontal: 30, borderRadius: 12 }}>
                    <Textarea allowFontScaling={false}
                        blurOnSubmit={true}
                        returnKeyType="done"
                        maxLength={280}
                        style={{ color:'#FFF', height: height / 3, borderRadius: 12, backgroundColor: '#202026' }}
                        rowSpan={2}
                        onChangeText={(yorum) => setmyText(yorum)}
                        value={myText}
                        placeholder="Buraya yazabilirsiniz..."
                        placeholderTextColor='#FFF'
                        fontFamily='SFProDisplay-Medium'
                        fontWeight='400'
                        fontSize={15}
                    />
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
                <TouchableOpacity onPress={SharePost} style={{
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
                    }}>Paylaş</Text>
                </TouchableOpacity>
            </View>

        </ImageBackground >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
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
        fontFamily: 'SFProDisplay-Bold',
        fontSize: 18,
        color: '#FFF'
    }
})

export default SendPost;