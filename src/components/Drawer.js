import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import DrawerItem from './DrawerItem';
import images from 'res/images';
import colors from 'res/colors';

const Drawer = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'space-between' }}>
      <View>
        <Text style={{ color: '#fff', padding: 20, paddingTop: 10, paddingBottom: 14, fontSize: 16, fontWeight: 'bold' }}>ozaferayan</Text>
        <View style={{ backgroundColor: '#222', height: 0.5 }}></View>
        <DrawerItem icon={images.past} text='Arşiv' />
        <DrawerItem icon={images.qr_code} text='Ad Etiketi' />
        <DrawerItem icon={images.bookmark} text='Kaydedilenler' />
        <DrawerItem icon={images.friendship} text='Yakın Arkadaşlar' />
        <DrawerItem icon={images.add_user} text='Yeni İnsanlar Keşfet' />
        <DrawerItem icon={images.facebook} text="Facebook'u aç" />
      </View>
      <View>
        <View style={{ backgroundColor: '#222', height: 0.5 }}></View>
        <DrawerItem icon={images.settings} text="Ayarlar" isInBottom={true} />
      </View>
    </SafeAreaView>
  );
};

export default Drawer;