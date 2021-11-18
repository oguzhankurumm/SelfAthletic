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
    textStyle: {
        textAlign: 'center',
        fontFamily: themeFonts.mediumText,
        fontSize: 17,
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
    headerBoxStyle: {
        flexDirection: 'row',
        alignSelf: 'center',
        width: '100%',
        borderRadius: 8,
        backgroundColor: 'rgba(255, 255, 0, 0.05)',
        padding: 20,
        marginTop: 0,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    bottomTitle: {
        fontFamily: themeFonts.boldText,
        fontSize: 14,
        color: themeColors.white
    },
    bottomSubtitle: {
        fontFamily: themeFonts.mediumText,
        fontSize: 12,
        color: themeColors.lightGray
    },
    countdownText: {
        fontFamily: themeFonts.boldText,
        fontSize: 32,
        color: themeColors.white
    },
    renderContainer: {
        height: '100%',
        marginTop: 20,
    },
    boxStyle: {
        flexDirection: 'row',
        marginTop: 20,
        padding: 20,
        backgroundColor: 'rgba(255, 255, 0, 0.05)',
        borderRadius: 8,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    boxTitle: {
        textAlign: 'left',
        fontFamily: themeFonts.boldText,
        fontSize: 15,
        color: themeColors.yellow
    },
    boxSubtitle: {
        textAlign: 'left',
        fontFamily: themeFonts.mediumText,
        fontSize: 13,
        color: themeColors.yellow
    },
    boxLeft: {
        justifyContent: 'center',
        alignItems: 'flex-start'
    },
    boxRight: {
        justifyContent: 'center',
        alignItems: 'flex-end'
    },
    bottomBox: {
        width: '100%',
        flexDirection: 'row',
        padding: 10,
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    pauseButton: {
        backgroundColor: themeColors.yellow,
        borderRadius: 50,
        padding: 10
    },
    arrowButton: {
        padding: 10
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
    },
    popupText: {
        fontFamily: themeFonts.mediumText,
        fontSize: 15,
        color: themeColors.white,
    }
})

export default styles;