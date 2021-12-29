import { StyleSheet } from "react-native";
import themeColors from '../../../styles/colors';
import themeFonts from '../../../styles/fonts';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
    headerText: {
        fontFamily: themeFonts.mediumText,
        fontSize: 18,
        color: themeColors.white
    }
})

export default styles;