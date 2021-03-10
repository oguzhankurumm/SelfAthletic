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
                color='#FFF'
            />
    )
}

export default SpinnerLoading;
