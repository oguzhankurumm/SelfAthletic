import React from 'react'
import { Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Home from '../../pages/mainpages/Home';
import Workout from '../../pages/mainpages/Workout';
import Feed from '../../pages/mainpages/Feed';
import Food from '../../pages/mainpages/Food';
import Profile from '../../pages/mainpages/Profile';

const Tab = createBottomTabNavigator();

export default function HomeScreen() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {

                    if (route.name === 'ANASAYFA') {
                        return (
                            <Image
                                resizeMode="contain"
                                style={{ height: 28, width: 28, tintColor: color }}
                                source={require('../../img/anasayfa.png')}
                            />
                        )
                    }

                    if (route.name === 'ANTRENMAN') {
                        return (
                            <Image
                                resizeMode="contain"
                                style={{ height: 28, width: 28, tintColor: color }}
                                source={require('../../img/antrenman.png')}
                            />
                        )
                    }


                    if (route.name === 'BESLENME') {
                        return (
                            <Image
                                resizeMode="contain"
                                style={{ height: 28, width: 28, tintColor: color }}
                                source={require('../../img/beslenme.png')}
                            />
                        )
                    }

                    if (route.name === 'PROFİL') {
                        return (
                            <Image
                                resizeMode="contain"
                                style={{ height: 28, width: 28, tintColor: color }}
                                source={require('../../img/profilicon.png')}
                            />
                        )
                    }

                    if (route.name === 'AKIŞ') {
                        return (
                            <Image
                                resizeMode="contain"
                                style={{ height: 28, width: 28, tintColor: color }}
                                source={require('../../img/plus.png')}
                            />
                        )
                    }
                },
            })}
            tabBarOptions={{
                activeBackgroundColor: '#19181D',
                inactiveBackgroundColor: '#19181D',
                activeTintColor: '#C7CB4B',
                inactiveTintColor: 'gray',
                showLabel: false,
                style: {
                    backgroundColor: '#19181D',
                    borderTopWidth: 1,
                    borderTopColor: '#19181D'
                },
            }}
        >
            <Tab.Screen name="ANASAYFA" component={Home} />
            <Tab.Screen name="ANTRENMAN" component={Workout} />
            <Tab.Screen name="AKIŞ" component={Feed} />
            <Tab.Screen name="BESLENME" component={Food} />
            <Tab.Screen name="PROFİL" component={Profile} />
        </Tab.Navigator >
    );
}