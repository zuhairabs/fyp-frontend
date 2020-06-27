import React, { useEffect, useState } from 'react'
import { View, Text, ScrollView, StyleSheet, Platform, StatusBar, Dimensions, TextInput } from 'react-native'
import Icon from 'react-native-vector-icons/dist/MaterialIcons'
import AsyncStorage from '@react-native-community/async-storage'

import StatusBarWhite from '../UXComponents/StatusBar'
import StoreCard from '../StoreCard/StoreCard'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'

const DEVICE_HEIGHT = Dimensions.get('window').height;

const SearchFull = (props) => {
    const [results, setResults] = useState([])
    const [query, setQuery] = useState()

    const placeholder = "Where do you want to visit today..."

    const [text, setText] = useState("")
    const [tags, setTags] = useState([]);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [stores, setStores] = useState([]);


    const fullSearch = (query, model, id) => {
        const bootstrapper = async () => {
            let token = await AsyncStorage.getItem("jwt")
            let user = JSON.parse(await AsyncStorage.getItem("user"))
            fetch("https://shopout.herokuapp.com/user/search/full", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    authorization: "Bearer " + token,
                },
                body: JSON.stringify({
                    cred: {
                        phone: user.phone,
                    },
                    query: query,
                    model: model,
                    city: "Mumbai",
                    _id: id,
                }),
            }).then((res) => {
                if (res.status === 200) {
                    res.json().then((data) => {
                        console.log(data)
                        setResults(data.response[0])
                        setQuery(query)
                    });
                }
                else
                    Alert.alert("Something went wrong", res.status.toString())
            });
        }
        bootstrapper();
    }


    const partialSearch = (query) => {
        const bootstrapper = async () => {
            let token = await AsyncStorage.getItem("jwt")
            let user = JSON.parse(await AsyncStorage.getItem("user"))
            fetch("https://shopout.herokuapp.com/user/search/partial", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    authorization: "Bearer " + token,
                },
                body: JSON.stringify({
                    cred: {
                        phone: user.phone,
                    },
                    query: query,
                    city: "Mumbai",
                }),
            }).then((res) => {
                if (res.status === 200) {
                    res.json().then((data) => {
                        if (data.response[3]) setTags(data.response[3]);
                        if (data.response[2]) setCategories(data.response[2]);
                        if (data.response[1]) setBrands(data.response[1]);
                        if (data.response[0]) setStores(data.response[0]);
                    });
                }
                else {
                    console.log(JSON.parse(AsyncStorage.getItem("user").toString()))
                    Alert.alert(res.statusText)
                }
            });
        }
        bootstrapper();
    }


    return (
        <View style={styles.screenContainer}>
            <StatusBarWhite />
            {/* <Search setResults={setResults} setQuery={setQuery} /> */}


            <View style={styles.search}>
                <View style={styles.searchInputFull}>
                    <Icon name="search" size={16} color="#666" />
                    <TextInput
                        style={styles.searchInputText}
                        value={text}
                        autoCapitalize="none"
                        onChangeText={(query) => { setText(query); partialSearch(query); }}
                        autoCompleteType='off'
                        placeholder={placeholder}
                        onBlur={() => { setText(""); setBrands([]); setStores([]); setCategories([]); setTags([]); }}
                        placeholderTextColor="#707070"
                        autoFocus={true}
                    />
                </View>

                {/* DROPDOWN FOR SUGGESTIONS */}
                <ScrollView
                    keyboardDismissMode='on-drag'
                    keyboardShouldPersistTaps='never'
                    style={styles.suggestionDropdown}>
                    {stores.map(result => {
                        if (result.name)
                            return <TouchableWithoutFeedback
                                key={result._id}
                                onPress={() => {
                                    props.navigation.navigate("Store", { store: result._id })
                                }}>
                                <Text
                                    style={styles.suggestionText}
                                >
                                    {result.business.display_name} {result.name}
                                </Text>
                            </TouchableWithoutFeedback>
                    })}
                    {brands.map(result => {
                        if (result.name)
                            return <TouchableWithoutFeedback onPress={() => {
                                fullSearch(result.name, 'brand', result._id)
                            }}
                                key={result._id}

                            >
                                <Text
                                    style={styles.suggestionText}
                                    onPress={() => { }}
                                >
                                    {result.name}
                                </Text>
                            </TouchableWithoutFeedback>
                    })}
                    {categories.map(result => {
                        if (result.name)
                            return <TouchableWithoutFeedback onPress={() => {
                                fullSearch(result.name, 'category', result._id)
                            }}
                                key={result._id}
                            >
                                <Text
                                    style={styles.suggestionText}
                                    onPress={() => { }}
                                >
                                    {result.name}
                                </Text>
                            </TouchableWithoutFeedback>
                    })}
                    {tags.map(result => {
                        if (result.name)
                            return <TouchableWithoutFeedback onPress={() => {
                                fullSearch(result.name, 'tag', result._id)
                            }}
                                key={result._id}
                            >
                                <Text
                                    style={styles.suggestionText}
                                    onPress={() => { }}
                                >
                                    {result.name}
                                </Text>
                            </TouchableWithoutFeedback>
                    })}
                </ScrollView>
            </View>

            <ScrollView
                style={styles.container}
            >
                <View style={styles.searchHeader}>
                    {
                        query
                            ? <Text style={styles.searchHeaderText}>Search results for '{query}'</Text>
                            :
                            <Text style={styles.searchHeaderText}>
                                Your recent searches
                            </Text>
                    }

                </View>
                <View style={styles.searchResult}>
                    {
                        results ?
                            results.map(item => {
                                return <StoreCard key={item._id} store={item} navigation={props.navigation} />
                            })
                            : null
                    }
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    screenContainer: {
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        backgroundColor: "#fff",
        height: "100%",
    },
    searchHeader: {
        paddingHorizontal: 20,
    },
    search: {
        flexDirection: 'column',
        paddingHorizontal: 20,
        paddingVertical: 5,
    },
    searchInputFull: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",

        backgroundColor: '#fff',
        paddingHorizontal: 20,
        marginTop: 20,

        borderColor: '#707070',
        borderWidth: 1,
        borderRadius: 4,
    },
    searchInputText: {
        width: "100%",
        color: '#000',
    },
    suggestionDropdown: {
        position: "absolute",
        width: "100%",
        maxHeight: 0.6 * DEVICE_HEIGHT,

        top: 70,
        left: 20,

        paddingHorizontal: 20,

        backgroundColor: "#fff",
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,

        zIndex: 2,
        elevation: 2,
    },
    suggestionText: {
        marginVertical: 15,
        color: "#666"
    },
    searchHeaderText: {
        fontSize: 12,
        color: "#666"
    },
    searchResult: {
        paddingHorizontal: 20,
        marginTop: 10,
        marginBottom: 50,
    }
})

export default SearchFull