import React from 'react'
import { View, Text, ImageBackground, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import styles from './style';
import moment from 'moment';

const WorkoutCard = ({ data, navigation }) => {
    const isCompleted = data.item.completed

    return (
        <ImageBackground source={{ uri: data.item.workout[0].videoData.thumb }} style={{ height: 250, width: '100%', marginTop: 10 }} imageStyle={{ borderRadius: 12 }} >
            <LinearGradient
                start={{ x: 1, y: 1 }}
                end={{ x: 1, y: 1 }}
                colors={['rgba(0,0,0,0.7)', 'transparent']}
                style={styles.linear}
            />
            <Pressable
                onPress={() => navigation.navigate('WorkoutDetails', { data: data.item })}
                style={styles.container}
            >
                <View style={styles.viewContainer}>
                    <View style={styles.iconContainer}>
                        <Icon name={isCompleted === true ? "check-circle-outline" : "error-outline"} color="#FFF" size={20} />
                        <Text style={styles.iconText}>{isCompleted ? "Tamamlandı" : "Henüz Tamamlanmadı"}</Text>
                    </View>
                    <View style={styles.iconContainer}>
                        <Icon name="chevron-right" color="#FFF" size={24} />
                        <Text style={styles.iconText}>{isCompleted ? "Tekrar Yap" : "Hemen Başla"}</Text>
                    </View>
                </View>
                <Text style={styles.bannerTitle}>{data.item.description}</Text>
                <View style={styles.viewContainer}>
                    <View style={styles.iconContainer}>
                        <Icon name="timer" color="#FFF" size={20} />
                        <Text style={styles.bottomIconText}>{moment.utc(data.item.duration * 1000).format('mm:ss')} (ort.)</Text>
                    </View>

                    <View style={styles.iconContainer}>
                        <Icon name="directions-run" color="#FFF" size={20} />
                        <Text style={styles.bottomIconText}>{data.item.kcal} kcal (ort.)</Text>
                    </View>

                    <View style={styles.iconContainer}>
                        <Icon name="star" color="#FFF" size={20} />
                        <Text style={styles.bottomIconText}>{data.item.point} (ort.)</Text>
                    </View>
                </View>
            </Pressable>
        </ImageBackground>
    )
}

export default WorkoutCard;