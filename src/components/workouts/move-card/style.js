import { StyleSheet } from "react-native"

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        height: 'auto',
        marginBottom: 18
    },
    image: {
        width: 70,
        height: 60,
        borderRadius: 8
    },
    headerTitle: {
        fontFamily: 'SFProDisplay-Bold',
        fontSize: 16,
        color: '#FFF',
        marginTop: 5
    },
    subTitle: {
        fontFamily: 'SFProDisplay-Medium',
        fontSize: 14,
        color: 'yellow'
    },
    moveText: {
        fontFamily: 'SFProDisplay-Medium',
        fontSize: 13,
        color: '#FFF',
        marginTop: 5
    }
})

export default styles;