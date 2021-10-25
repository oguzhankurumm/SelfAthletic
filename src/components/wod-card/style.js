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
    },
    scrollCardContainer: {
        height: 'auto',
        width: 250,
        marginRight: 15,
        borderRadius: 18
    },
    scrollImage: {
        width: '100%',
        height: 150,
        borderRadius: 18
    },
    linear: {
        position: 'absolute',
        borderRadius: 18,
        width: '100%',
        height: 150
    },
    itemContainer: {
        flexDirection: 'row',
        width: '100%',
        position: 'absolute',
        paddingHorizontal: 20,
        justifyContent: 'space-between',
        bottom: 15
    },
    itemSubContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10
    },
    itemTitle: {
        fontFamily: themeFonts.boldText,
        fontSize: 20,
        color: themeColors.white,
        marginBottom: 8
    },
    pointText: {
        fontFamily: themeFonts.mediumText,
        fontSize: 13,
        color: themeColors.white,
        marginLeft: 5
    },
    caloriesText: {
        fontFamily: themeFonts.mediumText,
        fontSize: 14,
        color: themeColors.white,
        marginLeft: 5
    }
})

export default styles;