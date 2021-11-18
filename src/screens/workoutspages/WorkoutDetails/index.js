import React from 'react'
import { View, Text, SafeAreaView, Pressable, FlatList } from 'react-native';
import ImageLayout from '../../../components/image-layout';
import WorkoutListCard from '../../../components/workouts/workout-list-card';
import styles from './style';

const WorkoutDetails = (props) => {
    const data = props.route.params.data;
    return (
        <ImageLayout
            title="Antrenman Listesi"
            Loading={false}
            showBack
            isScrollable={false}
        >
            {data.workout.length > 0 &&
                <SafeAreaView style={{ flex: 1 }}>
                    <FlatList
                        style={{ flex: 1, paddingHorizontal: 20 }}
                        scrollEnabled={true}
                        contentContainerStyle={{ paddingBottom: 20 }}
                        data={Object.values(data.workout)}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={(workouts) => {
                            return (
                                <WorkoutListCard data={workouts.item} navigation={props.navigation} />
                            )
                        }}
                    />
                    <View style={{ width: '100%', paddingHorizontal: 20 }}>
                        <Pressable
                            onPress={() => props.navigation.navigate('StartWorkout', { data })}
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

export default WorkoutDetails;