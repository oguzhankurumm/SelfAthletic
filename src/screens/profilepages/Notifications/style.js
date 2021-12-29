import { StyleSheet } from "react-native";
import themeColors from "../../../styles/colors";
import themeFonts from "../../../styles/fonts";

const styles = StyleSheet.create({
    textStyle: {
        fontSize: 16,
        color: themeColors.white,
        fontFamily: themeFonts.mediumText,
        marginBottom: 2,
        marginTop: 20
    }
})

export default styles;