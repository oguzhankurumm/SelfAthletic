import React, { useState } from 'react'
import { View, Text, Pressable } from 'react-native'
import ImageLayout from '../../../components/image-layout';
import { useSelector } from 'react-redux';
import { auth, firestore } from '../../../config/config';
import { showMessage } from 'react-native-flash-message';
import styles from './style';

const HealthProblems = () => {
    const profileData = useSelector(state => state.authReducer.currentUser);
    const [Loading, setLoading] = useState(false);
    const [Problems, setProblems] = useState([
        { name: "Diyabet/İnsülin Direnci", value: "Diyabet/İnsülin Direnci", checked: Object.values(profileData?.healthProblems).includes("Diyabet/İnsülin Direnci") },
        { name: "Yüksek Tansiyon", value: "Yüksek Tansiyon", checked: Object.values(profileData?.healthProblems).includes("Yüksek Tansiyon") },
        { name: "Tiroid", value: "Tiroid", checked: Object.values(profileData?.healthProblems).includes("Tiroid") },
        { name: "Kalp-Damar Hastalıkları", value: "Kalp-Damar Hastalıkları", checked: Object.values(profileData?.healthProblems).includes("Kalp-Damar Hastalıkları") },
        { name: "Hiçbiri", value: "Hiçbiri", checked: Object.values(profileData?.healthProblems).includes("Hiçbiri") }
    ]);

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

    const onSave = async () => {
        var checkedList = Problems.filter(tg => tg.checked);
        if (checkedList.length === 0) {
            showMsg({ message: 'Hata', description: 'En az birini seçmelisiniz', type: 'danger' });
        } else {
            setLoading(true);
            let selectedProblems = [];
            checkedList.forEach((problem) => {
                if (problem.checked === true) {
                    selectedProblems.push(problem.value);
                }
            })
            try {
                await firestore().collection('users').doc(auth().currentUser.email).update({ healthProblems: selectedProblems });
                showMsg({ message: 'Başarılı', description: 'Sağlık sorunları başarıyla kaydedildi', type: 'success' });
            } catch (error) {
                showMsg({ message: 'Hata', description: 'Sağlık sorunları kaydedilirken bir hata oluştu', type: 'danger' });
            }
        }
    }

    return (
        <ImageLayout
            title="Sağlık Sorunları"
            Loading={Loading}
            showBack
            isScrollable={false}
        >

            <View style={{ flex: 1, justifyContent: 'space-between' }}>
                <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                    {Problems.map((item, index) => {
                        return (
                            <Pressable
                                onPress={() => {
                                    const options = Problems;

                                    options.forEach((newitem) => {
                                        if (newitem.checked === false) {
                                            newitem.checked === true
                                        }
                                    })

                                    var tempItem = item;
                                    tempItem.checked = !item.checked;
                                    const tempArr = [...Problems];
                                    setProblems(tempArr);
                                }}
                                key={index}
                                style={{ marginTop: 15, width: '80%', backgroundColor: item.checked ? 'yellow' : null, borderRadius: 18, borderWidth: 1, borderColor: 'yellow', justifyContent: 'center', alignItems: 'center', padding: 15 }}>
                                <Text style={item.checked ? [styles.optionText, { color: '#000' }] : styles.optionText}>{item.name}</Text>
                            </Pressable>
                        )
                    })
                    }
                </View>

                <View style={{ marginHorizontal: 20 }}>
                    <Pressable
                        onPress={onSave}
                        style={styles.bottomButton}>
                        <Text style={styles.buttonText}>Kaydet</Text>
                    </Pressable>
                </View>
            </View>
        </ImageLayout>
    )
}

export default HealthProblems;