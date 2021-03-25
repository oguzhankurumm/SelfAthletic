import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CardItem, Right } from 'native-base';
import Icon from 'react-native-vector-icons/SimpleLineIcons';

const BildirimList = ({ bildirimBody, bildirimTime }) => {

    return (
        <CardItem style={{ borderRadius: 10, marginHorizontal: 30, marginBottom: 5, backgroundColor: 'white', overflow: 'hidden', borderBottomWidth: 0.3, borderColor: '#A3A3A4', height: 80 }}>
            <Icon name="bell" size={25} />
            <Right style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-start', height: 50, paddingHorizontal: 20 }}>
                <Text allowFontScaling={false} numberOfLines={2}
                    style={styles.textStyle}>{bildirimBody}</Text>

                <Text allowFontScaling={false} numberOfLines={1}
                    style={styles.textStyle2}>{bildirimTime}</Text>
            </Right>
        </CardItem>
    );
}

const styles = StyleSheet.create({
    textStyle: {
        fontSize: 16,
        color: '#2D2D2D',
        fontFamily: "SFProDisplay-Medium",
        fontWeight: '700',
        marginBottom: 5
    },
    textStyle2: {
        fontSize: 14,
        color: '#999999',
        fontWeight: '500',
        fontFamily: "SFProDisplay-Bold"
    }
});

export default BildirimList;
