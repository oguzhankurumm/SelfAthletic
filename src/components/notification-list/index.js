import React from 'react';
import { Text } from 'react-native';
import { CardItem, Right } from 'native-base';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import styles from './style';

const NotificationList = ({ body, time }) => (
    <CardItem style={styles.container}>
        <Icon name="bell" size={25} color="#FFF" />
        <Right style={styles.rightContainer}>
            <Text allowFontScaling={false} numberOfLines={2}
                style={styles.textStyle}>{body}</Text>

            <Text allowFontScaling={false} numberOfLines={1}
                style={styles.textStyle2}>{time}</Text>
        </Right>
    </CardItem>
)

export default NotificationList;