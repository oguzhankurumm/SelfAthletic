import { StyleSheet } from "react-native"
import themeColors from '../../styles/colors';
import themeFonts from '../../styles/fonts';

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20
    },
    titleContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20
    },
    titleStyle: {
        fontFamily: themeFonts.boldText,
        justifyContent: 'flex-start',
        fontSize: 22,
        color: themeColors.white
    },
    subTitleStyle: {
        fontFamily: themeFonts.mediumText,
        justifyContent: 'flex-start',
        fontSize: 16,
        color: 'yellow'
    },
    seeAllButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    scrollContainer: {
        width: '100%',
        height: 150,
        marginTop: 20
    }
})

export default styles;