import React from 'react'
import { View, Text, Image, Pressable } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styles from './style';

const MoveCard = ({ data }) => {
    const defaultImage = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMZBG_-ExzFMKe3LFKHcLXOWaSFVarRC5OGl3ZWBTOCOBmz4OAPizlUC4-fgFih89tYOM&usqp=CAU';
    return (
        <Pressable style={styles.container}>
            <View style={{ flexDirection: 'row', width: '70%' }}>
                <Image
                    resizeMode="cover"
                    source={{ uri: data.image !== undefined ? data.image : defaultImage }}
                    style={styles.image}
                />
                <View style={{ marginLeft: 15 }}>
                    <Text style={styles.headerTitle}>{data.name}</Text>
                    {data.type === "time" ?
                        <Text numberOfLines={2} style={styles.moveText}>{data.set + ' Set, ' + data.time + ' Saniye'}</Text>
                        :
                        <Text numberOfLines={2} style={styles.moveText}>{data.set + ' Set, ' + data.reps + ' Tekrar'}</Text>
                    }
                </View>
            </View>

            <View>
                {data.type === "time" ?
                    <MaterialIcons name="timer" color="#FFF" size={20} />
                    :
                    <MaterialIcons name="replay" color="#FFF" size={20} />
                }
            </View>
        </Pressable>
    )
}

export default MoveCard;