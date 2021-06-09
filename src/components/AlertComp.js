import React, { useState, useEffect } from 'react'
import { SCLAlert, SCLAlertButton } from 'react-native-scl-alert';

const AlertComp = props => {
    const [ShowAlert, setShowAlert] = useState(props.ShowAlert);

    useEffect(() => {
        setShowAlert(ShowAlert);
    }, [ShowAlert])

    return (
        <SCLAlert
            theme={props.Theme}
            show={ShowAlert}
            title={props.Title}
            subtitle={props.subTitle}
        >
            <SCLAlertButton theme="warning" onPress={props.onPress1}>{props.onPress2Text}</SCLAlertButton>
            <SCLAlertButton theme="default" onPress={props.onPress2}>{props.onPress2Text}</SCLAlertButton>
        </SCLAlert>
    )
}

export default AlertComp;
