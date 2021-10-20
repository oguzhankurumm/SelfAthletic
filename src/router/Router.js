import React from 'react'
import { Image } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Welcome from '../pages/loginpages/Welcome';
import ForgotPassword from '../pages/loginpages/ForgotPassword';
import Home from '../pages/mainpages/Home';
import Workout from '../pages/mainpages/Workout';
import AntrenmanList from '../pages/profilepages/AntrenmanList';
import Food from '../pages/mainpages/Food';
import FoodLib from '../pages/mainpages/FoodLib';
import WorkoutLib from '../pages/mainpages/WorkoutLib';
import AddNewPost from '../components/newPost/AddNewPost';
import Profile from '../pages/profilepages/Profile';
import WorkoutDetails from '../pages/workoutspages/WorkoutDetails';
import SliderDetails from '../pages/workoutspages/SliderDetails';
import WorkoutVideo from '../pages/workoutspages/WorkoutVideo';
import WorkoutSpecial from '../pages/workoutspages/WorkoutSpecial';
import WorkoutList from '../pages/workoutspages/WorkoutList';
import Feed from '../pages/mainpages/Feed';
import Calories from '../pages/caloriespages/Calories';
import StepCounter from '../pages/steppages/StepCounter';
import Premium from '../pages/profilepages/Premium';
import Notifications from '../pages/profilepages/Notifications';
import Settings from '../pages/profilepages/Settings';
import BildirimAyarlari from '../pages/settings/BildirimAyarlari';
import KisiselBilgiler from '../pages/settings/KisiselBilgiler';
import FavoritedWorkouts from '../pages/profilepages/FavoritedWorkouts';
import FavoritedFoods from '../pages/profilepages/FavoritedFoods';
import Steps from '../pages/registerpages/Steps';
import Info from '../pages/registerpages/Info';
import SaglikSorunlari from '../pages/settings/SaglikSorunlari';
import HedefAyarlari from '../pages/settings/HedefAyarlari';
import AntrenmanGunleri from '../pages/settings/AntrenmanGunleri';
import MoveThumb from '../pages/workoutspages/MoveThumb';
import TestList from '../pages/profilepages/TestList';
import Testler from '../pages/profilepages/Testler';
import Olcumler from '../pages/profilepages/Olcumler';
import AddWater from '../pages/profilepages/AddWater';
import TumGecmisler from '../pages/profilepages/TumGecmisler';
import Gecmis from '../pages/profilepages/Gecmis';
import LikedUsers from '../components/liked-users';
import PostComments from '../components/post-comments';

const Tab = createBottomTabNavigator();
const AuthStack = createStackNavigator();
const RootStack = createStackNavigator();

function HomeTabBar() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {

                    if (route.name === 'ANASAYFA') {
                        return (
                            <Image
                                resizeMode="contain"
                                style={{ height: 28, width: 28, tintColor: color }}
                                source={require('../img/anasayfa.png')
                                } />
                        )
                    }

                    if (route.name === 'ANTRENMAN') {
                        return (
                            <Image
                                resizeMode="contain"
                                style={{ height: 28, width: 28, tintColor: color }}
                                source={require('../img/antrenman.png')
                                } />
                        )
                    }


                    if (route.name === 'BESLENME') {
                        return (
                            <Image
                                resizeMode="contain"
                                style={{ height: 28, width: 28, tintColor: color }}
                                source={require('../img/beslenme.png')
                                } />
                        )
                    }

                    if (route.name === 'PROFİL') {
                        return (
                            <Image
                                resizeMode="contain"
                                style={{ height: 28, width: 28, tintColor: color }}
                                source={require('../img/profilicon.png')
                                } />
                        )
                    }

                    if (route.name === 'AKIŞ') {
                        return (
                            <Image
                                resizeMode="contain"
                                style={{ height: 28, width: 28, tintColor: color }}
                                source={require('../img/plus.png')
                                } />
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

export function Auth() {
    return (
        <AuthStack.Navigator initialRouteName="Welcome">
            <AuthStack.Screen name="Welcome" component={Welcome}
                options={{
                    title: 'Welcome',
                    headerShown: false
                }}
            />
            <AuthStack.Screen name="Info" component={Info}
                options={{
                    headerShown: false,
                    gestureEnabled: false
                }}
            />
            <AuthStack.Screen name="Steps" component={Steps}
                options={{
                    headerShown: false,
                    gestureEnabled: false
                }}
            />
            <AuthStack.Screen name="ForgotPassword" component={ForgotPassword}
                options={{
                    title: 'Parolamı Unuttum',
                    headerBackTitleVisible: false,
                    headerTintColor: '#FFF',
                    headerTransparent: true,
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
                    gestureEnabled: false,
                    headerShown: false
                })}
            />
            <AuthStack.Screen name="InfoProfile" component={Info}
                options={{
                    headerShown: false,
                    gestureEnabled: false
                }}
            />
            <AuthStack.Screen name="StepsProfile" component={Steps}
                options={{
                    headerShown: false,
                    gestureEnabled: false
                }}
            />
            <RootStack.Screen name="Feed" component={Feed}
                options={{
                    headerShown: false
                }}
            />
            <RootStack.Screen name="NewPost" component={AddNewPost}
                options={{
                    headerShown: false
                }}
            />
            <RootStack.Screen name="LikedUsers" component={LikedUsers}
                options={{
                    headerShown: false
                }}
            />
            <RootStack.Screen name="PostComments" component={PostComments}
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
            <RootStack.Screen name="Notifications" component={Notifications}
                options={{
                    title: 'Bildirimler',
                    headerShown: false,
                    headerBackTitleVisible: false,
                    headerTintColor: '#000'
                }}
            />
            <RootStack.Screen name="Settings" component={Settings}
                options={{
                    title: 'Ayarlar',
                    headerShown: false,
                    headerBackTitleVisible: false,
                    headerTintColor: '#000'
                }}
            />
            <RootStack.Screen name="BildirimAyarlari" component={BildirimAyarlari}
                options={{
                    title: 'Bildirim Ayarları',
                    headerShown: false,
                    headerBackTitleVisible: false,
                    headerTintColor: '#000'
                }}
            />
            <RootStack.Screen name="KisiselBilgiler" component={KisiselBilgiler}
                options={{
                    title: 'Kişisel Bilgiler',
                    headerShown: false,
                    headerBackTitleVisible: false,
                    headerTintColor: '#000'
                }}
            />
            <RootStack.Screen name="SaglikSorunlari" component={SaglikSorunlari}
                options={{
                    title: 'Sağlık Sorunları',
                    headerShown: false,
                    headerBackTitleVisible: false,
                    headerTintColor: '#000'
                }}
            />
            <RootStack.Screen name="HedefAyarlari" component={HedefAyarlari}
                options={{
                    title: 'Hedef Ayarları',
                    headerShown: false,
                    headerBackTitleVisible: false,
                    headerTintColor: '#000'
                }}
            />
            <RootStack.Screen name="AntrenmanGunleri" component={AntrenmanGunleri}
                options={{
                    title: 'Antrenman Günleri',
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
            <RootStack.Screen name="MoveThumb" component={MoveThumb}
                options={{
                    headerShown: false,
                    headerBackTitleVisible: false,
                    headerTintColor: '#000'
                }}
            />
            <RootStack.Screen name="TestList" component={TestList}
                options={{
                    gestureEnabled: true,
                    headerShown: false,
                    headerBackTitleVisible: false,
                    headerTintColor: '#000'
                }}
            />
            <RootStack.Screen name="Testler" component={Testler}
                options={{
                    gestureEnabled: false,
                    headerShown: false,
                    headerBackTitleVisible: false,
                    headerTintColor: '#000'
                }}
            />
            <RootStack.Screen name="Olcumler" component={Olcumler}
                options={{
                    gestureEnabled: false,
                    headerShown: false,
                    headerBackTitleVisible: false,
                    headerTintColor: '#000'
                }}
            />
            <RootStack.Screen name="WorkoutVideo" component={WorkoutVideo}
                options={{
                    headerShown: false,
                    headerBackTitleVisible: false,
                    headerTintColor: '#000'
                }}
            />
            <RootStack.Screen name="WorkoutSpecial" component={WorkoutSpecial}
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
            <RootStack.Screen name="SliderDetails" component={SliderDetails}
                options={{
                    headerShown: false,
                    headerBackTitleVisible: false,
                    headerTintColor: '#000'
                }}
            />
            <RootStack.Screen name="Calories" component={Calories}
                options={{
                    headerShown: false,
                    headerBackTitleVisible: false,
                    headerTintColor: '#000'
                }}
            />
            <RootStack.Screen name="StepCounter" component={StepCounter}
                options={{
                    headerShown: false,
                    headerBackTitleVisible: false,
                    headerTintColor: '#000'
                }}
            />
            <RootStack.Screen name="Premium" component={Premium}
                options={{
                    headerShown: false,
                    headerBackTitleVisible: false,
                    headerTintColor: '#000'
                }}
            />
            <RootStack.Screen name="FavoritedWorkouts" component={FavoritedWorkouts}
                options={{
                    headerShown: false,
                    headerBackTitleVisible: false,
                    headerTintColor: '#000'
                }}
            />
            <RootStack.Screen name="AntrenmanList" component={AntrenmanList}
                options={{
                    headerShown: false,
                    headerBackTitleVisible: false,
                    headerTintColor: '#000'
                }}
            />
            <RootStack.Screen name="AddWater" component={AddWater}
                options={{
                    headerShown: false,
                    headerBackTitleVisible: false,
                    headerTintColor: '#000'
                }}
            />
            <RootStack.Screen name="FavoritedFoods" component={FavoritedFoods}
                options={{
                    headerShown: false,
                    headerBackTitleVisible: false,
                    headerTintColor: '#000'
                }}
            />
            <RootStack.Screen name="TumGecmisler" component={TumGecmisler}
                options={{
                    headerShown: false,
                    headerBackTitleVisible: false,
                    headerTintColor: '#000'
                }}
            />
            <RootStack.Screen name="Gecmis" component={Gecmis}
                options={{
                    headerShown: false,
                    headerBackTitleVisible: false,
                    headerTintColor: '#000'
                }}
            />
            <RootStack.Screen name="FoodLib" component={FoodLib}
                options={{
                    headerShown: false,
                    headerBackTitleVisible: false,
                    headerTintColor: '#000'
                }}
            />
            <RootStack.Screen name="WorkoutLib" component={WorkoutLib}
                options={{
                    headerShown: false,
                    headerBackTitleVisible: false,
                    headerTintColor: '#000'
                }}
            />
        </RootStack.Navigator>
    )
}