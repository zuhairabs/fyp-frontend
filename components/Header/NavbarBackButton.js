import React from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

import LeftArrow from './left-arrow.svg'
import LeftArrowWhite from './left-arrow-white.svg'

const NavbarBackButton = (props) => {

    return (
        <View style={Styles.navbar}>
            {
                props.color === "white" ?
                    <TouchableWithoutFeedback onPress={() => { props.navigation.goBack() }} style={Styles.navbarLogo}>
                        <LeftArrowWhite width={24} height={60} />
                    </TouchableWithoutFeedback>
                    :
                    <TouchableWithoutFeedback onPress={() => { props.navigation.goBack() }} style={Styles.navbarLogo}>
                        <LeftArrow width={24} height={60} />
                    </TouchableWithoutFeedback>
            }

            {
                props.header ?
                    (
                        <View style={Styles.navbarHeader}>
                            <Text style={Styles.navbarHeaderText}>
                                {props.header}
                            </Text>
                        </View>
                    )
                    : null
            }

        </View>
    )
}

const Styles = StyleSheet.create({
    navbar: {
        height: 70,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: 20,
        backgroundColor: "#ffffff00",
    },
    navbarLinks: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    navbarLogo: {
        flex: 4,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginLeft: Dimensions.get("screen").width / 20,
    },
    navbarHeaderText: {
        marginLeft: Dimensions.get("screen").width / 20,
        fontSize: 20
    },
});

export default NavbarBackButton;