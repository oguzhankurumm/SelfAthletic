import { StyleSheet } from "react-native"

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        height: 'auto',
        marginVertical: 9
    },
    image: {
        width: 50,
        height: 50,
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