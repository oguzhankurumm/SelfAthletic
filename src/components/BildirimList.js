import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CardItem, Right } from 'native-base';
import Icon from 'react-native-vector-icons/SimpleLineIcons';

const BildirimList = ({ bildirimBody, bildirimTime }) => {

    return (
        <CardItem style={{ backgroundColor: '#202026', borderRadius: 10, marginHorizontal: 30, marginBottom: 5, overflow: 'hidden', height: 80 }}>
            <Icon name="bell" size={25} color="#FFF" />
            <Right style={{ justifyContent: 'center', alignItems: 'flex-start', height: 50, paddingHorizontal: 20 }}>
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
        color: '#FFF',
        fontFamily: "SFProDisplay-Medium",
        fontWeight: '700',
        marginBottom: 5
    },
    textStyle2: {
        fontSize: 14,
        color: '#9D9D9D',
        fontWeight: '500',
        fontFamily: "SFProDisplay-Bold"
    }
});

export default BildirimList;
