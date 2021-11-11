import { StyleSheet } from "react-native"
import themeColors from "../../../styles/colors";
import themeFonts from "../../../styles/fonts";

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
        fontFamily: themeFonts.mediumText,
        fontSize: 18,
        color: themeColors.white
    },
    circleHeaderText: {
        fontFamily: themeFonts.mediumText,
        fontSize: 28,
        color: themeColors.white
    },
    circleSubText: {
        marginTop: 15,
        textAlign: 'center',
        fontFamily: themeFonts.mediumText,
        fontSize: 12,
        color: themeColors.white
    },
    targetHeader: {
        textAlign: 'center',
        fontFamily: themeFonts.mediumText,
        fontSize: 16,
        color: themeColors.white,
        marginBottom: 5
    },
    targetText: {
        marginTop: 10,
        textAlign: 'center',
        fontFamily: themeFonts.mediumText,
        fontSize: 16,
        color: themeColors.white
    },
    targetSubText: {
        marginTop: 5,
        textAlign: 'center',
        fontFamily: themeFonts.mediumText,
        fontSize: 12,
        color: themeColors.white
    },
    startButton: {
        width: '100%',
        backgroundColor: 'yellow',
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
        marginBottom: 10
    },
    startButtonText: {
        textAlign: 'center',
        fontFamily: themeFonts.mediumText,
        fontSize: 16,
        color: themeColors.ultraDark,
    }
})

export default styles;