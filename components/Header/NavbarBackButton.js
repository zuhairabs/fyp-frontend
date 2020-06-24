import React from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

import LeftArrow from './left-arrow.svg'
import MainBackground from '../UXComponents/MainBackground'

const NavbarBackButton = (props) => {

    return (
        <View style={Styles.navbar}>
            <TouchableWithoutFeedback onPress={() => { props.navigation.goBack() }} style={Styles.navbarLogo}>
                <LeftArrow width={24} height={60} />
            </TouchableWithoutFeedback>
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
        borderBottomWidth: 1,
        borderColor: "#6666666F"
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