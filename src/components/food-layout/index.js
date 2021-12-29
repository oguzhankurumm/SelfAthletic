import React, { useState } from 'react';
import { View, ImageBackground, Dimensions, StatusBar, SafeAreaView } from 'react-native';
import SpinnerLoading from '../SpinnerLoading';
import styles from './style';
import HeaderFood from '../header-food';
import Sidebar from '../Sidebar';
import { ScrollView } from 'react-native-gesture-handler';

const FoodLayout = ({ children, Loading, title, isScrollable, showBack, showAddPost }) => {
    const { width, height } = Dimensions.get("window");
    const [SidebarStatus, setSidebarStatus] = useState(false);

    const showMenuOnPress = () => {
        setSidebarStatus(!SidebarStatus);
    }

    return (
        <ImageBackground
            style={{ height: height, width: width }}
            resizeMode="cover"
            source={require('../../assets/img/bg.jpg')}
        >
            <StatusBar barStyle="light-content" />
            <SpinnerLoading Loading={Loading} />
            <Sidebar opened={SidebarStatus} onClose={showMenuOnPress} />
            <SafeAreaView style={styles.container}>
                <HeaderFood
                    showBack={showBack === undefined ? false : true}
                    showAddPost={showAddPost === undefined ? false : true}
                    title={title}
                    showMenuOnPress={showMenuOnPress}
                />

                {isScrollable ?
                    <ScrollView
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        style={styles.container}
                        contentContainerStyle={{ paddingBottom: 100 }}
                    >
                        {children}
                    </ScrollView>
                    :
                    <View style={styles.container}>
                        {children}
                    </View>
                }
            </SafeAreaView>
        </ImageBackground>
    );
}

export default FoodLayout;