import React, { useContext } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/dist/MaterialIcons'

import { GlobalContext } from '../../providers/GlobalContext'
import { COLORS, textStyles } from '../../styles/styles'

const Location = () => {
    const { state } = useContext(GlobalContext)

    return (
        <View style={Styles.location}>
            <Icon name="location-on" size={16} color={COLORS.SECONDARY} />
            {
                state.location ?
                    <>
                        <Text
                            style={Styles.text}
                        >
                            Long: {state.location.long}   Lat: {state.location.lat}
                            {/* {state.location.short} */}
                        </Text>
                    </>
                    : <Text
                        style={Styles.text}
                    >
                        Powai, Mumbai
                        </Text>
            }
        </View>
    )
}

const Styles = StyleSheet.create({
    location: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',

        paddingHorizontal: 25,
        marginTop: 2
    },
    text: {
        paddingLeft: 10,
        color: COLORS.SECONDARY,
        ...textStyles.paragraphSmall
    }
});

export default Location;