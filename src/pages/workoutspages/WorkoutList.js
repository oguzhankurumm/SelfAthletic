import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, StatusBar, Image, SafeAreaView, TouchableOpacity, ImageBackground, TouchableHighlight, Dimensions, FlatList } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SpinnerLoading from '../../components/SpinnerLoading';

const { height, width } = Dimensions.get("window");


const WorkoutList = props => {

    const [Loading, setLoading] = useState(false);
    const [Workouts, setWorkouts] = useState(props.route.params.Workouts);

    useEffect(() => {
        if (Workouts.length !== 0) {
            setLoading(false);
        } else {
            setLoading(true);
        }
    }, [])

    return (
        <ImageBackground style={{ height: height, width: width }} resizeMode="cover" source={require('../../img/bg.jpg')}>
            <StatusBar barStyle="light-content" />

            <SafeAreaView style={styles.container}>
                <SpinnerLoading Loading={Loading} />


                <View style={styles.header} >
                    <TouchableOpacity onPress={() => props.navigation.goBack()} style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                        <Icon name="keyboard-arrow-left" color="#FFF" size={42} style={{ marginRight: 15 }} />
                        <Text style={styles.headerText}>Tüm Antrenmanlar</Text>
                    </TouchableOpacity>

                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>

                        <TouchableHighlight onPress={() => props.navigation.navigate('FeedList')}>
                            <Icon name="comment" color="#FFF" size={28} style={{ marginRight: 20 }} />
                        </TouchableHighlight>

                        <TouchableHighlight onPress={() => props.navigation.navigate('Settings')}>
                            <Icon name="settings" color="#FFF" size={28} />
                        </TouchableHighlight>

                    </View>
                </View>

                {!Loading &&
                    <FlatList style={{ height: 'auto', paddingHorizontal: 20 }}
                        scrollEnabled={true}
                        data={Workouts}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={(workouts) => {
                            return (workouts.item &&
                                <TouchableOpacity onPress={() => props.navigation.navigate('WorkoutDetails', { item: workouts.item })}
                                    style={{
                                        height: 'auto',
                                        width: '100%',
                                        borderRadius: 18,
                                        marginTop: 20
                                    }}>
                                    <Image
                                        resizeMode="cover"
                                        source={{ uri: workouts.item.image }}
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
                                        <Text style={{
                                            fontFamily: 'SFProDisplay-Bold',
                                            fontSize: 20,
                                            color: '#FFF',
                                            marginBottom: 8
                                        }}>{workouts.item.title}</Text>
                                        <Text numberOfLines={1} style={{
                                            fontFamily: 'SFProDisplay-Medium',
                                            fontSize: 13,
                                            color: '#FFF'
                                        }}>{workouts.item.description}</Text>
                                    </View>

                                    <View style={{
                                        flexDirection: 'row',
                                        position: 'absolute',
                                        width: '100%',
                                        bottom: 15,
                                        paddingHorizontal: 15,
                                        justifyContent: 'space-between'
                                    }}>

                                        <View style={{
                                            flexDirection: 'row',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            marginRight: 10
                                        }}>
                                            <Icon name="star" color="#FFF" size={20} />
                                            <Text numberOfLines={2} style={{
                                                fontFamily: 'SFProDisplay-Medium',
                                                fontSize: 13,
                                                color: '#FFF',
                                                marginLeft: 5
                                            }}>{String(parseFloat(workouts.item.point))} Puan</Text>
                                        </View>

                                        <View style={{
                                            flexDirection: 'row',
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }}>
                                            <Icon name="directions-run" color="#FFF" size={20} />
                                            <Text style={{
                                                fontFamily: 'SFProDisplay-Medium',
                                                fontSize: 14,
                                                color: '#FFF',
                                                marginLeft: 5
                                            }}>{String(parseFloat(workouts.item.calories))} Kalori</Text>
                                        </View>

                                    </View>
                                </TouchableOpacity>
                            )
                        }}
                    />
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

export default WorkoutList;