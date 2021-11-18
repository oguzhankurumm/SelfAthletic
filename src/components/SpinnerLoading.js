import React from 'react'
import { Dimensions, StyleSheet, View } from 'react-native';
import Modal from 'react-native-modal';
import LottieView from "lottie-react-native";

const { width, height } = Dimensions.get("window");

const SpinnerLoading = (props) => {
    const Loading = props.Loading;

    return (
        <Modal
            isVisible={Loading}
            useNativeDriverForBackdrop
            style={styles.modalStyle}
            animationIn="fadeIn"
            animationOut="fadeOut"
            backdropOpacity={0.5}
        >
            <View style={styles.container}>
                <View style={{
                    height: 100,
                    width: 100,
                    backgroundColor: '#3D3D3D',
                    borderRadius: 25,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <LottieView
                        style={{ height: 75, width: 75 }}
                        source={require("../assets/animations/loading.json")}
                        autoPlay
                        speed={1}
                        loop={true}
                    />
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalStyle: {
        justifyContent: 'center',
        margin: 0,
        width,
        height,
    }
})

export default SpinnerLoading;