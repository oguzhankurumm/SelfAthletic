import { StyleSheet } from "react-native"

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        height: 250,
        padding: 20
    },
    linear: {
        position: 'absolute',
        borderRadius: 12,
        width: '100%',
        height: 250
    },
    viewContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
    },
    iconContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10
    },
    bannerTitle: {
        fontFamily: 'SFProDisplay-Medium',
        fontSize: 12,
        textAlign: 'justify',
        color: '#FFF',
    },
    iconText: {
        fontFamily: 'SFProDisplay-Medium',
        fontSize: 13,
        color: '#FFF',
        marginLeft: 5
    },
    bottomIconText: {
        fontFamily: 'SFProDisplay-Medium',
        fontSize: 11,
        color: '#FFF',
        marginLeft: 5
    }
})

export default styles;