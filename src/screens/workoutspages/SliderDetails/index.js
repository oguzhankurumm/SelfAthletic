import React, { useState, useEffect } from 'react'
import { View, Text, Image, TouchableOpacity, Linking } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import { useSelector } from 'react-redux';
import styles from './style';
import ImageLayout from '../../../components/image-layout';

const SliderDetails = props => {
    const profileData = useSelector(state => state.authReducer.currentUser);

    const [Loading, setLoading] = useState(true);
    const [Details, setDetails] = useState(props.route.params.item);

    useEffect(() => {
        if (Details.length !== 0) {
            setLoading(false);
        } else {
            setLoading(true);
        }
    }, [])

    const SocialCard = ({ url, icon }) => (
        <TouchableOpacity onPress={() => {
            Linking.canOpenURL(url).then(supported => {
                if (supported) {
                    Linking.openURL(url);
                } else {
                    console.log("Don't know how to open URI: " + url);
                }
            });
        }} style={styles.socialButton}>
            <Icon name={icon} color="#FFF" size={22} />
            <Text style={styles.socialText}>Takip Et</Text>
        </TouchableOpacity>
    )

    return (
        <ImageLayout
            title="Detaylar"
            Loading={Loading}
            showBack
            isScrollable={true}
        >
            {!Loading &&
                <View style={styles.container}>
                    <Image
                        resizeMode="cover"
                        source={{ uri: Details.image }}
                        style={styles.image}
                    />

                    <LinearGradient
                        start={{ x: 1, y: 1 }}
                        end={{ x: 1, y: 1 }}
                        colors={['rgba(0,0,0,0.6)', 'transparent']}
                        style={styles.linearGradient}
                    />

                    <View style={{ position: 'absolute', top: 15, left: 10, paddingHorizontal: 20 }}>
                        <Text style={styles.title}>{Details.title}</Text>
                    </View>
                    <View style={{ marginTop: 20 }}>
                        <Text style={styles.description}>{Details.description}</Text>
                    </View>

                    {Details.showSocials === true &&
                        <View style={{ flexDirection: 'row', width: '100%', marginTop: 20, justifyContent: 'space-between' }}>
                            <SocialCard url='https://www.instagram.com/selfathletic/' icon='social-instagram' />
                            <SocialCard url='https://www.twitter.com/selfathletic/' icon='social-twitter' />
                            <SocialCard url='https://www.facebook.com/selfathletic/' icon='social-facebook' />
                        </View>
                    }
                </View>
            }
        </ImageLayout>
    )
}


export default SliderDetails;