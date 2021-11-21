import React, { useState } from 'react'
import { View, Text, Pressable } from 'react-native'
import ImageLayout from '../../../components/image-layout';
import { useSelector } from 'react-redux';
import { auth, firestore } from '../../../config/config';
import { showMessage } from 'react-native-flash-message';
import styles from './style';

const CronicProblems = () => {
    const profileData = useSelector(state => state.authReducer.currentUser);
    const [Loading, setLoading] = useState(false);
    const [Problems, setProblems] = useState([
        { name: "Ayak Bileği", value: "Ayak Bileği", checked: Object.values(profileData?.cronicProblems).includes("Ayak Bileği") },
        { name: "Diz", value: "Diz", checked: Object.values(profileData?.cronicProblems).includes("Diz") },
        { name: "Kalça", value: "Kalça", checked: Object.values(profileData?.cronicProblems).includes("Kalça") },
        { name: "Bel", value: "Bel", checked: Object.values(profileData?.cronicProblems).includes("Bel") },
        { name: "Omuz / Boyun", value: "Omuz / Boyun", checked: Object.values(profileData?.cronicProblems).includes("Omuz / Boyun") },
        { name: "Hiçbiri", value: "Hiçbiri", checked: Object.values(profileData?.cronicProblems).includes("Hiçbiri") }
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
                await firestore().collection('users').doc(auth().currentUser.email).update({ cronicProblems: selectedProblems });
                showMsg({ message: 'Başarılı', description: 'Eklem ağrıları başarıyla kaydedildi', type: 'success' });
            } catch (error) {
                showMsg({ message: 'Hata', description: 'Eklem ağrıları kaydedilirken bir hata oluştu', type: 'danger' });
            }
        }
    }

    return (
        <ImageLayout
            title="Eklem Ağrıları"
            Loading={Loading}
            showBack
            isScrollable={false}
        >

            <View style={styles.container}>
                <View style={styles.subcontainer}>
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
                                style={{ marginTop: 15, width: '90%', backgroundColor: item.checked ? 'yellow' : null, borderRadius: 18, borderWidth: 1, borderColor: 'yellow', justifyContent: 'center', alignItems: 'center', padding: 15 }}>
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

export default CronicProblems;