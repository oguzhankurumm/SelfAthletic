import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, StatusBar, Image, SafeAreaView, TouchableOpacity, ImageBackground, TouchableHighlight, Dimensions, RefreshControl, FlatList } from 'react-native';
import { database2 } from '../../config/config';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SpinnerLoading from '../../components/SpinnerLoading';
import GetComment from '../../components/GetComment';

const { height, width } = Dimensions.get("window");

const FeedDetails = props => {

    const [Loading, setLoading] = useState(true);
    const [Comments, setComments] = useState(props.route.params.item)

    useEffect(() => {
        setLoading(false);

        console.log('propsss:', props.route.params.item)
    }, [])

    return (
        <ImageBackground style={{ height: height, width: width }} resizeMode="cover" source={require('../../img/bg.jpg')}>
            <StatusBar barStyle="light-content" />

            <SafeAreaView style={styles.container}>
                <SpinnerLoading Loading={Loading} />


                <View style={styles.header} >
                    <TouchableOpacity onPress={() => props.navigation.goBack()} style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                        <Icon name="keyboard-arrow-left" color="#FFF" size={42} style={{ marginRight: 15 }} />
                        <Text style={styles.headerText}>Yorumlar</Text>
                    </TouchableOpacity>

                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>

                        <TouchableHighlight disabled={true} onPress={() => props.navigation.navigate('FeedList')}>
                            <Icon name="comment" color="#C7CB4B" size={28} style={{ marginRight: 20 }} />
                        </TouchableHighlight>

                        <TouchableHighlight onPress={() => alert('ayarlar')}>
                            <Icon name="settings" color="#FFF" size={28} />
                        </TouchableHighlight>

                    </View>
                </View>

                {/* {[Comments].forEach((item) => {
                    <GetComment comment={item.comment} name={item.name} />
                    console.log('itemm: ', item)
                })} */}

                <FlatList style={{ height: 300, paddingHorizontal: 30, width: '100%' }}
                    scrollEnabled={true}
                    data={Comments}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={(comment) => (
                        <Text>SElamammsdfdsf</Text>
                    )}
                />
            </SafeAreaView>

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
        paddingHorizontal: 30
    },
    headerText: {
        fontFamily: 'SFProDisplay-Medium',
        fontSize: 18,
        color: '#FFF'
    }
})

export default FeedDetails;