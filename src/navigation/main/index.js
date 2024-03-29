import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { userAuthStateListener } from '../../redux/actions/auth';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Loading from '../../components/Loading';
import Welcome from '../../screens/loginpages/Welcome';
import ForgotPassword from '../../screens/loginpages/ForgotPassword';
import FoodLib from '../../screens/mainpages/FoodLib';
import WorkoutLib from '../../screens/mainpages/WorkoutLib';
import AddNewPost from '../../components/newPost/AddNewPost';
import Profile from '../../screens/mainpages/Profile';
import WorkoutDetails from '../../screens/workoutspages/WorkoutDetails';
import SliderDetails from '../../screens/workoutspages/SliderDetails';
import Feed from '../../screens/mainpages/Feed';
import Calories from '../../screens/caloriespages/Calories';
import StepCounter from '../../screens/steppages/StepCounter';
import Premium from '../../screens/profilepages/Premium';
import Notifications from '../../screens/profilepages/Notifications';
import Settings from '../../screens/settings/Settings';
import BildirimAyarlari from '../../screens/settings/BildirimAyarlari';
import FavoritedWorkouts from '../../screens/profilepages/FavoritedWorkouts';
import FavoritedFoods from '../../screens/profilepages/FavoritedFoods';
import Steps from '../../screens/registerpages/Steps';
import Info from '../../screens/registerpages/Info';
import HealthProblems from '../../screens/settings/HealthProblems';
import WorkoutDays from '../../screens/settings/WorkoutDays';
import MoveThumb from '../../screens/workoutspages/MoveThumb';
import TestList from '../../screens/profilepages/TestList';
import Testler from '../../screens/profilepages/Testler';
import Measurement from '../../screens/profilepages/Measurement';
import AddWater from '../../screens/profilepages/AddWater';
import TumGecmisler from '../../screens/profilepages/TumGecmisler';
import History from '../../screens/profilepages/History';
import LikedUsers from '../../components/liked-users';
import PostComments from '../../components/post-comments';
import WodList from '../../screens/workoutspages/WodList';
import StartWorkout from '../../screens/workoutspages/StartWorkout';
import StartWod from '../../screens/workoutspages/StartWod';
import EndWorkout from '../../screens/workoutspages/EndWorkout';
import WodCompleted from '../../screens/workoutspages/WodCompleted';
import WorkoutCompleted from '../../screens/workoutspages/WorkoutCompleted';
import HomeScreen from '../home';
import CronicProblems from '../../screens/settings/CronicProblems';
import PersonalSettings from '../../screens/settings/Personal';
import TargetSettings from '../../screens/settings/Target';
import Register from '../../screens/registerpages/Register';
import WodDetails from '../../screens/workoutspages/WodDetails';

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
                        <Stack.Screen name="Register" component={Register}
                            options={{
                                headerShown: false,
                                gestureEnabled: true
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
                        <Stack.Screen name="PersonalSettings" component={PersonalSettings}
                            options={{
                                title: 'Kişisel Bilgiler',
                                headerShown: false,
                                headerBackTitleVisible: false,
                                headerTintColor: '#000'
                            }}
                        />
                        <Stack.Screen name="HealthProblems" component={HealthProblems}
                            options={{
                                title: 'Sağlık Sorunları',
                                headerShown: false,
                                headerBackTitleVisible: false,
                                headerTintColor: '#000'
                            }}
                        />
                        <Stack.Screen name="CronicProblems" component={CronicProblems}
                            options={{
                                title: 'Eklem Ağrıları',
                                headerShown: false,
                                headerBackTitleVisible: false,
                                headerTintColor: '#000'
                            }}
                        />
                        <Stack.Screen name="TargetSettings" component={TargetSettings}
                            options={{
                                title: 'Hedef Ayarları',
                                headerShown: false,
                                headerBackTitleVisible: false,
                                headerTintColor: '#000'
                            }}
                        />
                        <Stack.Screen name="WorkoutDays" component={WorkoutDays}
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
                        <Stack.Screen name="Measurement" component={Measurement}
                            options={{
                                gestureEnabled: false,
                                headerShown: false,
                                headerBackTitleVisible: false,
                                headerTintColor: '#000'
                            }}
                        />
                        <Stack.Screen name="WodList" component={WodList}
                            options={{
                                headerShown: false,
                                headerBackTitleVisible: false,
                                headerTintColor: '#000'
                            }}
                        />
                        <Stack.Screen name="WodDetails" component={WodDetails}
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
                        <Stack.Screen name="StartWod" component={StartWod}
                            options={{
                                headerShown: false,
                                headerBackTitleVisible: false,
                                headerTintColor: '#000'
                            }}
                        />
                        <Stack.Screen name="WodCompleted" component={WodCompleted}
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
                        <Stack.Screen name="History" component={History}
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