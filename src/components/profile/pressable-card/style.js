import { StyleSheet } from "react-native"
import themeColors from "../../../styles/colors";
import themeFonts from "../../../styles/fonts";

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: 200,
        padding: 20
    },
    imageContainer: {
        width: '100%',
        marginTop: 10
    },
    linear: {
        position: 'absolute',
        borderRadius: 12,
        width: '100%',
        height: 200
    },
    iconText: {
        fontFamily: themeFonts.boldText,
        fontSize: 16,
        textAlign: 'center',
        color: themeColors.yellow,
        marginRight: 10
    }
})

export default styles;