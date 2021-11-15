import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, StatusBar, Image, SafeAreaView, TouchableOpacity, ImageBackground, TouchableHighlight, Dimensions, FlatList, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon2 from 'react-native-vector-icons/Feather';
import SpinnerLoading from '../../components/SpinnerLoading';
import { database } from '../../config/config';
import { useSelector } from 'react-redux';

const { height, width } = Dimensions.get("window");


const TestList = props => {

    const [Loading, setLoading] = useState(true);
    const [Testler, setTestler] = useState([]);
    const profileData = useSelector(state => state.authReducer.currentUser);

    const GetTestData = async () => {
        let exList = [];
        await database().ref("exams").once("value")
            .then((examsRes) => {
                if (examsRes.val() !== null) {
                    examsRes.forEach((t) => {
                        exList.push({
                            ...t.val(),
                            id: t.key
                        })

                        if (examsRes.numChildren() === exList.length) {
                            setTestler(exList);
                            setTestler(exList);
                            setLoading(false);
                        }
                    })
                } else {
                    setLoading(false);
                    setTimeout(() => {
                        Alert.alert('Test Yok', 'Henüz bir test eklenmemiş.');
                    }, 200);
                }

            })
            .catch(err => {
                setLoading(false);
                setTimeout(() => {
                    Alert.alert('Hata', String(err));
                }, 200);
            })
    }
    useEffect(() => {
        GetTestData();
    }, [])

    return (
        <ImageBackground style={{ height: height, width: width }} resizeMode="cover" source={require('../../img/bg.jpg')}>
            <StatusBar barStyle="light-content" />

            <SafeAreaView style={styles.container}>
                <SpinnerLoading Loading={Loading} />


                <View style={styles.header} >
                    <TouchableOpacity onPress={() => props.navigation.goBack()} style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                        <Icon name="keyboard-arrow-left" color="#FFF" size={42} style={{ marginRight: 15 }} />
                        <Text style={styles.headerText}>Tüm Testler</Text>
                    </TouchableOpacity>

                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>

                        <TouchableHighlight onPress={() => props.navigation.navigate('Feed')}>
                            <Icon name="comment" color="#FFF" size={28} style={{ marginRight: 20 }} />
                        </TouchableHighlight>

                        <TouchableHighlight onPress={() => props.navigation.navigate('Settings')}>
                            <Icon name="settings" color="#FFF" size={28} />
                        </TouchableHighlight>

                    </View>
                </View>

                {!Loading && Testler.length !== 0 ?
                    <FlatList style={{ height: 'auto', paddingHorizontal: 20 }}
                        scrollEnabled={true}
                        data={Testler.sort((a, b) => a.index - b.index)}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={(test) => {
                            return (test.item &&
                                <TouchableOpacity onPress={() => props.navigation.navigate('Testler', { item: test.item })}
                                    style={{
                                        height: 'auto',
                                        width: '100%',
                                        borderRadius: 18,
                                        marginTop: 20
                                    }}>
                                    <Image
                                        resizeMode="cover"
                                        source={{ uri: test.item.image }}
                                        style={{
                                            width: '100%',
                                            height: 200,
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
                                            height: 200
                                        }}
                                    />
                                    <View style={{ position: 'absolute', top: 15, paddingHorizontal: 15 }}>
                                        <Text numberOfLines={3} style={{
                                            fontFamily: 'SFProDisplay-Bold',
                                            fontSize: 20,
                                            color: '#FFF',
                                            marginBottom: 8
                                        }}>{test.item.name}</Text>
                                        <Text numberOfLines={3} style={{
                                            fontFamily: 'SFProDisplay-Medium',
                                            fontSize: 14,
                                            textAlign: 'justify',
                                            lineHeight: 18,
                                            color: '#FFF'
                                        }}>{test.item.description !== undefined ? test.item.description : ""}</Text>
                                    </View>


                                    <View style={{ flexDirection: 'row', position: 'absolute', bottom: 15, paddingHorizontal: 15, justifyContent: 'center', alignItems: 'center' }}>
                                        <Icon2 name="chevron-right" size={18} color="#FFF" />
                                        <Text numberOfLines={1} style={{
                                            paddingLeft: 10,
                                            fontFamily: 'SFProDisplay-Medium',
                                            fontSize: 14,
                                            textAlign: 'justify',
                                            lineHeight: 18,
                                            color: '#FFF'
                                        }}>{test.item.category !== undefined ? test.item.category : ""}</Text>
                                    </View>

                                </TouchableOpacity>
                            )
                        }}
                    />
                    :
                    <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: 50 }}>
                        <Icon2 name="check-circle" size={38} color="#FFF" />
                        <Text numberOfLines={2} style={{
                            marginTop: 15,
                            fontFamily: 'SFProDisplay-Medium',
                            fontSize: 16,
                            color: '#FFF'
                        }}>Yapılması gereken bir test mevcut değil.</Text>
                    </View>
                }
            </SafeAreaView>
        </ImageBackground >
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1
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

export default TestList;