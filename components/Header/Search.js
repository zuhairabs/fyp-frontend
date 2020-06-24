import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TextInput, Alert, Dimensions, AsyncStorage } from 'react-native'
import Icon from 'react-native-vector-icons/dist/MaterialIcons'

import { ScrollView, TouchableWithoutFeedback } from 'react-native-gesture-handler';

const DEVICE_HEIGHT = Dimensions.get('window').height;

const textInputRef = React.createRef();

const Search = (props) => {
    const placeholder = "Where do you want to visit..."

    const [text, setText] = useState("")
    const [tags, setTags] = useState([]);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [stores, setStores] = useState([]);

    // const searchBox = React.createRef()

    // useEffect(() => {
    //     if (searchBox.current && props.autoFocus)
    //         searchBox.current.focus()
    // }, [props.autoFocus, searchBox])

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
                        props.setResults(data.response[0])
                        props.setQuery(query)
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
                    Alert.alert("Something went wrong", res.status.toString())
                }
            });
        }
        bootstrapper();
    }


    if (props.type === "full") {

        return (
            <View style={Styles.search}>
                <View style={Styles.searchInputFull}>
                    <Icon name="search" size={16} color="#666" />
                    <TextInput
                        // ref={searchBox}
                        autoFocus={false}
                        style={Styles.searchInputText}
                        value={text}
                        clearTextOnFocus
                        onChangeText={(query) => { partialSearch(query); setText(query) }}
                        autoCompleteType='off'
                        placeholder={placeholder}
                        onBlur={() => { setBrands([]); setStores([]); setCategories([]); setTags([]); setText("") }}
                        placeholderTextColor="#707070"
                    />
                </View>
                <ScrollView style={Styles.searchResultContainer}>
                    {stores.map(result => {
                        if (result.name)
                            return <TouchableWithoutFeedback onPress={() => {

                            }}>
                                <Text
                                    style={Styles.searchResultText}
                                    key={result._id}
                                >
                                    {result.business.display_name} {result.name}
                                </Text>
                            </TouchableWithoutFeedback>
                    })}
                    {brands.map(result => {
                        if (result.name)
                            return <TouchableWithoutFeedback onPress={() => {
                                fullSearch(result.name, 'brand', result._id)
                            }}>
                                <Text
                                    style={Styles.searchResultText}
                                    onPress={() => { }}
                                    key={result._id}
                                >
                                    {result.name}
                                </Text>
                            </TouchableWithoutFeedback>
                    })}
                    {categories.map(result => {
                        if (result.name)
                            return <TouchableWithoutFeedback onPress={() => {
                                fullSearch(result.name, 'category', result._id)
                            }}>
                                <Text
                                    style={Styles.searchResultText}
                                    onPress={() => { }}
                                    key={result._id}
                                >
                                    {result.name}
                                </Text>
                            </TouchableWithoutFeedback>
                    })}
                    {tags.map(result => {
                        if (result.name)
                            return <TouchableWithoutFeedback onPress={() => {
                                fullSearch(result.name, 'tag', result._id)
                            }}>
                                <Text
                                    style={Styles.searchResultText}
                                    onPress={() => { }}
                                    key={result._id}
                                >
                                    {result.name}
                                </Text>
                            </TouchableWithoutFeedback>
                    })}
                </ScrollView>
            </View>
        )
    }
    else {
        return (
            <View style={Styles.search}>
                <TouchableWithoutFeedback
                    style={Styles.searchInput}
                    onPress={() => {
                        props.navigation.navigate("SearchFull", { autoFocus: true })
                    }}
                >
                    <Icon
                        name="search"
                        size={16}
                        color="#666"
                    />
                    <Text style={Styles.dummyText}>
                        {placeholder}
                    </Text>
                </TouchableWithoutFeedback>
            </View>
        )
    }
}



const Styles = StyleSheet.create({
    search: {
        flexDirection: 'column',
        paddingHorizontal: 20,
        paddingVertical: 5,
    },
    searchInput: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",

        backgroundColor: '#fff',
        paddingHorizontal: 20,

        borderColor: '#666',
        borderRadius: 8,
        elevation: 10,
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
    dummyText: {
        padding: 15,
        color: "#66666666",
        backgroundColor: "#fff"
    },
    searchResultContainer: {
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
    searchResultText: {
        marginVertical: 15,
        color: "#666"
    }
});

export default Search;