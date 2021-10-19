import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity } from 'react-native';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { Divider } from 'react-native-elements';
import { useNavigation } from '@react-navigation/core';
import { auth, firestore } from '../../config/config';

const PLACEHOLDER_IMG = 'https://autosdutriomphe.fr/wp-content/uploads/2018/04/default-image.png';
const uploadPostScheme = Yup.object().shape({
    imageUrl: Yup.string().url().required('Fotoğraf linki eklemelisiniz.'),
    caption: Yup.string().max(512, 'Başlık karakter sınırı aşıyor.')
})

const FormikPostUploader = () => {
    const navigation = useNavigation();
    const [thumbnailUrl, setThumbnailUrl] = useState(PLACEHOLDER_IMG);
    const [currentLoggedInUser, setcurrentLoggedInUser] = useState(null);

    const getUsername = () => {
        const user = auth().currentUser;
        const unsubscribe = firestore()
            .collection('users')
            .where('owner_uid', '==', user.uid).limit(1).onSnapshot(
                snapshot => snapshot.docs.map(doc => {
                    setcurrentLoggedInUser({
                        username: doc.data().username,
                        profilePicture: doc.data().profile_picture
                    })
                })
            )
        return unsubscribe;
    }

    useEffect(() => {
        getUsername();
    }, [])

    const uploadPostToDb = (imageUrl, caption) => {
        const unsubscribe = firestore()
        .collection('users')
        .doc(auth().currentUser.email)
        .collection('posts')
        .add({
            imageUrl: imageUrl,
            user: currentLoggedInUser.username,
            profile_picture: currentLoggedInUser.profilePicture,
            owner_uid: auth().currentUser.uid,
            owner_email: auth().currentUser.email,
            caption: caption,
            createdAt: firestore.FieldValue.serverTimestamp(),
            likes_by_users: [],
            comments: []
        })
        .then(() => navigation.goBack())

        return unsubscribe;
    }

    return (
        <Formik
            initialValues={{ caption: '', imageUrl: '' }}
            onSubmit={(values) => {
                uploadPostToDb(values.imageUrl, values.caption)
            }}
            validationSchema={uploadPostScheme}
            validateOnMount={true}
        >
            {({
                handleBlur,
                handleChange,
                handleSubmit,
                values,
                errors,
                isValid
            }) => (
                <>
                    <View style={{ margin: 20, justifyContent: 'space-between', flexDirection: 'row' }}>
                        <Image source={{ uri: thumbnailUrl ? thumbnailUrl : PLACEHOLDER_IMG }} style={{ width: 100, height: 100 }} />
                        <View style={{ flex: 1, marginLeft: 12 }}>
                            <TextInput
                                style={{ color: '#fff', fontSize: 20 }}
                                placeholder="Bir başlık yazın..."
                                placeholderTextColor="gray"
                                multiline
                                onChangeText={handleChange('caption')}
                                onBlur={handleBlur('caption')}
                                value={values.caption}
                            />
                        </View>
                    </View>

                    <Divider width={0.2} orientation="vertical" />
                    <TextInput
                        onChange={e => setThumbnailUrl(e.nativeEvent.text)}
                        autoCapitalize='none'
                        autoCorrect={false}
                        style={{ color: '#fff', fontSize: 18 }}
                        placeholder="Fotoğraf linkini girin..."
                        placeholderTextColor="gray"
                        onChangeText={handleChange('imageUrl')}
                        onBlur={handleBlur('imageUrl')}
                        value={values.imageUrl}
                    />
                    {errors.imageUrl && (
                        <Text style={{ fontSize: 14, color: 'red' }}>
                            {errors.imageUrl}
                        </Text>
                    )}

                    <TouchableOpacity onPress={handleSubmit} disabled={!isValid} style={{ backgroundColor: '#fff', padding: 10, marginTop: 20, justifyContent: 'center', alignItems: 'center' }}>
                        <Text>Paylaş</Text>
                    </TouchableOpacity>
                </>
            )
            }
        </Formik>
    )
}

export default FormikPostUploader;