import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { userAuthStateListener } from '../../redux/actions/auth';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Loading from '../../components/Loading';
import Welcome from '../../pages/loginpages/Welcome';
import ForgotPassword from '../../pages/loginpages/ForgotPassword';
import AntrenmanList from '../../pages/profilepages/AntrenmanList';
import FoodLib from '../../pages/mainpages/FoodLib';
import WorkoutLib from '../../pages/mainpages/WorkoutLib';
import AddNewPost from '../../components/newPost/AddNewPost';
import Profile from '../../pages/profilepages/Profile';
import WorkoutDetails from '../../pages/workoutspages/WorkoutDetails';
import SliderDetails from '../../pages/workoutspages/SliderDetails';
import WorkoutVideo from '../../pages/workoutspages/WorkoutVideo';
import Feed from '../../pages/mainpages/Feed';
import Calories from '../../pages/caloriespages/Calories';
import StepCounter from '../../pages/steppages/StepCounter';
import Premium from '../../pages/profilepages/Premium';
import Notifications from '../../pages/profilepages/Notifications';
import Settings from '../../pages/profilepages/Settings';
import BildirimAyarlari from '../../pages/settings/BildirimAyarlari';
import KisiselBilgiler from '../../pages/settings/KisiselBilgiler';
import FavoritedWorkouts from '../../pages/profilepages/FavoritedWorkouts';
import FavoritedFoods from '../../pages/profilepages/FavoritedFoods';
import Steps from '../../pages/registerpages/Steps';
import Info from '../../pages/registerpages/Info';
import SaglikSorunlari from '../../pages/settings/SaglikSorunlari';
import HedefAyarlari from '../../pages/settings/HedefAyarlari';
import AntrenmanGunleri from '../../pages/settings/AntrenmanGunleri';
import MoveThumb from '../../pages/workoutspages/MoveThumb';
import TestList from '../../pages/profilepages/TestList';
import Testler from '../../pages/profilepages/Testler';
import Olcumler from '../../pages/profilepages/Olcumler';
import AddWater from '../../pages/profilepages/AddWater';
import TumGecmisler from '../../pages/profilepages/TumGecmisler';
import Gecmis from '../../pages/profilepages/Gecmis';
import LikedUsers from '../../components/liked-users';
import PostComments from '../../components/post-comments';
import StartWorkout from '../../pages/workoutspages/StartWorkout';
import EndWorkout from '../../pages/workoutspages/EndWorkout';
import WorkoutCompleted from '../../pages/workoutspages/WorkoutCompleted';
import HomeScreen from '../home';
import { auth } from '../../config/config';

const Stack = createStackNavigator();

export default function Route() {
    const currentUserObj = useSelector(state => state.authReducer);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(userAuthStateListener());
    }, [])

    if (!currentUserObj.loaded) {
        return (
            <Loading />
        )
    }

    return (
        <NavigationContainer>
            <Stack.Navigator>
                {currentUserObj.currentUser == null ?
                    <>
                        <Stack.Screen name="Welcome" component={Welcome}
                            options={{
                                title: 'Welcome',
                                headerShown: false
                            }}
                        />
                        <Stack.Screen name="Info" component={Info}
                            options={{
                                headerShown: false,
                                gestureEnabled: false
                            }}
                        />
                        <Stack.Screen name="Steps" component={Steps}
                            options={{
                                headerShown: false,
                                gestureEnabled: false
                            }}
                        />
                        <Stack.Screen name="ForgotPassword" component={ForgotPassword}
                            options={{
                                title: 'Parolamı Unuttum',
                                headerBackTitleVisible: false,
                                headerTintColor: '#FFF',
                                headerTransparent: true,
                                headerShown: true
                            }}
                        />
                    </>
                    :
                    <>
                        <Stack.Screen name="Home" component={HomeScreen}
                            options={{
                                gestureEnabled: false,
                                headerShown: false
                            }}
                        />
                        <Stack.Screen name="InfoProfile" component={Info}
                            options={{
                                headerShown: false,
                                gestureEnabled: false
                            }}
                        />
                        <Stack.Screen name="StepsProfile" component={Steps}
                            options={{
                                headerShown: false,
                                gestureEnabled: false
                            }}
                        />
                        <Stack.Screen name="Feed" component={Feed}
                            options={{
                                headerShown: false
                            }}
                        />
                        <Stack.Screen name="NewPost" component={AddNewPost}
                            options={{
                                headerShown: false
                            }}
                        />
                        <Stack.Screen name="LikedUsers" component={LikedUsers}
                            options={{
                                headerShown: false
                            }}
                        />
                        <Stack.Screen name="PostComments" component={PostComments}
                            options={{
                                headerShown: false
                            }}
                        />
                        <Stack.Screen name="Profile" component={Profile}
                            options={{
                                title: 'Profil',
                                headerShown: false,
                                headerBackTitleVisible: false,
                                headerTintColor: '#000'
                            }}
                        />
                        <Stack.Screen name="Notifications" component={Notifications}
                            options={{
                                title: 'Bildirimler',
                                headerShown: false,
                                headerBackTitleVisible: false,
                                headerTintColor: '#000'
                            }}
                        />
                        <Stack.Screen name="Settings" component={Settings}
                            options={{
                                title: 'Ayarlar',
                                headerShown: false,
                                headerBackTitleVisible: false,
                                headerTintColor: '#000'
                            }}
                        />
                        <Stack.Screen name="BildirimAyarlari" component={BildirimAyarlari}
                            options={{
                                title: 'Bildirim Ayarları',
                                headerShown: false,
                                headerBackTitleVisible: false,
                                headerTintColor: '#000'
                            }}
                        />
                        <Stack.Screen name="KisiselBilgiler" component={KisiselBilgiler}
                            options={{
                                title: 'Kişisel Bilgiler',
                                headerShown: false,
                                headerBackTitleVisible: false,
                                headerTintColor: '#000'
                            }}
                        />
                        <Stack.Screen name="SaglikSorunlari" component={SaglikSorunlari}
                            options={{
                                title: 'Sağlık Sorunları',
                                headerShown: false,
                                headerBackTitleVisible: false,
                                headerTintColor: '#000'
                            }}
                        />
                        <Stack.Screen name="HedefAyarlari" component={HedefAyarlari}
                            options={{
                                title: 'Hedef Ayarları',
                                headerShown: false,
                                headerBackTitleVisible: false,
                                headerTintColor: '#000'
                            }}
                        />
                        <Stack.Screen name="AntrenmanGunleri" component={AntrenmanGunleri}
                            options={{
                                title: 'Antrenman Günleri',
                                headerShown: false,
                                headerBackTitleVisible: false,
                                headerTintColor: '#000'
                            }}
                        />
                        <Stack.Screen name="WorkoutDetails" component={WorkoutDetails}
                            options={{
                                headerShown: false,
                                headerBackTitleVisible: false,
                                headerTintColor: '#000'
                            }}
                        />
                        <Stack.Screen name="MoveThumb" component={MoveThumb}
                            options={{
                                headerShown: false,
                                headerBackTitleVisible: false,
                                headerTintColor: '#000'
                            }}
                        />
                        <Stack.Screen name="TestList" component={TestList}
                            options={{
                                gestureEnabled: true,
                                headerShown: false,
                                headerBackTitleVisible: false,
                                headerTintColor: '#000'
                            }}
                        />
                        <Stack.Screen name="Testler" component={Testler}
                            options={{
                                gestureEnabled: false,
                                headerShown: false,
                                headerBackTitleVisible: false,
                                headerTintColor: '#000'
                            }}
                        />
                        <Stack.Screen name="Olcumler" component={Olcumler}
                            options={{
                                gestureEnabled: false,
                                headerShown: false,
                                headerBackTitleVisible: false,
                                headerTintColor: '#000'
                            }}
                        />
                        <Stack.Screen name="WorkoutVideo" component={WorkoutVideo}
                            options={{
                                headerShown: false,
                                headerBackTitleVisible: false,
                                headerTintColor: '#000'
                            }}
                        />
                        <Stack.Screen name="StartWorkout" component={StartWorkout}
                            options={{
                                headerShown: false,
                                headerBackTitleVisible: false,
                                headerTintColor: '#000'
                            }}
                        />
                        <Stack.Screen name="EndWorkout" component={EndWorkout}
                            options={{
                                headerShown: false,
                                headerBackTitleVisible: false,
                                headerTintColor: '#000',
                                gestureEnabled: false
                            }}
                        />
                        <Stack.Screen name="WorkoutCompleted" component={WorkoutCompleted}
                            options={{
                                headerShown: false,
                                headerBackTitleVisible: false,
                                headerTintColor: '#000',
                                gestureEnabled: false
                            }}
                        />
                        <Stack.Screen name="SliderDetails" component={SliderDetails}
                            options={{
                                headerShown: false,
                                headerBackTitleVisible: false,
                                headerTintColor: '#000'
                            }}
                        />
                        <Stack.Screen name="Calories" component={Calories}
                            options={{
                                headerShown: false,
                                headerBackTitleVisible: false,
                                headerTintColor: '#000'
                            }}
                        />
                        <Stack.Screen name="StepCounter" component={StepCounter}
                            options={{
                                headerShown: false,
                                headerBackTitleVisible: false,
                                headerTintColor: '#000'
                            }}
                        />
                        <Stack.Screen name="Premium" component={Premium}
                            options={{
                                headerShown: false,
                                headerBackTitleVisible: false,
                                headerTintColor: '#000'
                            }}
                        />
                        <Stack.Screen name="FavoritedWorkouts" component={FavoritedWorkouts}
                            options={{
                                headerShown: false,
                                headerBackTitleVisible: false,
                                headerTintColor: '#000'
                            }}
                        />
                        <Stack.Screen name="AntrenmanList" component={AntrenmanList}
                            options={{
                                headerShown: false,
                                headerBackTitleVisible: false,
                                headerTintColor: '#000'
                            }}
                        />
                        <Stack.Screen name="AddWater" component={AddWater}
                            options={{
                                headerShown: false,
                                headerBackTitleVisible: false,
                                headerTintColor: '#000'
                            }}
                        />
                        <Stack.Screen name="FavoritedFoods" component={FavoritedFoods}
                            options={{
                                headerShown: false,
                                headerBackTitleVisible: false,
                                headerTintColor: '#000'
                            }}
                        />
                        <Stack.Screen name="TumGecmisler" component={TumGecmisler}
                            options={{
                                headerShown: false,
                                headerBackTitleVisible: false,
                                headerTintColor: '#000'
                            }}
                        />
                        <Stack.Screen name="Gecmis" component={Gecmis}
                            options={{
                                headerShown: false,
                                headerBackTitleVisible: false,
                                headerTintColor: '#000'
                            }}
                        />
                        <Stack.Screen name="FoodLib" component={FoodLib}
                            options={{
                                headerShown: false,
                                headerBackTitleVisible: false,
                                headerTintColor: '#000'
                            }}
                        />
                        <Stack.Screen name="WorkoutLib" component={WorkoutLib}
                            options={{
                                headerShown: false,
                                headerBackTitleVisible: false,
                                headerTintColor: '#000'
                            }}
                        />
                    </>
                }
            </Stack.Navigator>
        </NavigationContainer>
    )
}