import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, StatusBar, Image, SafeAreaView, ScrollView, Alert, TouchableOpacity, ImageBackground, TouchableHighlight, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SpinnerLoading from '../../components/SpinnerLoading';

const { height, width } = Dimensions.get("window");


const WorkoutDetails = props => {

    const [Loading, setLoading] = useState(false);
    const [Workouts, setWorkouts] = useState(props.route.params.item);

    useEffect(() => {
        if (Workouts.length !== 0) {
            setLoading(false);
        } else {
            setLoading(true);
        }
    }, [])

    return (
        <ImageBackground style={{ height: height, width: width }} resizeMode="cover" source={require('../../img/bg.jpg')}>

            <SafeAreaView style={styles.container}>
                <SpinnerLoading Loading={Loading} />


                <View style={styles.header} >
                    <TouchableOpacity onPress={() => props.navigation.goBack()} style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                        <Icon name="keyboard-arrow-left" color="#FFF" size={42} style={{ marginRight: 15 }} />
                        <Text style={styles.headerText}>Antrenman</Text>
                    </TouchableOpacity>

                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>

                        <TouchableHighlight onPress={() => alert('feed')}>
                            <Icon name="comment" color="#FFF" size={28} style={{ marginRight: 20 }} />
                        </TouchableHighlight>

                        <TouchableHighlight onPress={() => alert('ayarlar')}>
                            <Icon name="settings" color="#FFF" size={28} />
                        </TouchableHighlight>

                    </View>
                </View>

                <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} style={styles.container}>
                    <StatusBar barStyle="light-content" />

                    <View style={{ justifyContent: 'center', alignItems: 'center', paddingHorizontal: 30, marginTop: 20 }}>

                        {!Loading &&
                            <>
                                <View onPress={() => Alert.alert(String(Workouts.id))}
                                    style={{
                                        height: 'auto',
                                        width: '100%',
                                        borderRadius: 18
                                    }}>
                                    <Image
                                        resizeMode="cover"
                                        source={{ uri: Workouts.image }}
                                        style={{
                                            width: '100%',
                                            height: 250,
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
                                            height: 250
                                        }}
                                    />
                                    <View style={{ position: 'absolute', top: 15, paddingHorizontal: 20 }}>
                                        <Text style={{
                                            fontFamily: 'SFProDisplay-Bold',
                                            fontSize: 20,
                                            color: '#FFF',
                                            marginBottom: 8
                                        }}>{Workouts.title}</Text>
                                        <Text numberOfLines={2} style={{
                                            fontFamily: 'SFProDisplay-Medium',
                                            fontSize: 13,
                                            color: '#FFF'
                                        }}>{Workouts.description}</Text>
                                    </View>


                                    <View style={{
                                        flexDirection: 'row',
                                        width: '100%',
                                        justifyContent: 'space-between',
                                        paddingHorizontal: 20,
                                        position: 'absolute',
                                        bottom: 15
                                    }}>

                                        <View style={{
                                            flexDirection: 'row',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            marginRight: 10
                                        }}>
                                            <Icon name="timer" color="#FFF" size={20} />
                                            <Text style={{
                                                fontFamily: 'SFProDisplay-Medium',
                                                fontSize: 13,
                                                color: '#FFF',
                                                marginLeft: 5
                                            }}>{String(parseFloat(Workouts.totalhours).toFixed(2)).replace('.', ':')}</Text>
                                        </View>

                                        {Workouts.level === 0 &&
                                            <View style={{
                                                flexDirection: 'row',
                                                justifyContent: 'center',
                                                alignItems: 'center'
                                            }}>
                                                <Icon name="bar-chart" color="#FFF" size={20} />
                                                <Text style={{
                                                    fontFamily: 'SFProDisplay-Medium',
                                                    fontSize: 14,
                                                    color: '#FFF',
                                                    marginLeft: 5
                                                }}>Başlangıç</Text>
                                            </View>
                                        }

                                        {Workouts.level === 1 &&
                                            <View style={{
                                                flexDirection: 'row',
                                                justifyContent: 'center',
                                                alignItems: 'center'
                                            }}>
                                                <Icon name="bar-chart" color="#FFF" size={20} />
                                                <Text style={{
                                                    fontFamily: 'SFProDisplay-Medium',
                                                    fontSize: 14,
                                                    color: '#FFF',
                                                    marginLeft: 5
                                                }}>Orta</Text>
                                            </View>
                                        }

                                        {Workouts.level === 2 &&
                                            <View style={{
                                                flexDirection: 'row',
                                                justifyContent: 'center',
                                                alignItems: 'center'
                                            }}>
                                                <Icon name="bar-chart" color="#FFF" size={20} />
                                                <Text style={{ fontFamily: 'SFProDisplay-Medium', fontSize: 14, color: '#FFF', marginLeft: 5 }}>Zor</Text>
                                            </View>
                                        }

                                        {Workouts.level === 3 &&
                                            <View style={{
                                                flexDirection: 'row',
                                                justifyContent: 'center',
                                                alignItems: 'center'
                                            }}>
                                                <Icon name="bar-chart" color="#FFF" size={20} />
                                                <Text style={{
                                                    fontFamily: 'SFProDisplay-Medium',
                                                    fontSize: 14,
                                                    color: '#FFF',
                                                    marginLeft: 5
                                                }}>Uzman</Text>
                                            </View>
                                        }


                                    </View>



                                </View>
                                <View style={{ marginTop: 20 }}>
                                    <Text style={{
                                        fontFamily: 'SFProDisplay-Medium',
                                        fontSize: 13,
                                        color: '#D9D9D9'
                                    }}>{Workouts.description}
                                    </Text>
                                </View>
                            </>
                        }
                    </View>
                </ScrollView>
            </SafeAreaView>

            <TouchableOpacity style={{
                width: '100%',
                height: 60,
                backgroundColor: '#000',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Text style={{
                    fontFamily: 'SFProDisplay-Bold',
                    justifyContent: 'flex-start',
                    fontSize: 16,
                    color: '#FFF',
                    marginRight: 5
                }}>Antrenmana Başla</Text>
            </TouchableOpacity>

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
        paddingHorizontal: 30
    },
    headerText: {
        fontFamily: 'SFProDisplay-Medium',
        fontSize: 18,
        color: '#FFF'
    }
})

export default WorkoutDetails;