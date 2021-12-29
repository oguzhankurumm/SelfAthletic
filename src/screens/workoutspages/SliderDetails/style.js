import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
        paddingHorizontal: 20
    },
    image: {
        width: '100%',
        minHeight: 200,
        height: 'auto',
        borderRadius: 18
    },
    socialButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#202026',
        padding: 10,
        borderRadius: 12
    },
    socialText: {
        marginLeft: 10,
        fontFamily: 'SFProDisplay-Bold',
        justifyContent: 'flex-start',
        fontSize: 14,
        color: '#FFF'
    },
    linearGradient: {
        position: 'absolute',
        borderRadius: 18,
        width: '100%',
        minHeight: 200,
        left: 20,
        height: 'auto'
    },
    title: {
        fontFamily: 'SFProDisplay-Bold',
        fontSize: 20,
        color: '#FFF',
        marginBottom: 8
    },
    description: {
        fontFamily: 'SFProDisplay-Medium',
        fontSize: 13,
        color: '#FFF'
    }
})

export default styles;