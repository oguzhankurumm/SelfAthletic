import React, { useState } from 'react'
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import styles from './style';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ImageLayout from '../../../components/image-layout';
import moment from 'moment';
import 'moment/locale/tr';

const History = props => {
    const WorkoutList = props.route.params.workout !== undefined ? props.route.params.workout : [];
    const FoodList = props.route.params.food !== undefined ? props.route.params.food : [];
    const [SelectedPage, setSelectedPage] = useState(0);
    return (
        <ImageLayout
            title="Geçmiş"
            showBack
            isScrollable={true}
        >
            <View style={styles.tabContainer}>
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

            {SelectedPage === 0 ?
                <View style={styles.container}>
                    {WorkoutList !== undefined && WorkoutList.length !== 0 &&
                        <FlatList
                            style={styles.flatListContainer}
                            scrollEnabled={true}
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingBottom: 30 }}
                            data={WorkoutList.length > 1 ? WorkoutList : Array(WorkoutList)}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item, index }) => {
                                const moveCount = Object.values(item.workout).length;
                                const workoutPoint = item.point;
                                return (
                                    <View key={index} style={styles.itemContainer}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                            <Icon name="keyboard-arrow-right" size={48} color="#FFF" />
                                            <View style={{ marginLeft: 10 }}>
                                                <Text style={styles.name}>{moment(item.date, "DD-MM-YYYY").format('LL')}</Text>
                                                <Text style={styles.description}>{moveCount} Hareket, {workoutPoint} Puan</Text>
                                                <Text style={item.completed ? styles.statusTextCompleted : styles.statusTextDefault}>{item.completed !== undefined && item.completed === true ? 'Tamamlandı' : 'Tamamlanmadı'}</Text>
                                            </View>
                                        </View>
                                    </View>
                                )
                            }}
                        />
                    }
                </View>
                :
                <View style={styles.container}>
                    {FoodList !== undefined && FoodList.length !== 0 &&
                        <FlatList
                            style={styles.flatListContainer}
                            scrollEnabled={true}
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingBottom: 30 }}
                            data={FoodList.length > 1 ? FoodList : Array(FoodList)}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item, index }) => {
                                const foodCount = Object.values(item).length;
                                const totalKcal = item.kcal;
                                return (
                                    <View key={index} style={styles.itemContainer}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                            <Icon name="keyboard-arrow-right" size={48} color="#FFF" />
                                            <View style={{ marginLeft: 10 }}>
                                                <Text style={styles.name}>{moment(item.date, "DD-MM-YYYY").format('LL')}</Text>
                                                <Text style={styles.description}>{foodCount} Besin, {totalKcal} Kalori</Text>
                                                <Text style={item.completed ? styles.statusTextCompleted : styles.statusTextDefault}>{item.completed !== undefined && item.completed === true ? 'Tamamlandı' : 'Tamamlanmadı'}</Text>
                                            </View>
                                        </View>
                                    </View>
                                )
                            }}
                        />
                    }
                </View>
            }
        </ImageLayout>
    )
}

export default History;