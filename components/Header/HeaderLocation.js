import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TextInput, Alert } from 'react-native'
// import Geolocation from '@react-native-community/geolocation';
import Icon from 'react-native-vector-icons/dist/MaterialIcons'

const Location = (props) => {
    return (
        <View>
            <View style={Styles.location}>
                <Icon name="location-on" size={16} color='#666' />
                <Text style={{ color: '#666', fontSize: 12 }}>
                    {
                        props.location.short ? <Text>
                            {/* Latitude: {props.location.lat}
                            Longitude: {props.location.long} */}
                            {props.location.short}
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