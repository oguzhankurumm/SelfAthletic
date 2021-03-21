import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, Dimensions, SafeAreaView, Image, ImageBackground, TouchableHighlight } from 'react-native';
import { auth2 } from '../../config/config';
import { ProgressChart } from 'react-native-chart-kit';
import SpinnerLoading from '../../components/SpinnerLoading';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { height, width } = Dimensions.get("window");


const Profile = ({ props, navigation }) => {


    const [Loading, setLoading] = useState(false);
    const profileData = useSelector(state => state.user.users);
    const [SelectedPage, setSelectedPage] = useState(0)

    const data = {
        labels: ["Kalori", "Adım Sayısı", "Egzersiz"],
        data: [0.4, 0.6, 0.8]
    };

    const chartConfig = {
        backgroundGradientToOpacity: 0.5,
        color: (opacity = 1) => `#FFF`,
        strokeWidth: 1,
        barPercentage: 0.5,
        useShadowColorFromDataset: false
    };


    return (
        <ImageBackground style={{ height: height, width: width }} resizeMode="cover" source={require('../../img/bg.jpg')}>
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="light-content" />
                <SpinnerLoading Loading={Loading} />


                <View style={styles.header} >
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                        <Icon name="grid-view" color="#FFF" size={28} style={{ marginRight: 15 }} />
                        <Text style={styles.headerText}>Profil</Text>

                    </View>

                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>

                        <TouchableHighlight onPress={() => navigation.navigate('FeedList')}>
                            <Icon name="comment" color="#FFF" size={28} style={{ marginRight: 20 }} />
                        </TouchableHighlight>

                        <TouchableHighlight onPress={() => alert('ayarlar')}>
                            <Icon name="settings" color="#FFF" size={28} />
                        </TouchableHighlight>

                    </View>
                </View>

                <View style={styles.profileView}>
                    <Image style={styles.imageView} source={{ uri: profileData.avatar }} />
                    <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                        <Text style={styles.nameText}>{profileData.firstname + ' ' + profileData.lastname}</Text>
                    </View>
                </View>


                <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 30 }}>

                    <TouchableOpacity onPress={() => setSelectedPage(0)} style={{ justifyContent: 'flex-start', alignItems: 'center' }}>
                        <Text style={SelectedPage === 0 ? styles.TabsTextActive : styles.TabsTextDisabled}>Seviye</Text>
                        {SelectedPage === 0 ?
                            <View style={{ marginTop: 5, backgroundColor: 'yellow', borderRadius: 50, height: 5, width: 5 }} />
                            :
                            <View style={{ marginTop: 5, borderRadius: 50, height: 5, width: 5 }} />
                        }
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setSelectedPage(1)} style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={styles.TabsTextActive}>Geçmiş</Text>
                        {SelectedPage === 1 ?
                            <View style={{ marginTop: 5, backgroundColor: 'yellow', borderRadius: 50, height: 5, width: 5 }} />
                            :
                            <View style={{ marginTop: 5, borderRadius: 50, height: 5, width: 5 }} />
                        }
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setSelectedPage(2)} style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={styles.TabsTextActive}>Ölçümler</Text>
                        {SelectedPage === 2 ?
                            <View style={{ marginTop: 5, backgroundColor: 'yellow', borderRadius: 50, height: 5, width: 5 }} />
                            :
                            <View style={{ marginTop: 5, borderRadius: 50, height: 5, width: 5 }} />
                        }
                    </TouchableOpacity>
                </View>

                <View style={styles.iconsContainer}>
                    <View style={styles.iconsView}>
                        <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: width / 3 }}>
                            <Icon name="directions-run" color="yellow" size={32} style={{ marginBottom: 10 }} />
                            <Text style={styles.iconsText}>Aktif</Text>
                            <Text style={styles.iconsText}>Gün</Text>
                            <Text style={styles.iconsText}>Sayısı</Text>
                            <Text style={styles.iconsNumber}>40</Text>
                        </View>

                        <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: width / 3 }}>
                            <Icon name="people" color="yellow" size={32} style={{ marginBottom: 10 }} />
                            <Text style={styles.iconsText}>Hedef</Text>
                            <Text style={styles.iconsText}>Tutturma</Text>
                            <Text style={styles.iconsText}>Yüzdesi</Text>
                            <Text style={styles.iconsNumber}>%30</Text>
                        </View>

                        <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: width / 3 }}>
                            <Icon name="people" color="yellow" size={32} style={{ marginBottom: 10 }} />
                            <Text style={styles.iconsText}>Tamamlanan</Text>
                            <Text style={styles.iconsText}>Egzersiz</Text>
                            <Text style={styles.iconsText}>Sayısı</Text>
                            <Text style={styles.iconsNumber}>27</Text>
                        </View>
                    </View>


                    <View style={styles.iconsView}>
                        <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: width / 3 }}>
                            <Icon name="people" color="yellow" size={32} style={{ marginBottom: 10 }} />
                            <Text style={[styles.iconsText, { textDecorationLine: "underline" }]}>En İyi Gün</Text>
                            <Text style={styles.iconsNumber}>16</Text>
                            <Text style={styles.iconsDate}>Mart 2021</Text>
                        </View>

                        <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: width / 3 }}>
                            <Icon name="people" color="yellow" size={32} style={{ marginBottom: 10 }} />
                            <Text style={[styles.iconsText, { textDecorationLine: "underline" }]}>En İyi Hafta</Text>
                            <Text style={styles.iconsNumber}>16</Text>
                            <Text style={styles.iconsDate}>Mart 2021</Text>
                        </View>

                        <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: width / 3 }}>
                            <Icon name="people" color="yellow" size={32} style={{ marginBottom: 10 }} />
                            <Text style={[styles.iconsText, { textDecorationLine: "underline" }]}>En İyi Ay</Text>
                            <Text style={styles.iconsNumber}>16</Text>
                            <Text style={styles.iconsDate}>Mart 2021</Text>
                        </View>
                    </View>
                </View>

                {/* 
                <View style={{ alignItems: 'center', width: '100%', marginRight: 70 }}>
                    <ProgressChart
                        data={data}
                        width={width}
                        height={220}
                        strokeWidth={16}
                        radius={32}
                        chartConfig={chartConfig}
                        hideLegend={false}
                    />
                </View> */}


                {/* <TouchableOpacity onPress={() => auth2.signOut()}>
                <Text style={{ color: '#FFF' }}>Çıkış Yap</Text>
            </TouchableOpacity> */}

            </SafeAreaView>
        </ImageBackground >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
    TabsTextActive: {
        fontFamily: 'SFProDisplay-Bold',
        fontSize: 16,
        paddingVertical: 1,
        color: 'yellow'
    },
    TabsTextDisabled: {
        fontFamily: 'SFProDisplay-Bold',
        fontSize: 16,
        paddingVertical: 1,
        color: 'white'
    },
    nameText: {
        marginTop: 20,
        fontFamily: 'SFProDisplay-Bold',
        fontSize: 18,
        color: '#FFF'
    },
    imageView: {
        borderRadius: 100,
        backgroundColor: 'red',
        height: 120,
        width: 120
    },
    profileView: {
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%'
    },
    iconsContainer: {
        flexDirection: 'column',
        paddingVertical: 20,
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%'
    },
    iconsView: {
        flexDirection: 'row',
        paddingVertical: 20,
        justifyContent: 'space-evenly',
        alignItems: 'center',
        width: '100%'
    },
    iconsText: {
        fontFamily: 'SFProDisplay-Medium',
        fontSize: 13,
        paddingVertical: 1,
        color: '#FFF'
    },
    iconsNumber: {
        marginTop: 10,
        fontFamily: 'SFProDisplay-Bold',
        fontSize: 18,
        color: '#FFF'
    },
    iconsDate: {
        marginTop: 5,
        fontFamily: 'SFProDisplay-Bold',
        fontSize: 12,
        color: '#FFF'
    },
    header: {
        width: '100%',
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 30
    },
    headerText: {
        fontFamily: 'SFProDisplay-Medium',
        fontSize: 18,
        color: '#FFF'
    }
})
export default Profile;