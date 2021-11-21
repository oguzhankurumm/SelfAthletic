import React, { useState, useRef } from 'react'
import { View, Text, Pressable, ScrollView, SafeAreaView, Animated, Dimensions } from 'react-native'
import RegisterLayout from '../../../components/register-layout';
import { auth, firestore } from '../../../config/config';
import { showMessage } from 'react-native-flash-message';
import Page1 from './Page1';

const { width, height } = Dimensions.get("window");

const Register = () => {
    const [Loading, setLoading] = useState(false);
    const [animation] = useState(new Animated.Value(0))
    const scrollRef = useRef(null);

    const moveNext = index => {
        scrollRef.current.scrollTo({
            x: index * width,
            animation: false
        })
    }

    const showMsg = ({ message, description, type }) => {
        setLoading(false);
        showMessage({
            message,
            description,
            type: type,
            icon: type,
            hideStatusBar: true
        });
    }

    const onSave = async (values) => {
        console.log('values:', values)
        // setLoading(true);
        // try {
        //     const profileValues = {
        //         firstName,
        //         lastName,
        //         birthDate: moment(birthDate).unix(),
        //         gender,
        //         values: {
        //             weight: parseInt(weight),
        //             height: parseInt(height)
        //         }
        //     }
        //     await firestore().collection('users').doc(auth().currentUser.email).set(profileValues, { merge: true });
        //     showMsg({ message: 'Başarılı', description: 'Kişisel bilgileriniz başarıyla kaydedildi', type: 'success' });
        // } catch (error) {
        //     showMsg({ message: 'Hata', description: 'Kişisel bilgileriniz kaydedilirken bir hata oluştu', type: 'danger' });
        // }
    }


    return (
        <RegisterLayout
            title="Kayıt Ol"
            Loading={Loading}
        >
            <ScrollView
                ref={scrollRef}
                pagingEnabled
                horizontal
                scrollEventThrottle={16}
                showsHorizontalScrollIndicator={false}
                onScroll={Animated.event([
                    {
                        nativeEvent: {
                            contentOffset: {
                                x: animation,
                            }
                        }
                    }
                ])}
            >
                <Page1 submitHandler={(val) => {
                    console.log('val:', val);
                }} setLoading={setLoading} Loading={Loading} />
                <Page1 submitHandler={(val) => console.log('val:', val)} setLoading={setLoading} Loading={Loading} />
            </ScrollView>
        </RegisterLayout>
    )
}

export default Register;