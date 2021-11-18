import React, { useState } from 'react'
import { View } from 'react-native'
import { auth } from '../../../config/config';
import { SCLAlert, SCLAlertButton } from 'react-native-scl-alert';
import SettingsCard from '../../../components/profile/settings-card';
import ImageLayout from '../../../components/image-layout';
import { showMessage } from 'react-native-flash-message';

const Settings = ({ navigation }) => {
    const [ShowWarning, setShowWarning] = useState(false);

    const Logout = async () => {
        setShowWarning(false);
        try {
            await auth().signOut()
            showMessage({
                message: "Başarılı",
                description: 'Hesabınızdan çıkış yaptınız.',
                type: "success",
                icon: "success",
                hideStatusBar: true
            });
        } catch (error) {
            showMessage({
                message: "Hata",
                description: 'Çıkış yapılamadı',
                type: "danger",
                icon: "danger",
                hideStatusBar: true
            });
        }
    }

    return (
        <ImageLayout
            title="Ayarlar"
            Loading={false}
            showBack
            isScrollable={false}
        >
            <SCLAlert
                theme="warning"
                show={ShowWarning}
                title="Çıkış Yap"
                subtitle="Hesabınızdan çıkılsın mı?"
            >
                <SCLAlertButton
                    theme="warning"
                    onPress={Logout}>Çıkış Yap</SCLAlertButton>
                <SCLAlertButton theme="default" onPress={() => setShowWarning(false)}>Vazgeç</SCLAlertButton>
            </SCLAlert>

            <View style={{ paddingHorizontal: 20 }}>
                <SettingsCard title="Kişisel Bilgiler" icon="keyboard-arrow-right" onPress={() => navigation.navigate('PersonalSettings')} />
                <SettingsCard title="Antrenman Günleri" icon="keyboard-arrow-right" onPress={() => navigation.navigate('WorkoutDays')} />
                <SettingsCard title="Hedef Ayarları" icon="keyboard-arrow-right" onPress={() => navigation.navigate('TargetSettings')} />
                <SettingsCard title="Sağlık Sorunları" icon="keyboard-arrow-right" onPress={() => navigation.navigate('HealthProblems')} />
                <SettingsCard title="Eklem Ağrıları" icon="keyboard-arrow-right" onPress={() => navigation.navigate('CronicProblems')} />
                <SettingsCard title="Çıkış Yap" icon="lock-outline" onPress={() => setShowWarning(true)} />
            </View>
        </ImageLayout>

    )
}

export default Settings
