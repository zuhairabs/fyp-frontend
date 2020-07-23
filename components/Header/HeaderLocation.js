import React, { useContext } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/dist/MaterialIcons'

import { GlobalContext } from '../../providers/GlobalContext'

const Location = () => {
    const { state } = useContext(GlobalContext)

    return (
        <View>
            <View style={Styles.location}>
                <Icon name="location-on" size={16} color='#666' />
                <Text style={{ color: '#666', fontSize: 12 }}>
                    {
                        state.location ? <Text>
                            Long: {state.location.long} Lat: {state.location.lat}
                            {/* {state.location.short} */}
                        </Text>
                            : <Text>
                                Powai, Mumbai
                            </Text>
                    }
                </Text>
            </View>
        </View>
    )
}

const Styles = StyleSheet.create({
    location: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        color: '#666',

        paddingHorizontal: 25,
        marginTop: 2
    }
});

export default Location;