import React from 'react'
import { StyleSheet, Alert } from 'react-native'
import { SliderBox } from 'react-native-image-slider-box';

const Slider = () => {

    const images = [
        'https://placeimg.com/640/640/nature',
        'https://placeimg.com/640/640/people',
        'https://placeimg.com/640/640/animals',
        'https://placeimg.com/640/640/beer',
    ];

    return (
        <SliderBox
            onCurrentImagePressed={(index) => Alert.alert(String(index))}
            images={images}
            sliderBoxHeight={200}
            dotColor="#FFF"
            inactiveDotColor="#90A4AE"
            autoplay
            circleLoop
        />
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000'
    }
})

export default Slider;