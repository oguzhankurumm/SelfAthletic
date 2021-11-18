import { StyleSheet } from "react-native"

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        width: '100%',
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20
    },
    bottomButton: {
        width: '100%',
        padding: 20,
        borderRadius: 8,
        backgroundColor: 'yellow',
        justifyContent: 'center',
        alignItems: 'center'
    },
    bottom50Container: {
        marginHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    bottomButton50: {
        width: '48%',
        padding: 20,
        borderRadius: 8,
        backgroundColor: 'yellow',
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText: {
        fontFamily: 'SFProDisplay-Bold',
        justifyContent: 'flex-start',
        fontSize: 16,
        color: '#000'
    },
    optionText: {
        textAlign: 'center',
        fontFamily: 'SFProDisplay-Medium',
        fontSize: 16,
        color: '#FFF'
    }
})

export default styles;