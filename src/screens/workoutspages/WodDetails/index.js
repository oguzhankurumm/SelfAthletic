import React, { useEffect, useState } from 'react'
import { View, Text, SafeAreaView, Pressable, Alert, FlatList } from 'react-native';
import ImageLayout from '../../../components/image-layout';
import WodListCard from '../../../components/workouts/wod-list-card';
import axios from 'axios';
import styles from './style';

const WodDetails = (props) => {
    const wData = props.route.params.data;
    const [Loading, setLoading] = useState(true);
    const [Workout, setWorkout] = useState([]);

    useEffect(() => {
        setLoading(false);
        getWorkoutVideos(wData.movements);
    }, []);

    const getWorkoutVideos = async (data) => {
        setLoading(true);
        const moveData = Object.values(data).map(async item => {
            try {
                const res = await axios.get(`https://player.vimeo.com/video/${item.video}/config`)
                if (res.status === 200) {
                    const videoData = {
                        size: res.data.request.files.progressive[2].width,
                        url: res.data.request.files.progressive[2].url,
                        thumb: res.data.video.thumbs[640],
                        title: res.data.video.title,
                        duration: res.data.video.duration
                    }

                    return {
                        ...item,
                        pause: 60,
                        calorie: wData.calories / Object.values(wData.movements).length,
                        videoData
                    }
                }
            } catch (error) {
                console.log(error);
                setLoading(false);
            }
        })

        Promise.all(moveData)
            .then((data) => {
                const newMoves = data.flat();
                const workouts = {
                    ...wData,
                    workout: newMoves,
                    pause: 60
                }
                console.log({workouts})
                setWorkout(workouts);
                setLoading(false);
            })
            .catch(error => {
                Alert.alert('Hata', 'Bir hata oluştu, lütfen tekrar deneyin.');
                setLoading(false);
                console.log('promise error', error)
            })
    }

    return (
        <ImageLayout
            title="Antrenman Listesi"
            Loading={Loading}
            showBack
            isScrollable={false}
        >
            {!Loading && Object.values(Workout.workout).length !== 0 &&
                <SafeAreaView style={{ flex: 1 }}>
                    <FlatList
                        style={{ flex: 1, paddingHorizontal: 20 }}
                        scrollEnabled={true}
                        contentContainerStyle={{ paddingBottom: 20 }}
                        data={Object.values(Workout.workout)}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={(workouts) => {
                            return (
                                <WodListCard data={workouts.item} navigation={props.navigation} />
                            )
                        }}
                    />
                    <View style={{ width: '100%', paddingHorizontal: 20 }}>
                        <Pressable
                            onPress={() => props.navigation.navigate('StartWod', { Workout })}
                            style={styles.startButton}
                        >
                            <Text style={styles.startButtonText}>Antrenmanı Başlat</Text>
                        </Pressable>
                    </View>
                </SafeAreaView>
            }
        </ImageLayout>
    )
}

export default WodDetails;