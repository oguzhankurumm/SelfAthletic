import { StyleSheet } from "react-native"
import themeColors from "../../../styles/colors";
import themeFonts from "../../../styles/fonts";

const styles = StyleSheet.create({
    container: {
        height: 'auto',
        width: '100%',
        borderRadius: 18,
        marginTop: 20
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
    description: {
        fontFamily: 'SFProDisplay-Medium',
        fontSize: 13,
        color: '#FFF'
    },
    bottomContainer: {
        flexDirection: 'row',
        position: 'absolute',
        width: '100%',
        bottom: 15,
        paddingHorizontal: 15,
        justifyContent: 'space-between'
    },
    leftContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10
    },
    rightContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    point: {
        fontFamily: 'SFProDisplay-Medium',
        fontSize: 13,
        color: '#FFF',
        marginLeft: 5
    },
    calorie: {
        fontFamily: 'SFProDisplay-Medium',
        fontSize: 14,
        color: '#FFF',
        marginLeft: 5
    }
})

export default styles;