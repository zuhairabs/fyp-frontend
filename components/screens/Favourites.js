import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, StyleSheet, Platform, StatusBar, Dimensions, TextInput, ActivityIndicator, Alert } from 'react-native'
import Icon from 'react-native-vector-icons/dist/MaterialIcons'
import AsyncStorage from '@react-native-community/async-storage'

import StatusBarWhite from '../UXComponents/StatusBar'
import StoreCard from '../StoreCard/StoreCard'
import { TouchableOpacity } from 'react-native-gesture-handler'

const DEVICE_HEIGHT = Dimensions.get('screen').height;
const WINDOW_HEIGHT = Dimensions.get('window').height;

const Favourites = (props) => {
    const [all, setAll] = useState([])
    const [results, setResults] = useState([])
    const [loading, setLoading] = useState(true)
    const [dropdown, setDropdown] = useState(false)
    const [categories, setCategories] = useState([])
    const [current, setCurrent] = useState("all")

    useEffect(() => {
        const bootstrapper = async () => {
            let token = await AsyncStorage.getItem("jwt")
            let user = JSON.parse(await AsyncStorage.getItem("user"))
            fetch("https://shopout.herokuapp.com/user/allfavourites", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    authorization: "Bearer " + token,
                },
                body: JSON.stringify({
                    cred: {
                        phone: user.phone,
                    }
                }),
            }).then((res) => {
                if (res.status === 200) {
                    res.json().then((data) => {
                        setResults(data.response.favouriteStores);
                        setAll(data.response.favouriteStores);
                        setLoading(false)
                        setCurrent("all")
                        let temp = []
                        data.response.favouriteStores.forEach(fav => {
                            if (temp.indexOf(fav.business.category) === -1) temp.push(fav.business.category)
                        })
                        setCategories(temp);
                    });
                }
                else
                    Alert.alert(res.statusText)
            });
        }
        bootstrapper();
    }, [])

    const switchCategory = (cat) => {
        if(cat === "all") setResults(all)
        else{
            let favs = all;
            let temp = []
            favs.forEach(fav => { if (fav.business.category === cat) temp.push(fav) })
            setResults(temp)
        }
    }

    return (
        <View style={styles.screenContainer}>
            <StatusBarWhite />

            <ScrollView
                style={styles.container}
                stickyHeaderIndices={[0]}
            >
                {
                    loading ? <View
                        style={{
                            justifyContent: "center",
                            alignItems: "center",
                            height: WINDOW_HEIGHT - 100,
                            width: "100%"
                        }}>
                        <ActivityIndicator size="large" color="#0062FF" />
                    </View>
                        :
                        <>
                            <View style={styles.headerContainer}>
                                <Text style={{
                                    color: "#666",
                                    fontSize: 15,
                                    paddingHorizontal: 20,
                                    textTransform: "capitalize",
                                }}
                                >
                                    {current}
                                </Text>
                                <TouchableOpacity
                                    style={{ paddingHorizontal: 20, paddingVertical: 10 }}
                                    onPress={() => {
                                        setDropdown(!dropdown);
                                    }}
                                >
                                    {
                                        dropdown ? <Icon name="arrow-drop-up" size={20} color="#000" />
                                            : <Icon name="arrow-drop-down" size={20} color="#000" />
                                    }

                                </TouchableOpacity>
                                {
                                    dropdown ? <ScrollView style={styles.dropdown}>
                                        <TouchableOpacity
                                            style={styles.dropdownTextBox}
                                            onPress={() => {
                                                setDropdown(false)
                                                setCurrent("all")
                                                switchCategory("all")
                                            }}
                                        >
                                            <Text style={styles.dropdownText}>All</Text>
                                        </TouchableOpacity>
                                        {
                                            categories.map(cat => {
                                                return <TouchableOpacity
                                                    key={cat}
                                                    style={styles.dropdownTextBox}
                                                    onPress={() => {
                                                        setDropdown(false)
                                                        setCurrent(cat)
                                                        switchCategory(cat)
                                                    }}
                                                >
                                                    <Text style={styles.dropdownText}>{cat}</Text>
                                                </TouchableOpacity>
                                            })
                                        }
                                    </ScrollView> : null
                                }
                            </View>

                            <View style={{ height: DEVICE_HEIGHT }}>
                                {
                                    results ?
                                        results.map(item => {
                                            return <StoreCard key={item._id} store={item} navigation={props.navigation} />
                                        })
                                        : <Text>No favourites added yet!</Text>

                                }
                            </View>

                        </>
                }
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    screenContainer: {
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        backgroundColor: "#fff",
    },
    container: {
        marginBottom: 50 + DEVICE_HEIGHT - WINDOW_HEIGHT,
        paddingHorizontal: 20,
        height: DEVICE_HEIGHT,
    },
    dropdown: {
        position: "absolute",
        zIndex: 5,
        maxHeight: DEVICE_HEIGHT / 2.8,
        backgroundColor: "#FFF",
        borderRadius: 6,
        borderWidth: 1,
        borderColor: "#CAD0D8",
        width: "100%",
        top: 50,
    },
    headerContainer: {
        borderWidth: 1,
        borderColor: "#CAD0D8",
        borderRadius: 6,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
        zIndex: 5,
    },
    dropdownTextBox: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        // borderBottomWidth: 1,
        // borderBottomColor: "#CAD0D8"
    },
    dropdownText: {
        textTransform: "capitalize",
        color: "#666",
        fontSize: 15,
    },
})

export default Favourites