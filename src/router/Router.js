import React from 'react'
import { TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Welcome from '../pages/loginpages/Welcome';
import ForgotPassword from '../pages/loginpages/ForgotPassword';
import Home from '../pages/mainpages/Home';
import Antrenman from '../pages/mainpages/Antrenman';
import SendPost from '../pages/mainpages/SendPost';
import Profile from '../pages/profilepages/Profile';
import WorkoutDetails from '../pages/workoutspages/WorkoutDetails';
import WorkoutList from '../pages/workoutspages/WorkoutList';
import FeedList from '../pages/mainpages/FeedList';


const Tab = createBottomTabNavigator();
const AuthStack = createStackNavigator();
const RootStack = createStackNavigator();


function HomeTabBar() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    let iconName;

                    if (route.name === 'ANA SAYFA') {
                        iconName = 'home';
                    }

                    if (route.name === 'ANTRENMAN') {
                        iconName = 'dumbbell';
                    }

                    if (route.name === 'SENDPOST') {
                        iconName = 'plus';
                    }

                    if (route.name === 'BESLENME') {
                        iconName = 'utensils';
                    }

                    if (route.name === 'PROFİLİM') {
                        iconName = 'user';
                    }

                    // Burada tüm ikonları return edebilirsiniz!
                    return <Icon name={iconName} size={size} color={color} />;
                },
            })}
            tabBarOptions={{
                activeBackgroundColor: '#000',
                inactiveBackgroundColor: '#000',
                activeTintColor: '#C7CB4B',
                inactiveTintColor: 'gray',
                showLabel: false
            }}
        >
            <Tab.Screen name="ANA SAYFA" component={Home} />
            <Tab.Screen name="ANTRENMAN" component={Antrenman} />
            <Tab.Screen name="SENDPOST" component={SendPost} />
            <Tab.Screen name="BESLENME" component={Home} />
            <Tab.Screen name="PROFİLİM" component={Profile} />
        </Tab.Navigator>
    );
}

export function Auth() {
    return (
        <AuthStack.Navigator initialRouteName="Welcome">
            <AuthStack.Screen name="Welcome" component={Welcome}
                options={{
                    title: 'Welcome',
                    headerShown: false
                }}
            />
            <AuthStack.Screen name="ForgotPassword" component={ForgotPassword}
                options={{
                    title: 'Parolamı Unuttum',
                    headerBackTitleVisible: false,
                    headerTintColor: '#000',
                    headerShown: true
                }}
            />


        </AuthStack.Navigator>
    )
}


export function Root() {
    return (
        <RootStack.Navigator initialRouteName="Home">
            <RootStack.Screen name="Home" component={HomeTabBar}
                options={({ route, navigation }) => ({
                    headerShown: false
                })}
            />
            <RootStack.Screen name="FeedList" component={FeedList}
                options={{
                    headerShown: false
                }}
            />
            <RootStack.Screen name="Profile" component={Profile}
                options={{
                    title: 'Profil',
                    headerShown: false,
                    headerBackTitleVisible: false,
                    headerTintColor: '#000'
                }}
            />
            <RootStack.Screen name="WorkoutDetails" component={WorkoutDetails}
                options={{
                    headerShown: false,
                    headerBackTitleVisible: false,
                    headerTintColor: '#000'
                }}
            />
            <RootStack.Screen name="WorkoutList" component={WorkoutList}
                options={{
                    headerShown: false,
                    headerBackTitleVisible: false,
                    headerTintColor: '#000'
                }}
            />
        </RootStack.Navigator>
    )
}