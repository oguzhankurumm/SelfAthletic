import React from 'react'
import Icon from 'react-native-vector-icons/FontAwesome5';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Welcome from '../pages/loginpages/Welcome';
import ForgotPassword from '../pages/loginpages/ForgotPassword';
import Home from '../pages/mainpages/Home';
import Antrenman from '../pages/mainpages/Antrenman';
import Food from '../pages/mainpages/Food';
import SendPost from '../pages/mainpages/SendPost';
import Profile from '../pages/profilepages/Profile';
import WorkoutDetails from '../pages/workoutspages/WorkoutDetails';
import SliderDetails from '../pages/workoutspages/SliderDetails';
import WorkoutVideo from '../pages/workoutspages/WorkoutVideo';
import WorkoutSpecial from '../pages/workoutspages/WorkoutSpecial';
import WorkoutList from '../pages/workoutspages/WorkoutList';
import FeedList from '../pages/mainpages/FeedList';
import FeedDetails from '../pages/mainpages/FeedDetails';
import Calories from '../pages/caloriespages/Calories';
import StepCounter from '../pages/steppages/StepCounter';
import Premium from '../pages/profilepages/Premium';
import Notifications from '../pages/profilepages/Notifications';
import Settings from '../pages/profilepages/Settings';
import BildirimAyarlari from '../pages/settings/BildirimAyarlari';
import KisiselBilgiler from '../pages/settings/KisiselBilgiler';
import FavoritedWorkouts from '../pages/profilepages/FavoritedWorkouts';
import Steps from '../pages/registerpages/Steps';
import Info from '../pages/registerpages/Info';
import Gecmis from '../pages/profilepages/Gecmis';
import SaglikSorunlari from '../pages/settings/SaglikSorunlari';
import HedefAyarlari from '../pages/settings/HedefAyarlari';
import AntrenmanGunleri from '../pages/settings/AntrenmanGunleri';
import MoveThumb from '../pages/workoutspages/MoveThumb';

const Tab = createBottomTabNavigator();
const AuthStack = createStackNavigator();
const RootStack = createStackNavigator();

function HomeTabBar() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    let iconName;

                    if (route.name === 'ANASAYFA') {
                        iconName = 'home';
                    }

                    if (route.name === 'ANTRENMAN') {
                        iconName = 'dumbbell';
                    }

                    // if (route.name === 'SENDPOST') {
                    //     iconName = 'plus';
                    // }

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
            <Tab.Screen name="ANASAYFA" component={Home} />
            <Tab.Screen name="ANTRENMAN" component={Antrenman} />
            {/* <Tab.Screen name="SENDPOST" component={SendPost} /> */}
            <Tab.Screen name="BESLENME" component={Food} />
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
                    headerShown: false,
                    gestureEnabled: false
                })}
            />
            <RootStack.Screen name="Info" component={Info}
                options={{
                    headerShown: false,
                    gestureEnabled: false
                }}
            />
            <RootStack.Screen name="Steps" component={Steps}
                options={{
                    headerShown: false,
                    gestureEnabled: false
                }}
            />
            <RootStack.Screen name="FeedList" component={FeedList}
                options={{
                    headerShown: false
                }}
            />
            <RootStack.Screen name="FeedDetails" component={FeedDetails}
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
            <RootStack.Screen name="Gecmis" component={Gecmis}
                options={{
                    headerShown: false,
                    headerBackTitleVisible: false,
                    headerTintColor: '#000'
                }}
            />
        </RootStack.Navigator>
    )
}