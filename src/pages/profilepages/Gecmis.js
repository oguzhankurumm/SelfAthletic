import React, { useState } from 'react'
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, Dimensions, ImageBackground, SafeAreaView, FlatList, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { height, width } = Dimensions.get("window");

const Gecmis = props => {
    const [Type, setType] = useState(props.route.params.type);

    const [WorkoutList, setWorkoutList] = useState(props.route.params.workout !== undefined ? props.route.params.workout.moves : []);
    const [SelectedPage, setSelectedPage] = useState((Type === "all" || Type === "food") ? 1 : 0);

    return (
        <ImageBackground style={{ height: height, width: width }} resizeMode="cover" source={require('../../img/bg.jpg')}>
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="light-content" />
                <ScrollView bounces={false} style={{ width: '100%' }}>

                    <View style={styles.header} >
                        <TouchableOpacity onPress={() => props.navigation.goBack()} style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                            <Icon name="keyboard-arrow-left" color="#FFF" size={42} style={{ marginRight: 15 }} />
                            <Text style={styles.headerText}>Geçmişim</Text>
                        </TouchableOpacity>
                    </View>

                    {Type === "all" &&
                        <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: 20, paddingHorizontal: 15 }}>
                            <TouchableOpacity
                                onPress={() => setSelectedPage(0)}
                                style={SelectedPage !== 0 ? styles.touchableStyle : [styles.touchableStyle, { backgroundColor: '#202026' }]}>
                                <Text style={styles.touchableText}>Antrenman</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => setSelectedPage(1)}
                                style={SelectedPage !== 1 ? styles.touchableStyle : [styles.touchableStyle, { backgroundColor: '#202026' }]}>
                                <Text style={styles.touchableText}>Beslenme</Text>
                            </TouchableOpacity>

                        </View>
                    }

                    <View style={{ width: '100%', marginTop: 20, paddingHorizontal: 25 }}>
                        {SelectedPage === 0 && (Type === "all" || Type === "workout") &&
                            <FlatList
                                style={{ paddingBottom: 20, width: '100%', height: '100%' }}
                                scrollEnabled={true}
                                showsHorizontalScrollIndicator={false}
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={{ paddingBottom: 150 }}
                                data={WorkoutList}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item, index }) => (
                                    <View style={{
                                        backgroundColor: 'rgba(0,0,0,0.2)',
                                        marginBottom: 10,
                                        paddingVertical: 15,
                                        paddingHorizontal: 10,
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        height: 'auto',
                                        width: '100%',
                                        borderRadius: 18
                                    }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                            <Icon name="keyboard-arrow-right" size={48} color="#FFF" />
                                            <View style={{ marginLeft: 10 }}>
                                                <Text style={{
                                                    fontFamily: 'SFProDisplay-Bold',
                                                    fontSize: 16,
                                                    color: '#FFF'
                                                }}>{item.name}</Text>

                                                <Text style={{
                                                    marginTop: 8,
                                                    fontFamily: 'SFProDisplay-Medium',
                                                    fontSize: 14,
                                                    color: '#FFF'
                                                }}>({item.set} Set, {item.type === "time" ? `${item.time} Saniye` : `${item.reps} Tekrar`})</Text>

                                                <Text style={{
                                                    marginTop: 8,
                                                    fontFamily: 'SFProDisplay-Medium',
                                                    fontSize: 14,
                                                    color: item.completed === true ? 'lightgreen' : '#f70d1a'
                                                }}>{item.completed !== undefined && item.completed === true ? 'Tamamlandı' : 'Tamamlanmadı'}</Text>
                                            </View>
                                        </View>

                                    </View>
                                )}

                            />
                        }

                        {SelectedPage === 1 && (Type === "all" || Type === "food") &&
                            <>
                                {props.route.params.food.kahvalti !== undefined &&
                                    <>
                                        <FlatList style={{ height: 'auto', marginBottom: 20, marginTop: 5 }}
                                            scrollEnabled={false}
                                            // data={KahvaltiList.sort((a, b) => String(a.name).toLowerCase().localeCompare(String(b.name).toLowerCase()))}
                                            data={props.route.params.food.kahvalti}
                                            keyExtractor={(item, index) => index.toString()}
                                            ListHeaderComponent={() => {
                                                return (
                                                    <View style={{ backgroundColor: '#202026', flexDirection: 'row', borderTopLeftRadius: 12, borderTopRightRadius: 12, paddingHorizontal: 10, paddingVertical: 15, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                                                        <Text style={styles.foodHeader}>Kahvaltı</Text>
                                                    </View>
                                                )
                                            }}
                                            renderItem={(food) => {
                                                var item = food.item;
                                                return (item &&
                                                    <View key={item.id} style={{
                                                        padding: 10,
                                                        flexDirection: 'row',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        height: 'auto',
                                                        width: '100%'
                                                    }}>
                                                        <View style={{ width: '100%', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                            <Text style={styles.foodName}>{item.name}</Text>
                                                            {item.note !== "" && item.note !== undefined ?
                                                                <Text style={[styles.foodName, { color: '#9D9D9D', fontSize: 14, marginTop: 5 }]}>{item.note} {item.kalori !== "" && item.kalori !== undefined && " - " + parseFloat(item.kalori).toFixed(2) + " Kalori"}</Text>
                                                                :
                                                                <Text style={[styles.foodName, { color: '#9D9D9D', fontSize: 14, marginTop: 5 }]}>{item.tarif} {item.kalori !== "" && item.kalori !== undefined && " - " + parseFloat(item.kalori).toFixed(2) + " Kalori"}</Text>
                                                            }
                                                        </View>
                                                    </View>
                                                )
                                            }}
                                        />
                                    </>
                                }


                                {props.route.params.food.aralist1 !== undefined &&
                                    <>
                                        <FlatList style={{ height: 'auto', marginBottom: 20 }}
                                            scrollEnabled={false}
                                            data={props.route.params.food.aralist1.sort((a, b) => String(a.name).toLowerCase().localeCompare(String(b.name).toLowerCase()))}
                                            keyExtractor={(item, index) => index.toString()}
                                            ListHeaderComponent={() => {
                                                return (
                                                    <View style={{ backgroundColor: '#202026', flexDirection: 'row', borderTopLeftRadius: 12, borderTopRightRadius: 12, paddingHorizontal: 10, paddingVertical: 15, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                                                        <Text style={styles.foodHeader}>Ara Öğün 1</Text>
                                                    </View>
                                                )
                                            }}
                                            renderItem={(food) => {
                                                var item = food.item;
                                                return (item &&
                                                    <View key={item.id} style={{
                                                        padding: 10,
                                                        flexDirection: 'row',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        height: 'auto',
                                                        width: '100%'
                                                    }}>
                                                        <View style={{ width: '100%', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                            <Text style={styles.foodName}>{item.name}</Text>
                                                            {item.note !== "" && item.note !== undefined ?
                                                                <Text style={[styles.foodName, { color: '#9D9D9D', fontSize: 14, marginTop: 5 }]}>{item.note} {item.kalori !== "" && item.kalori !== undefined && " - " + parseFloat(item.kalori).toFixed(2) + " Kalori"}</Text>
                                                                :
                                                                <Text style={[styles.foodName, { color: '#9D9D9D', fontSize: 14, marginTop: 5 }]}>{item.tarif} {item.kalori !== "" && item.kalori !== undefined && " - " + parseFloat(item.kalori).toFixed(2) + " Kalori"}</Text>
                                                            }
                                                        </View>
                                                    </View>
                                                )
                                            }}
                                        />
                                    </>
                                }

                                {props.route.params.food.oglelist !== undefined &&
                                    <>
                                        <FlatList style={{ height: 'auto', marginBottom: 20 }}
                                            scrollEnabled={false}
                                            data={props.route.params.food.oglelist.sort((a, b) => String(a.name).toLowerCase().localeCompare(String(b.name).toLowerCase()))}
                                            keyExtractor={(item, index) => index.toString()}
                                            ListHeaderComponent={() => {
                                                return (
                                                    <View style={{ backgroundColor: '#202026', flexDirection: 'row', borderTopLeftRadius: 12, borderTopRightRadius: 12, paddingHorizontal: 10, paddingVertical: 15, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                                                        <Text style={styles.foodHeader}>Öğle Yemeği</Text>
                                                    </View>
                                                )
                                            }}
                                            renderItem={(food) => {
                                                var item = food.item;
                                                return (item &&
                                                    <View key={item.id} style={{
                                                        padding: 10,
                                                        flexDirection: 'row',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        height: 'auto',
                                                        width: '100%'
                                                    }}>
                                                        <View style={{ width: '100%', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                            <Text style={styles.foodName}>{item.name}</Text>
                                                            {item.note !== "" && item.note !== undefined ?
                                                                <Text style={[styles.foodName, { color: '#9D9D9D', fontSize: 14, marginTop: 5 }]}>{item.note} {item.kalori !== "" && item.kalori !== undefined && " - " + parseFloat(item.kalori).toFixed(2) + " Kalori"}</Text>
                                                                :
                                                                <Text style={[styles.foodName, { color: '#9D9D9D', fontSize: 14, marginTop: 5 }]}>{item.tarif} {item.kalori !== "" && item.kalori !== undefined && " - " + parseFloat(item.kalori).toFixed(2) + " Kalori"}</Text>
                                                            }
                                                        </View>
                                                    </View>
                                                )
                                            }}
                                        />
                                    </>
                                }


                                {props.route.params.food.aralist2 !== undefined &&
                                    <>
                                        <FlatList style={{ height: 'auto', marginBottom: 20 }}
                                            scrollEnabled={false}
                                            data={props.route.params.food.aralist2.sort((a, b) => String(a.name).toLowerCase().localeCompare(String(b.name).toLowerCase()))}
                                            keyExtractor={(item, index) => index.toString()}
                                            ListHeaderComponent={() => {
                                                return (
                                                    <View style={{ backgroundColor: '#202026', flexDirection: 'row', borderTopLeftRadius: 12, borderTopRightRadius: 12, paddingHorizontal: 10, paddingVertical: 15, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                                                        <Text style={styles.foodHeader}>Ara Öğün 2</Text>
                                                    </View>
                                                )
                                            }}
                                            renderItem={(food) => {
                                                var item = food.item;
                                                return (item &&
                                                    <View key={item.id} style={{
                                                        padding: 10,
                                                        flexDirection: 'row',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        height: 'auto',
                                                        width: '100%'
                                                    }}>
                                                        <View style={{ width: '100%', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                            <Text style={styles.foodName}>{item.name}</Text>
                                                            {item.note !== "" && item.note !== undefined ?
                                                                <Text style={[styles.foodName, { color: '#9D9D9D', fontSize: 14, marginTop: 5 }]}>{item.note} {item.kalori !== "" && item.kalori !== undefined && " - " + parseFloat(item.kalori).toFixed(2) + " Kalori"}</Text>
                                                                :
                                                                <Text style={[styles.foodName, { color: '#9D9D9D', fontSize: 14, marginTop: 5 }]}>{item.tarif} {item.kalori !== "" && item.kalori !== undefined && " - " + parseFloat(item.kalori).toFixed(2) + " Kalori"}</Text>
                                                            }
                                                        </View>
                                                    </View>
                                                )
                                            }}
                                        />
                                    </>
                                }

                                {props.route.params.food.aksamlist !== undefined &&
                                    <>
                                        <FlatList style={{ height: 'auto' }}
                                            contentContainerStyle={{ marginBottom: props.route.params.food.aralist3.length === 0 ? 100 : 0 }}
                                            scrollEnabled={false}
                                            data={props.route.params.food.aksamlist.sort((a, b) => String(a.name).toLowerCase().localeCompare(String(b.name).toLowerCase()))}
                                            keyExtractor={(item, index) => index.toString()}
                                            ListHeaderComponent={() => {
                                                return (
                                                    <View style={{ backgroundColor: '#202026', flexDirection: 'row', borderTopLeftRadius: 12, borderTopRightRadius: 12, paddingHorizontal: 10, paddingVertical: 15, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                                                        <Text style={styles.foodHeader}>Akşam Yemeği</Text>
                                                    </View>
                                                )
                                            }}
                                            renderItem={(food) => {
                                                var item = food.item;
                                                return (item &&
                                                    <View key={item.id} style={{
                                                        padding: 10,
                                                        flexDirection: 'row',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        height: 'auto',
                                                        width: '100%'
                                                    }}>
                                                        <View style={{ width: '100%', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                            <Text style={styles.foodName}>{item.name}</Text>
                                                            {item.note !== "" && item.note !== undefined ?
                                                                <Text style={[styles.foodName, { color: '#9D9D9D', fontSize: 14, marginTop: 5 }]}>{item.note} {item.kalori !== "" && item.kalori !== undefined && " - " + parseFloat(item.kalori).toFixed(2) + " Kalori"}</Text>
                                                                :
                                                                <Text style={[styles.foodName, { color: '#9D9D9D', fontSize: 14, marginTop: 5 }]}>{item.tarif} {item.kalori !== "" && item.kalori !== undefined && " - " + parseFloat(item.kalori).toFixed(2) + " Kalori"}</Text>
                                                            }
                                                        </View>
                                                    </View>
                                                )
                                            }}
                                        />
                                    </>
                                }


                                {props.route.params.food.aralist3 !== undefined &&
                                    <>
                                        <FlatList style={{ height: 'auto' }}
                                            contentContainerStyle={{ marginBottom: props.route.params.food.aralist3.length === 0 ? 0 : 100 }}
                                            scrollEnabled={false}
                                            data={props.route.params.food.aralist3.sort((a, b) => String(a.name).toLowerCase().localeCompare(String(b.name).toLowerCase()))}
                                            keyExtractor={(item, index) => index.toString()}
                                            ListHeaderComponent={() => {
                                                return (
                                                    <View style={{ backgroundColor: '#202026', flexDirection: 'row', borderTopLeftRadius: 12, borderTopRightRadius: 12, paddingHorizontal: 10, paddingVertical: 15, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                                                        <Text style={styles.foodHeader}>Ara Öğün 3</Text>
                                                    </View>
                                                )
                                            }}
                                            renderItem={(food) => {
                                                var item = food.item;
                                                return (item &&
                                                    <View key={item.id} style={{
                                                        padding: 10,
                                                        flexDirection: 'row',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        height: 'auto',
                                                        width: '100%'
                                                    }}>
                                                        <View style={{ width: '100%', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                            <Text style={styles.foodName}>{item.name}</Text>
                                                            {item.note !== "" && item.note !== undefined ?
                                                                <Text style={[styles.foodName, { color: '#9D9D9D', fontSize: 14, marginTop: 5 }]}>{item.note} {item.kalori !== "" && item.kalori !== undefined && " - " + parseFloat(item.kalori).toFixed(2) + " Kalori"}</Text>
                                                                :
                                                                <Text style={[styles.foodName, { color: '#9D9D9D', fontSize: 14, marginTop: 5 }]}>{item.tarif} {item.kalori !== "" && item.kalori !== undefined && " - " + parseFloat(item.kalori).toFixed(2) + " Kalori"}</Text>
                                                            }
                                                        </View>
                                                    </View>
                                                )
                                            }}
                                        />
                                    </>
                                }
                            </>
                        }
                    </View>
                </ScrollView>
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
        paddingHorizontal: 15
    },
    headerText: {
        fontFamily: 'SFProDisplay-Medium',
        fontSize: 18,
        color: '#FFF'
    },
    touchableText: {
        textAlign: 'center',
        fontFamily: 'SFProDisplay-Medium',
        fontSize: 14,
        color: '#FFF'
    },
    touchableStyle: {
        width: '48%',
        marginHorizontal: 1,
        paddingVertical: 10,
        paddingHorizontal: 5,
        borderRadius: 12
    },
    foodHeader: {
        fontFamily: 'SFProDisplay-Bold',
        fontSize: 18,
        color: '#FFF',
        width: '100%'
    },
    foodName: {
        fontFamily: 'SFProDisplay-Medium',
        fontSize: 16,
        color: '#FFF'
    },
})
export default Gecmis;