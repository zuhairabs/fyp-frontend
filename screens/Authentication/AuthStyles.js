import { StyleSheet, Dimensions, StatusBar } from 'react-native'
import { COLORS, textStyles } from '../../styles/styles'

export default StyleSheet.create({
    bottomModal: {
        justifyContent: "center",
        alignItems: "center",
        height: 200,
    },
    screenContainer: {
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        height: Dimensions.get('screen').height,
        backgroundColor: COLORS.WHITE
    },
    contentContainer: {
        justifyContent: "flex-start",
        alignItems: "center"
    },
    tabNavigation: {
        marginTop: 70,
        marginBottom: 20,
        paddingHorizontal: 20,
        marginLeft: 20,
        width: "100%",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
    },
    tabNavigationObject: {
        borderBottomWidth: 1,
        borderColor: COLORS.PRIMARY,
    },
    tabNavigationObjectSelected: {
        borderBottomWidth: 3,
        borderColor: "#0062FF",
    },
    tabNavigationText: {
        borderBottomWidth: 1,
        color: COLORS.PRIMARY,
        borderColor: COLORS.TRANSPARENT,
        paddingBottom: 10,
        paddingHorizontal: 15,
    },
    form: {
        flex: 2,
        width: "100%",
        paddingHorizontal: 20,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20
    },
    textInput: {
        width: "100%",
        borderWidth: 1,
        borderColor: COLORS.BORDER_LIGHT,
        padding: 10,
        marginVertical: 10,
        borderRadius: 5,
        backgroundColor: COLORS.WHITE,
    },
    buttonArea: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        marginTop: 100,
    },
    forgotPassword: {
        marginVertical: 20,
        justifyContent: "center",
        alignItems: "center"
    },
    forgotPasswordText: {
        color: COLORS.PRIMARY,
        ...textStyles.paragraphSmall
    },
    terms: {
        marginTop: 50,
        marginBottom: 160,
        paddingHorizontal: 45,
    },
    termsText: {
        textAlign: "center",
        color: COLORS.SECONDARY,
        ...textStyles.paragraphSmall
    },
    userPhotoContainer: {
        height: 120,
        width: 120,
        borderRadius: 120 / 2,
        elevation: 3,
        padding: 20,
        marginVertical: 20,
        backgroundColor: "#FFF",
        justifyContent: "center",
        alignItems: "center"
    },
    photo: {
        height: 100,
        width: 100,
        borderRadius: 100 / 2,
        backgroundColor: "#0062FF",
        justifyContent: "center",
        alignItems: "center"
    },
    avatar: {
        height: 100,
        width: 100,
        borderRadius: 50,
    },
    cameraContainer: {
        height: 30,
        width: 30,
        borderRadius: 30 / 2,
        backgroundColor: "#fff",
        elevation: 2,
        position: "absolute",
        bottom: -8,
        right: 8,
        justifyContent: "center",
        alignItems: "center",
    }
})