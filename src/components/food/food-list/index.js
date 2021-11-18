import React from 'react';
import { View, Text, FlatList } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import styles from './style';

const FoodListCard = ({ data, title, infoOnPress, eatOnPress }) => {
    return (
        <FlatList style={styles.container}
            scrollEnabled={false}
            data={data}
            keyExtractor={(item, index) => index.toString()}
            ListHeaderComponent={() => {
                return (
                    <View style={styles.headerContainer}>
                        <Text style={styles.title}>{title}</Text>
                    </View>
                )
            }}
            renderItem={(food) => {
                var item = food.item;
                return (item &&
                    <View key={item.id} style={styles.renderContainer}>
                        <View style={styles.leftContainer}>
                            <Text style={styles.foodTitle}>{item.name}</Text>
                            {item.note !== "" && item.note !== undefined ?
                                <Text style={styles.foodDescription}>{item.note} {item.kalori !== "" && item.kalori !== undefined && " - " + parseFloat(item.kalori).toFixed(2) + " Kalori"}</Text>
                                :
                                <Text style={styles.foodDescription}>{item.tarif} {item.kalori !== "" && item.kalori !== undefined && " - " + parseFloat(item.kalori).toFixed(2) + " Kalori"}</Text>
                            }
                        </View>
                        <View style={styles.rightContainer}>
                            <MaterialIcons
                                onPress={infoOnPress}
                                name="info-outline"
                                size={20}
                                color="#FFF"
                            />
                            <MaterialIcons
                                style={{ marginLeft: 10 }}
                                onPress={eatOnPress}
                                name="check"
                                size={20}
                                color={item.completed === true ? "#00FF00" : "#FFF"}
                            />
                        </View>
                    </View>
                )
            }}
        />
    )
}

export default FoodListCard;