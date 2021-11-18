import { StyleSheet } from "react-native"
import themeColors from "../../../styles/colors";
import themeFonts from "../../../styles/fonts";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
    TabsTextActive: {
        fontFamily: 'SFProDisplay-Bold',
        fontSize: 16,
        paddingVertical: 1,
        color: 'yellow'
    },
    TabsTextDisabled: {
        fontFamily: 'SFProDisplay-Bold',
        fontSize: 16,
        paddingVertical: 1,
        color: 'white'
    },
    nameText: {
        marginTop: 20,
        fontFamily: 'SFProDisplay-Bold',
        fontSize: 18,
        color: '#FFF'
    },
    imageView: {
        borderRadius: 100,
        backgroundColor: 'red',
        height: 120,
        width: 120
    },
    profileView: {
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%'
    },
    iconsContainer: {
        flexDirection: 'column',
        paddingVertical: 20,
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%'
    },
    iconsView: {
        flexDirection: 'row',
        paddingVertical: 20,
        justifyContent: 'space-evenly',
        alignItems: 'center',
        width: '100%'
    },
    iconsText: {
        fontFamily: 'SFProDisplay-Medium',
        fontSize: 13,
        paddingVertical: 1,
        color: '#FFF'
    },
    iconsNumber: {
        marginTop: 10,
        fontFamily: 'SFProDisplay-Bold',
        fontSize: 18,
        color: '#FFF'
    },
    iconsDate: {
        marginTop: 5,
        fontFamily: 'SFProDisplay-Bold',
        fontSize: 12,
        color: '#FFF'
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
    //gecmis
    gecmisContainer: {
        flexDirection: 'column',
        paddingVertical: 20,
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%'
    }
})

export default styles;