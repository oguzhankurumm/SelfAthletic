import React from 'react'
import { View, Text, Image, SafeAreaView, Pressable, FlatList } from 'react-native';
import ImageLayout from '../../../components/image-layout';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from './style';

const WodList = (props) => {
    const data = props.route.params.Workouts;
    return (
        <ImageLayout
            title="Antrenman Listesi"
            Loading={false}
            showBack
            isScrollable={false}
        >
            {data.length > 0 &&
                <SafeAreaView style={{ flex: 1 }}>
                    <FlatList
                        style={{ flex: 1, paddingHorizontal: 20 }}
                        scrollEnabled={true}
                        contentContainerStyle={{ paddingBottom: 20 }}
                        data={Object.values(data)}
                        keyExtractor={(item, index) => item.id}
                        renderItem={(workouts) => {
                            return (
                                <Pressable
                                    onPress={() => props.navigation.navigate('WodDetails', { data: workouts.item })}
                                    style={styles.container}>
                                    <Image
                                        resizeMode="cover"
                                        source={{ uri: workouts.item.image }}
                                        style={styles.image}
                                    />
                                    <LinearGradient
                                        start={{ x: 1, y: 1 }}
                                        end={{ x: 1, y: 1 }}
                                        colors={['rgba(0,0,0,0.6)', 'transparent']}
                                        style={styles.linear}
                                    />
                                    <View style={{ position: 'absolute', top: 15, paddingHorizontal: 15 }}>
                                        <Text style={styles.title}>{workouts.item.title}</Text>
                                        <Text numberOfLines={1} style={styles.description}>{workouts.item.description}</Text>
                                    </View>

                                    <View style={styles.bottomContainer}>
                                        <View style={styles.leftContainer}>
                                            <Icon name="star" color="#FFF" size={20} />
                                            <Text numberOfLines={2} style={styles.point}>{String(parseFloat(workouts.item.point))} Puan</Text>
                                        </View>

                                        <View style={styles.rightContainer}>
                                            <Icon name="directions-run" color="#FFF" size={20} />
                                            <Text style={styles.calorie}>{String(parseFloat(workouts.item.calories))} Kalori</Text>
                                        </View>
                                    </View>
                                </Pressable>
                            )
                        }}
                    />
                </SafeAreaView>
            }
        </ImageLayout>
    )
}

export default WodList;