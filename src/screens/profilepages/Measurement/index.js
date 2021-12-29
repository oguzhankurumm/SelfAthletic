import React, { useState, useRef } from 'react'
import { View, Text, SafeAreaView, Alert, Dimensions, TextInput, Image } from 'react-native';
import { useSelector } from 'react-redux';
import styles from './style';
import moment from 'moment';
import { firestore } from '../../../config/config';
import Carousel from 'react-native-snap-carousel';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import ImageLayout from '../../../components/image-layout';
import BottomButton from '../../../components/bottom-button';
import { showMessage } from 'react-native-flash-message';

const { height, width } = Dimensions.get("window");

const Measurement = ({ navigation }) => {
    const _carousel = useRef(null);
    const profileData = useSelector(state => state.authReducer.currentUser);
    const [Loading, setLoading] = useState(false);
    const [NewValue, setNewValue] = useState(0);
    const [Olcumler, setOlcumler] = useState([
        { name_val: "gogus", name: "Göğüs", image: "https://i.ibb.co/qFncfM2/gogus.png", index: 0, value: 0, description: 'Ayaktayken kolları yana açınız, normal solunum esnasındayken mezurayı koltuk altından göğüs kafesinin orta noktasına doğru sarıp ve ölçümü yapınız.' },
        { name_val: "omuz", name: "Omuz", image: "https://i.ibb.co/qxSTrFq/omuz.png", index: 1, value: 0, description: 'Ayakta,kollar yanda serbest durunuz. Omzunuzun olduğu bölgede yer alan kemik noktası ve omuz kaslarınız geniş bölümüne denk gelecek şekilde yapınız.' },
        { name_val: "bel", name: "Bel", image: "https://i.ibb.co/Czjzq7y/bel.png", index: 2, value: 0, description: 'Kollar yanda, ayaklar bitişik, karın rahat pozisyonda olmalıdır. En alt kaburga kemiğinizin altı ile kalça kemiğinizin üst kısmı arasındaki orta noktaya mezuranızı yerleştirin. Vücudunuzun “en dar kıvrıma” denk gelecek bölgede, dokuyu sıkıştırmadan ölçümüzü yapınız.' },
        { name_val: "karin", name: "Karın", image: "https://i.ibb.co/0MxMVDq/karin.png", index: 3, value: 0, description: 'Ölçüm, ayakta ve kollar yandayken yapılır. En geniş bölümde “göbek noktası” seviyesinden dokuyu sıkıştırmadan ölçümü alınız.' },
        { name_val: "kol", name: "Kol", image: "https://i.ibb.co/tc6QBz6/kol.png", index: 4, value: 0, description: 'Dirsek bükülü halde, pazıların en geniş kısmının olduğu noktada mezura ölçümünü yapınız.' },
        { name_val: "kalca", name: "Kalça", image: "https://i.ibb.co/rFZ5sk5/kalca.png", index: 5, value: 0, description: 'Yan taraftan bakıldığında arka kısımda kalça kaslarına en geniş seviyesine denk gelen bölümde mezura ölçümüzü yapınız.' }
    ].sort((a, b) => a.index - b.index))

    const showNullAlert = () => {
        showMessage({
            message: "Ölçü Eksik",
            description: `Lütfen ${Olcumler[_carousel?.current?._activeItem].name} ölçünüzü girin.`,
            type: "warning",
            icon: "warning",
            duration: 3000
        })
    }

    const SaveData = async () => {
        const dateNow = moment().format('DD-MM-YYYY');
        let data = {
            values: [
                { name: "chest", title: "Göğüs", value: Olcumler.find(i => i.name_val === "gogus").value },
                { name: "waist", title: "Bel", value: Olcumler.find(i => i.name_val === "bel").value },
                { name: "belly", title: "Karın", value: Olcumler.find(i => i.name_val === "karin").value },
                { name: "arm", title: "Kol", value: Olcumler.find(i => i.name_val === "kol").value },
                { name: "shoulder", title: "Omuz", value: Olcumler.find(i => i.name_val === "omuz").value },
                { name: "hip", title: "Kalça", value: Olcumler.find(i => i.name_val === "kalca").value }
            ],
            date: dateNow
        };

        try {
            setLoading(true);
            await firestore().collection('users').doc(profileData.userId).collection('measurements').add(data);
            navigation.goBack();
            showMessage({
                message: "Başarılı",
                description: 'Tebrikler, ölçümler tamamlandı ve kaydedildi.',
                type: "success",
                icon: "success",
                duration: 3000
            })
            setLoading(false);
        } catch (error) {
            setLoading(false);
            Alert.alert('Hata', String(err));
        }
    }

    const _renderItem = ({ item, index }) => {
        return (
            <KeyboardAwareScrollView extraHeight={150}
                enableOnAndroid={true}
                animated={true}
                key={index}
                style={{ height, width: '100%' }}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
            >
                <View style={{ width: '100%' }}>
                    {!Loading && !Olcumler[index] !== undefined &&
                        <>
                            <View style={{ position: 'absolute', width: '100%', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }}>
                                <Text style={styles.name}>{item.name} Ölçüsü</Text>
                                <Text style={styles.description}>{item.description}</Text>
                            </View>

                            <Image source={{ uri: item.image }} resizeMode="contain" style={{ width: '100%', height: height / 1.5, marginTop: 20 }} />

                            <View style={{ position: 'absolute', bottom: 0, width: '100%', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }}>
                                <Text style={styles.inputTitle}>{Olcumler[index].value} cm.</Text>

                                <TextInput
                                    value={parseFloat(NewValue)}
                                    style={styles.input}
                                    onChangeText={(val) => {
                                        if (val.length !== 0) {
                                            Olcumler[index].value = parseFloat(val).toFixed(1);
                                            setNewValue(parseFloat(val).toFixed(1));
                                        } else {
                                            Olcumler[index].value = parseFloat(0);
                                            setNewValue(parseFloat(0));
                                        }
                                    }}
                                    textAlign="center"
                                    autoCorrect={false}
                                    autoCapitalize="none"
                                    allowFontScaling={false}
                                    maxLength={5}
                                    placeholder="0 cm."
                                    returnKeyType={"done"}
                                    keyboardType={"decimal-pad"}
                                />
                            </View>
                        </>

                    }
                </View>
            </KeyboardAwareScrollView>
        );
    }

    return (
        <ImageLayout
            title="Mezura Ölçümleri"
            showBack
            isScrollable={false}
        >
            <SafeAreaView style={styles.container}>

                <View style={{ justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 50 }}>
                    {!Loading &&
                        <Carousel
                            scrollEnabled={true}
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
            </SafeAreaView>

            {_carousel?.current?._activeItem + 1 !== Olcumler.length ?
                <BottomButton
                    title="Devam Et"
                    onPress={() => {
                        if (parseFloat(Olcumler[_carousel?.current?._activeItem].value) >= 1) {
                            _carousel?.current?.snapToNext();
                        } else {
                            showNullAlert();
                        }
                    }}
                />
                :
                <BottomButton
                    title="Kaydet"
                    onPress={SaveData}
                />
            }
        </ImageLayout>
    )
}

export default Measurement;