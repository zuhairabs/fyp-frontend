import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, ScrollView, View, ActivityIndicator } from 'react-native';

import CardSmall from './CardSmall'

const CardScrollSmall = (props) => {

    const [stores, setStores] = useState(props.stores)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (props.url) {
            const getUserFromStorage = async () => {
                const user = JSON.parse(await AsyncStorage.getItem("user"))
                const token = await AsyncStorage.getItem("jwt")
                return { user, token }
            }
            getUserFromStorage()
                .then(({ user, token }) => {
                    const requestOptions = {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": "Bearer " + token
                        },
                        body: JSON.stringify({
                            "cred": {
                                "phone": user.phone
                            },
                            "city": "Mumbai"
                        })
                    }
                    try {
                        fetch(`https://shopout.herokuapp.com/user/category/${url}`, requestOptions)
                            .then(res => {
                                if (res.status === 200) {
                                    res.json().then(data => {
                                        setDataNewStores(data.response)
                                        setLoading(false);
                                    })
                                }
                                else {
                                    setLoading(false);
                                    console.log(res.statusText)
                                }
                            })
                    }
                    catch (e) {
                        console.log(e)
                    }
                })

        }
        else {
            setLoading(false)
        }

    }, [props.stores])

    return (
        <View style={styles.container}>
            {
                loading ?
                    <ActivityIndicator size="large" color="#0062FF" />
                    : (
                        <ScrollView
                            horizontal
                        // showsHorizontalScrollIndicator={false}
                        >
                            {
                                stores.map(store => {
                                    return <CardSmall key={store._id} store={store} navigation={props.navigation} />
                                })
                            }
                        </ScrollView>
                    )
            }

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
        paddingLeft: 20,
        height: 320,
        width: "100%",
        justifyContent: "center",
        alignItems: "center"
    }
});

export default CardScrollSmall;