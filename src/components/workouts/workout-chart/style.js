import { StyleSheet } from "react-native"

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'baseline',
        width: '100%'
    },
    targetHeader: {
        textAlign: 'center',
        fontFamily: 'SFProDisplay-Medium',
        fontSize: 16,
        color: '#FFF',
        marginBottom: 5
    },
    targetText: {
        marginTop: 10,
        textAlign: 'center',
        fontFamily: 'SFProDisplay-Medium',
        fontSize: 16,
        color: '#FFF'
    },
    targetSubText: {
        marginTop: 5,
        textAlign: 'center',
        fontFamily: 'SFProDisplay-Medium',
        fontSize: 12,
        color: '#FFF'
    },
    headerText: {
        fontFamily: 'SFProDisplay-Medium',
        fontSize: 18,
        color: '#FFF'
    },
    circleHeaderText: {
        fontFamily: 'SFProDisplay-Medium',
        fontSize: 28,
        color: '#FFF'
    },
    circleSubText: {
        marginTop: 15,
        textAlign: 'center',
        fontFamily: 'SFProDisplay-Medium',
        fontSize: 12,
        color: '#FFF'
    },
})

export default styles;