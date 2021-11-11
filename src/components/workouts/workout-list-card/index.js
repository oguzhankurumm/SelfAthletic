import React from 'react'
import { View, Text, Image, Pressable, FlatList } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styles from './style';

const WorkoutListCard = ({ data }) => {
    const defaultImage = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMZBG_-ExzFMKe3LFKHcLXOWaSFVarRC5OGl3ZWBTOCOBmz4OAPizlUC4-fgFih89tYOM&usqp=CAU';
    if (data !== undefined) {
        return (
            <FlatList
                style={{ flex: 1 }}
                scrollEnabled={false}
                data={data}
                keyExtractor={(item, index) => index.toString()}
                renderItem={(workouts) => {
                    console.log('wk:', workouts.item)
                    return (workouts.item &&
                        <Pressable style={styles.container}>
                            <View style={{ flexDirection: 'row', width: '70%' }}>
                                <Image
                                    resizeMode="cover"
                                    source={{ uri: workouts.item.videoData !== undefined ? workouts.item.videoData.thumb : defaultImage }}
                                    style={styles.image}
                                />
                                <View style={{ marginLeft: 15 }}>
                                    <Text style={styles.headerTitle}>{workouts.item.videoData !== undefined ? workouts.item.videoData.title : workouts.item.name}</Text>
                                    {workouts.item.type === "time" ?
                                        <Text numberOfLines={2} style={styles.moveText}>{workouts.item.values.set + ' Set, ' + workouts.item.values.time + ' Saniye'}</Text>
                                        :
                                        <Text numberOfLines={2} style={styles.moveText}>{workouts.item.values.set + ' Set, ' + workouts.item.values.repeat + ' Tekrar'}</Text>
                                    }
                                </View>
                            </View>

                            <View>
                                {workouts.item.type === "time" ?
                                    <MaterialIcons name="timer" color="#FFF" size={20} />
                                    :
                                    <MaterialIcons name="replay" color="#FFF" size={20} />
                                }
                            </View>
                        </Pressable>
                    )
                }}
            />
        )
    } else {
        return (<View></View>)
    }
}

export default WorkoutListCard;