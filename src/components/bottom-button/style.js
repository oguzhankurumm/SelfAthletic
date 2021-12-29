import { StyleSheet } from "react-native";
import themeColors from "../../styles/colors";
import themeFonts from "../../styles/fonts";

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 60,
        backgroundColor: 'yellow',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12
    },
    buttonContainer: {
        width: '100%',
        paddingHorizontal: 20
    },
    title: {
        fontFamily: themeFonts.boldText,
        justifyContent: 'flex-start',
        fontSize: 16,
        color: themeColors.ultraDark,
        marginRight: 5
    }
})

export default styles;