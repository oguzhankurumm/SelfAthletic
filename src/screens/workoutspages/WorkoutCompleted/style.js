import { StyleSheet } from "react-native"
import themeColors from "../../../styles/colors";
import themeFonts from "../../../styles/fonts";

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
        bottom: 60
    },
    lottieView: {
        height: 250,
        alignSelf: "center",
        marginBottom: 10
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
    headerText: {
        fontFamily: themeFonts.boldText,
        fontSize: 24,
        color: themeColors.yellow,
        textAlign: 'center'
    },
    subText: {
        marginTop: 10,
        fontFamily: themeFonts.mediumText,
        fontSize: 14,
        color: themeColors.yellow,
        textAlign: 'center'
    },
    textStyle: {
        textAlign: 'center',
        fontFamily: themeFonts.mediumText,
        fontSize: 16,
        color: themeColors.ultraDark
    },
})

export default styles;