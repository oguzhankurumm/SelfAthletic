import { StyleSheet } from "react-native"
import themeColors from "../../../styles/colors";
import themeFonts from "../../../styles/fonts";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        backgroundColor: themeColors.white,
    },
    cardContainer: {
        marginBottom: 10,
        padding: 20,
        paddingVertical: 15,
        backgroundColor: 'rgba(0,0,0,0.2)',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 'auto',
        width: '100%',
        borderRadius: 18
    },
    bottomButton: {
        position: 'absolute',
        backgroundColor: 'yellow',
        left: 20,
        right: 20,
        bottom: 0,
        padding: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12
    },
    textInput: {
        borderWidth: 1,
        borderColor: 'white',
        textAlign: 'center',
        padding: 10,
        color: themeColors.white,
        borderRadius: 12,
        fontFamily: themeFonts.mediumText,
        fontSize: 14,
        marginRight: 10,
        width: 80
    },
    textStyle: {
        textAlign: 'center',
        fontFamily: themeFonts.boldText,
        fontSize: 16,
        color: themeColors.ultraDark
    },
    nameText: {
        fontFamily: themeFonts.boldText,
        fontSize: 16,
        color: themeColors.white,
        width: '100%'
    },
    typeText: {
        marginTop: 5,
        fontFamily: themeFonts.mediumText,
        fontSize: 14,
        color: themeColors.white
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
        fontFamily: themeFonts.boldText,
        fontSize: 18,
        color: themeColors.white
    },
    iconContainer: {
        marginTop: 5,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    iconText: {
        fontFamily: themeFonts.mediumText,
        marginLeft: 5,
        fontSize: 14,
        color: themeColors.white,
    }
})

export default styles;