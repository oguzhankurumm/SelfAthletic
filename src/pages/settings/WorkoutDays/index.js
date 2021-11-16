import React, { useState, useEffect } from 'react'
import { View, Text, Pressable } from 'react-native'
import ImageLayout from '../../../components/image-layout';
import { useSelector } from 'react-redux';
import { auth, firestore } from '../../../config/config';
import { showMessage } from 'react-native-flash-message';
import styles from './style';

const WorkoutDays = () => {
    const profileData = useSelector(state => state.authReducer.currentUser);
    const [Loading, setLoading] = useState(false);
    const [Days, setDays] = useState([
        { name: 'Pazar', value: 0, checked: false },
        { name: 'Pazartesi', value: 1, checked: false },
        { name: 'Salı', value: 2, checked: false },
        { name: 'Çarşamba', value: 3, checked: false },
        { name: 'Perşembe', value: 4, checked: false },
        { name: 'Cuma', value: 5, checked: false },
        { name: 'Cumartesi', value: 6, checked: false },
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
        var checkedList = Days.filter(tg => tg.checked);
        if (checkedList.length === 0) {
            showMsg({ message: 'Hata', description: 'En az bir gün seçmelisiniz', type: 'danger' });
        } else {
            setLoading(true);
            let selectedDays = [];
            checkedList.forEach((day) => {
                if (day.checked === true) {
                    selectedDays.push(day.value);
                }
            })
            try {
                await firestore().collection('users').doc(auth().currentUser.email).update({ days: selectedDays });
                showMsg({ message: 'Başarılı', description: 'Günler başarıyla kaydedildi', type: 'success' });
            } catch (error) {
                showMsg({ message: 'Hata', description: 'Günler kaydedilirken bir hata oluştu', type: 'danger' });
            }
        }
    }


    const checkValues = () => {
        const currentDays = profileData?.days;

        if (currentDays !== undefined) {
            const newValue = Days.map(checkbox => {
                if (checkbox.value === currentDays[0] || checkbox.value === currentDays[1] || checkbox.value === currentDays[2] || checkbox.value === currentDays[3] || checkbox.value === currentDays[4] || checkbox.value === currentDays[5] || checkbox.value === currentDays[6]) {
                    const item = {
                        ...checkbox,
                        checked: !checkbox.checked,
                    }
                    return item
                }
                return checkbox
            })
            setDays(newValue);
        }
    }

    useEffect(() => {
        checkValues();
    }, [])

    return (
        <ImageLayout
            title="Antrenman Günleri"
            Loading={Loading}
            showBack
            isScrollable={false}
        >

            <View style={{ flex: 1, justifyContent: 'space-between' }}>
                <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                    {Days.map((item, index) => {
                        return (
                            <Pressable
                                onPress={() => {
                                    const options = Days;

                                    options.forEach((newitem) => {
                                        if (newitem.checked === false) {
                                            newitem.checked === true
                                        }
                                    })

                                    var tempItem = item;
                                    tempItem.checked = !item.checked;
                                    const tempArr = [...Days];
                                    setDays(tempArr);
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

export default WorkoutDays;