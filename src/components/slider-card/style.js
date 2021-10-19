import { StyleSheet } from "react-native"

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 200,
        borderRadius: 18,
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 18
    },
    linear: {
        position: 'absolute',
        borderRadius: 18,
        width: '100%',
        height: 200
    },
    title: {
        fontFamily: 'SFProDisplay-Bold',
        fontSize: 20,
        color: '#FFF',
        marginBottom: 8
    },
    subtitle: {
        fontFamily: 'SFProDisplay-Medium',
        fontSize: 13,
        color: '#FFF' 
    }
})

export default styles;