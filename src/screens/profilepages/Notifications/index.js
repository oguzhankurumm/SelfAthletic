import React from 'react'
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import { SwipeListView } from 'react-native-swipe-list-view';
import { CardItem, Button } from 'native-base';
import NotificationList from '../../../components/notification-list';
import 'moment/locale/tr';
import styles from './style';
import ImageLayout from '../../../components/image-layout';
import * as bildirimActions from '../../../redux/actions/notifications';

moment.locale('tr')

const Notifications = () => {
    const dispatch = useDispatch();
    const currentUserData = useSelector(state => state.authReducer.currentUser.userId);
    const notificationData = useSelector(state => state.notificationsReducer.notifications);

    return (
        <ImageLayout
            title="Bildirimler"
            showBack
            isScrollable={true}
        >
            {notificationData.length >= 1 ?
                <View style={{ marginBottom: 50, marginTop: 20 }}>
                    <SwipeListView
                        data={bildirimler}
                        renderItem={(bildirim, i) => {
                            return (
                                <NotificationList
                                    key={i}
                                    body={bildirim.item.body}
                                    time={String(moment(bildirim.item.timestamp, "DD/MM/YYYYTHH:mm:ss").format("lll"))}
                                />
                            );
                        }}
                        renderHiddenItem={(bildirim, i) => {
                            return (
                                <CardItem key={i} style={{ backgroundColor: '#202026', borderRadius: 10, marginHorizontal: 30, marginBottom: 5, height: 80 }}>

                                    <View style={{ flex: 1, flexDirection: 'row', height: 60, justifyContent: 'center', alignItems: 'center', position: 'absolute', right: 0 }}>
                                        <Button onPress={() => {
                                            const newData = bildirimData.filter(q => q.id !== bildirim.item.id)
                                            setbildirimler(newData)
                                            dispatch(bildirimActions.deletenotification({ id: bildirim.item.id, userid: currentUserData }));
                                        }} style={{ flex: 1, alignItems: 'center', width: 60, height: 60, justifyContent: 'center', backgroundColor: '#FF2222', borderRadius: 10 }}>
                                            <Icon name="trash" color="#FFF" size={20} />
                                        </Button>
                                    </View>

                                </CardItem>
                            )
                        }}
                        disableRightSwipe={true}
                        // disableLeftSwipe={true}
                        leftOpenValue={75}
                        rightOpenValue={-65}
                    />
                </View>
                :
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 30 }}>
                    <Icon name="bell" size={48} color="#FFF" />
                    <Text allowFontScaling={false} style={styles.textStyle}>Herhangi bir bildiriminiz yok.</Text>
                </View>
            }
        </ImageLayout>
    )
}


export default Notifications;