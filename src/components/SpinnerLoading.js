import React from 'react'
import { View, Dimensions } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';

const { width, height } = Dimensions.get('window');

const SpinnerLoading = (props) => {
    const Loading = props.Loading
    return (
        <Spinner
            visible={Loading}
            size="large"
            color={props.color ? props.color : '#FFF'}
            textContent={props.text ? props.text : null}
            textStyle={props.text ? {
                fontSize: 14,
                fontFamily: 'SFProDisplay-Medium',
                color: 'yellow'
            } : null}
        />
    )
}

export default SpinnerLoading;
