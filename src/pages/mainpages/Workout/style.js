import { StyleSheet } from "react-native"


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
    header: {
        width: '100%',
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20
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
})

export default styles;