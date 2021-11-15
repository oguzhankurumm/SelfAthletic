import React, { useState } from 'react'
import { View, Text, StyleSheet, StatusBar, Image, SafeAreaView, TouchableOpacity, ImageBackground, Dimensions, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SpinnerLoading from '../../components/SpinnerLoading';
import { Textarea } from 'native-base';
import { useSelector } from 'react-redux';
import moment from 'moment';
import axios from 'axios';
import { storage } from '../../config/config';
import ImagePicker from 'react-native-image-crop-picker';

const { height, width } = Dimensions.get("window");

const SendPost = props => {
    const profileData = useSelector(state => state.authReducer.currentUser);

    const [Loading, setLoading] = useState(false);
    const [myText, setmyText] = useState("");
    const [addedimage, setaddedimage] = useState("");

    const SharePost = async () => {

        if (myText === "") {
            Alert.alert("Hata", "Paylaşım boş olamaz!", [
                { text: "Tekrar Dene", onPress: () => null, style: 'cancel' }
            ])
        } else {
            setLoading(true);
            let data = {};

            if (addedimage === "") {
                data = {
                    date: moment().format("DD/MM/YYYYTHH:mm:ss"),
                    ownerId: profileData.userId,
                    title: myText,
                    type: "text"
                }
            } else {
                data = {
                    date: moment().format("DD/MM/YYYYTHH:mm:ss"),
                    ownerId: profileData.userId,
                    title: myText,
                    image: addedimage,
                    type: "image"
                }
            }

            await axios.post("https://us-central1-selfathletic-d8b9a.cloudfunctions.net/app/sendPost", { data: data, userid: profileData.userId })
                .then((res) => {
                    if (res.status === 200) {
                        setLoading(false);
                        setmyText("");
                        setaddedimage("");
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


    const onButtonPress = (e) => {

        ImagePicker.openPicker({
            cropperCircleOverlay: true,
            freeStyleCropEnabled: true,
            avoidEmptySpaceAroundImage: true,
            cropperToolbarTitle: "Fotoğraf Seçin",
            loadingLabelText: "Yükleniyor...",
            cropperChooseText: "Seç",
            cropperCancelText: "Vazgeç",
            mediaType: "photo",
            cropping: true,
            includeBase64: true,
            width: 500,
            height: 500,
            compressImageQuality: 0.5,
            compressImageMaxHeight: 500,
            compressImageMaxWidth: 500
        }).then(image => {

            const imguri = image.path

            setLoading(true);
            submitImg(imguri)

        }).catch(error => {
            setLoading(false);
        });

    }

    const submitImg = async (imguri) => {

        const uploadUri = imguri;
        const updateTime = moment().unix();
        const storagePath = `${'feed'}/${profileData.userId}/${profileData.userId}_${updateTime}.jpg`;
        const fileMetaData = { contentType: 'image/jpeg' };

        const task = await storage().ref().child(storagePath).putFile(uploadUri, fileMetaData)
            .then(async (snapshot) => {

                let imageRef = await storage().ref();

                imageRef.child(snapshot.metadata.fullPath).getDownloadURL().then(async function (url) {
                    setaddedimage(url);
                    setLoading(false);
                }).catch(function (error) {
                    Alert.alert('Hata', String(error))
                    setTimeout(() => {
                        setLoading(false);
                    }, 200);
                });
            })
            .catch((err) => {
                Alert.alert('Hata', String(err))
                setTimeout(() => {
                    setLoading(false);
                }, 200);
            })

        try {
            await task;
        } catch (e) {
            Alert.alert('Hata', String(e))
            setTimeout(() => {
                setLoading(false);
            }, 200);
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
                        style={{ color: '#FFF', borderRadius: 12, backgroundColor: '#202026' }}
                        rowSpan={8}
                        onChangeText={(yorum) => setmyText(yorum)}
                        value={myText}
                        placeholder="Buraya yazabilirsiniz..."
                        placeholderTextColor='#FFF'
                        fontFamily='SFProDisplay-Medium'
                        fontWeight='400'
                        fontSize={15}
                    />
                    {addedimage === "" ?
                        <TouchableOpacity
                            style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}
                            onPress={() => onButtonPress()}
                        >
                            <Icon name="photo" size={32} color="#FFF" />
                            <Text style={{ fontFamily: 'SFProDisplay-Medium', color: "#FFF", paddingLeft: 10, fontSize: 16 }}>Medya Ekle</Text>
                        </TouchableOpacity>
                        :
                        <View style={{ marginTop: 20, borderRadius: 18, width: 120, height: 120 }}>
                            <Image
                                style={{ width: 120, height: 120, borderRadius: 18 }}
                                resizeMode="cover"
                                source={{ uri: addedimage }} />
                            <Icon onPress={() => setaddedimage("")} name="delete" size={32} color="#FFF" style={{ position: 'absolute', bottom: 5, right: 5 }} />
                        </View>
                    }
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