import React, { useContext, useEffect, useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/dist/MaterialIcons'

import { GlobalContext } from '../../providers/GlobalContext'
import { COLORS, textStyles } from '../../styles/styles'

const access_token = 'pk.eyJ1Ijoic3VyeWFuc2hzdWdhbmRoaSIsImEiOiJja2Q3NHp5ZTkwNmY0MnJzODNydG11d3E0In0.RFX3G-QNk_vtmUedahRV_A'
const endpoint = "mapbox.places"
const maps_uri = 'https://api.mapbox.com/geocoding/v5'

const Location = () => {
    const { state } = useContext(GlobalContext)
    const [location, setLocation] = useState("")

    const getLocation = async () => {
        return new Promise((resolve, reject) => {
            const long = state.location.long, lat = state.location.lat
            fetch(`${maps_uri}/${endpoint}/${long},${lat}.json?access_token=${access_token}`, {
                "method": "GET",
                "port": null,
                "async": true,
                "crossDomain": true,
                "headers": {
                    "content-type": "application/x-www-form-urlencoded"
                },
                "data": {}
            })
                .then(res => {
                    if (res.status === 200)
                        res.json()
                            .then(data => {
                                // if(data.features && data.features.length > 0)
                                // let area = data.features[0].text, city = data.features[1].text
                                let area = "", city = ""
                                if (data.features && data.features[0]) area = data.features[0].text
                                if (data.features && data.features[1]) city = data.features[1].text
                                resolve({ area, city })
                            })
                    else reject(res.statusText)
                })
        })
    }

    useEffect(() => {
        getLocation()
            .then(({ area, city }) => {
                setLocation(`${area}, ${city}`)
            })
            .catch(e => {
                console.log(e)
            })
    }, [])

    return (
        <View style={Styles.location}>
            <Icon name="location-on" size={16} color={COLORS.SECONDARY} />
            {
                location.length > 0
                    ? <Text style={Styles.text}>
                        {location}
                    </Text>
                    : <Text style={Styles.text} >
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