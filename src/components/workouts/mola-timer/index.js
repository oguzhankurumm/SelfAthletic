import React from 'react'
import { View, Text, Pressable, Animated } from 'react-native';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import Modal from 'react-native-modal';

const ModalTimer = ({ duration, ShowMolaTimer, onComplete }) => {
    return (
        <Modal style={{ marginTop: 'auto' }}
            animationIn="fadeIn"
            animationOut="fadeOut"
            isVisible={ShowMolaTimer}
            animationInTiming={500}
            animationOutTiming={500}
            backdropOpacity={0.7}
        >
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <CountdownCircleTimer
                    isPlaying={ShowMolaTimer}
                    duration={duration}
                    onComplete={onComplete}
                    colors={[
                        ['green', 0.4],
                        ['yellow', 0.4]
                    ]}
                >
                    {({ remainingTime, animatedColor }) => (
                        <Animated.Text style={{ fontFamily: 'SFProDisplay-Bold', fontSize: 48, color: animatedColor }}>
                            {remainingTime}
                        </Animated.Text>
                    )}
                </CountdownCircleTimer>
                <Pressable
                    onPress={onComplete}
                    style={{ marginTop: 20, backgroundColor: 'yellow', justifyContent: 'center', alignItems: 'center', padding: 10, borderRadius: 8 }}
                >
                    <Text style={{ fontFamily: 'SFProDisplay-Medium', fontSize: 14, color: '#222' }}>
                        Dinlenmeyi Atla
                    </Text>
                </Pressable>
            </View>
        </Modal>
    )
}

export default ModalTimer;