import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, Dimensions, ImageBackground, SafeAreaView, FlatList, Image, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import SpinnerLoading from '../../components/SpinnerLoading';
import Icon from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';

const { height, width } = Dimensions.get("window");

const Gecmis = props => {
    const userData = useSelector(state => state.user.users);
    const [Loading, setLoading] = useState(false);

    const [FoodList, setFoodList] = useState(props.route.params.food);
    const [WorkoutList, setWorkoutList] = useState(props.route.params.workout);

    return (
        <ImageBackground style={{ height: height, width: width }} resizeMode="cover" source={require('../../img/bg.jpg')}>
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="light-content" />
                <SpinnerLoading Loading={Loading} />

                <View style={styles.header} >
                    <TouchableOpacity onPress={() => props.navigation.goBack()} style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                        <Icon name="keyboard-arrow-left" color="#FFF" size={42} style={{ marginRight: 15 }} />
                        <Text style={styles.headerText}>Geçmişim</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ width: '100%', marginTop: 20, paddingHorizontal: 30 }}>
                    {!Loading && WorkoutList.length > 0 ?
                        <FlatList
                            style={{ paddingBottom: 20, width: '100%', height: '100%' }}
                            scrollEnabled={true}
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                            data={WorkoutList}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item, index }) => (
                                <TouchableOpacity
                                    style={{
                                        backgroundColor: 'rgba(0,0,0,0.2)',
                                        padding: 10,
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        height: 'auto',
                                        width: '100%',
                                        borderRadius: 18
                                    }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                        <Image
                                            resizeMode="cover"
                                            source={{ uri: 'https://www.active.com/Assets/Fitness/2-week-plan.jpg' }}
                                            style={{
                                                width: 60,
                                                height: 60,
                                                borderRadius: 8
                                            }}
                                        />
                                        <View style={{ marginLeft: 20 }}>
                                            <Text style={{
                                                fontFamily: 'SFProDisplay-Bold',
                                                fontSize: 16,
                                                color: '#FFF'
                                            }}>Toplam {item.moves.length} Hareket</Text>
                                            <Text style={{
                                                marginTop: 8,
                                                fontFamily: 'SFProDisplay-Medium',
                                                fontSize: 12,
                                                color: '#FFF'
                                            }}>{moment(item.date, "DD/MM/YYYY").format('LL')}</Text>

                                        </View>
                                    </View>

                                </TouchableOpacity>
                            )}

                        />
                        : <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={[styles.headerText, { fontSize: 14, marginTop: 50 }]}>Geçmişinizde henüz bir antrenman yok.</Text>
                        </View>
                    }
                </View>
            </SafeAreaView>
        </ImageBackground >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
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
export default Gecmis;