import React from 'react';
import { View, StyleSheet } from 'react-native';

import NotificationDropdown from './NotificationDropdown';
import Sidebar from './Sidebar';

import ShopOutLogo from './shopout.svg'
import { TouchableNativeFeedback } from 'react-native-gesture-handler';

const Navbar = (props) => {
    if (props.type == "unlocked") {
        return (
            <View style={Styles.navbar}>
                <View style={Styles.navbarLogo}>
                    <ShopOutLogo width={120} height={60} />
                </View>
                <View style={Styles.navbarLinks}>
                    <NotificationDropdown navigation={props.navigation}/>
                    <TouchableNativeFeedback onPress={() => { props.navigation.navigate("Profile") }}>
                        <Sidebar />
                    </TouchableNativeFeedback>
                </View>
            </View>
        )
    }
    else {
        return (
            <View style={Styles.navbarOnlyLogo}>
                <View style={Styles.navbarLogo}>
                    <ShopOutLogo width={120} height={60} />
                </View>
            </View>
        )
    }
}

const Styles = StyleSheet.create({
    navbar: {
        paddingHorizontal: 20,
        paddingTop: 5,
        height: 70,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    navbarOnlyLogo: {
        paddingHorizontal: 20,
        paddingTop: 5,
        height: 80,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: "#FFF",
    },
    navbarLinks: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    navbarLogo: {
        flex: 4,
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    coloredLogo: {
        color: '#0062FF',
        fontSize: 24
    }
});

export default Navbar;