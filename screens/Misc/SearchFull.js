import React, { useEffect, useState, useRef, useContext } from 'react'
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    Platform,
    StatusBar,
    Dimensions,
    TextInput,
    ActivityIndicator,
    Image,
    ToastAndroid
} from 'react-native'
import { TouchableWithoutFeedback, TouchableOpacity } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/dist/MaterialIcons'
import AwesomeDebouncePromise from 'awesome-debounce-promise';

import { GlobalContext } from '../../providers/GlobalContext'

import StatusBarWhite from '../../components/StatusBar'
import StoreCard from '../../components/Cards/StoreCard/StoreCard'

const DEVICE_HEIGHT = Dimensions.get('window').height;

const partialSearchAPI = (phone, token, query) => {
    return new Promise((resolve, reject) => {
        fetch("https://shopout.herokuapp.com/user/search/partial", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                authorization: "Bearer " + token,
            },
            body: JSON.stringify({
                cred: {
                    phone: phone,
                },
                query: query,
                city: "Mumbai",
            }),
        })
            .then(res => {
                if (res.status === 200) resolve(res)
                else reject(res.statusText)
            })
    })
}
const partialSearchDelayed = AwesomeDebouncePromise(partialSearchAPI, 30);

const SearchFull = (props) => {
    const inputBox = useRef()
    const { state } = useContext(GlobalContext)

    const [dropdownOpen, setDropdown] = useState(false)
    const [results, setResults] = useState([])
    const [query, setQuery] = useState()
    const [loading, setLoading] = useState(false)

    const placeholder = "Where do you want to visit today..."

    const [text, setText] = useState("")
    const [tags, setTags] = useState([]);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [stores, setStores] = useState([]);

    useEffect(() => {
        setLoading(true)
        const bootstrap = async () => {
            fetch("https://shopout.herokuapp.com/user/store/history/fetch", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    cred: {
                        phone: state.user.phone,
                    }
                }),
            }).then((res) => {
                if (res.status === 200) {
                    res.json().then((data) => {
                        getUniqueHistoryResults(data.response.storeHistory)
                            .then(history => {
                                setResults(history.reverse())
                                setLoading(false)
                            })
                    });
                }
                else {
                    setLoading(false)
                    setResults([])
                }
            });
        }
        bootstrap();
    }, [])

    const getUniqueHistoryResults = async (history) => {
        let uniqueArray = []
        let uniqueIdArray = []
        history.forEach(element => {
            if (uniqueIdArray.indexOf(element._id) === -1) {
                uniqueArray.push(element)
                uniqueIdArray.push(element._id)
            }
        });
        return uniqueArray
    }

    const shuffleArray = async (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    const clearPartialSearchResults = () => {
        inputBox.current?.blur()
        setStores([])
        setBrands([])
        setCategories([])
        setTags([])
        setDropdown(false)
        setText("")
    }


    const fullSearch = (query, model, id) => {
        setLoading(true);
        setDropdown(false);
        clearPartialSearchResults();
        const bootstrap = async () => {
            fetch("https://shopout.herokuapp.com/user/search/full", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    authorization: "Bearer " + state.token,
                },
                body: JSON.stringify({
                    cred: {
                        phone: state.user.phone,
                    },
                    query: query,
                    model: model,
                    city: "Mumbai",
                    _id: id,
                }),
            }).then((res) => {
                clearPartialSearchResults();
                if (res.status === 200) {
                    res.json().then((data) => {
                        let temp = []
                        data.response.forEach(resp => {
                            temp = temp.concat(resp)
                        });
                        shuffleArray(temp)
                            .then((array) => {
                                setResults(array)
                                setLoading(false)
                            })
                        setQuery(query)
                    });
                }
                else {
                    setLoading(false)
                    Alert.alert("Something went wrong", res.status.toString())
                }
            });
        }
        bootstrap();
    }

    const handleTextChange = async query => {
        setText(query);
        partialSearchDelayed(state.user.phone, state.token, query)
            .then(result => {
                result.json().then(data => {
                    if (data.response[0]) setStores(data.response[0]);
                    if (data.response[1]) setBrands(data.response[1]);
                    if (data.response[2]) setCategories(data.response[2]);
                    if (data.response[3]) setTags(data.response[3]);
                    setDropdown(true)
                });
            })
            .catch(e => ToastAndroid.show(e), ToastAndroid.SHORT);
    }

    const getDropDownStyles = () => {
        if (dropdownOpen)
            return {
                borderWidth: 1
            }
        else
            return {
                borderWidth: 0,
                height: 0
            }
    }

    return (
        <View style={styles.screenContainer}>
            <StatusBarWhite />
            {/* <Search setResults={setResults} setQuery={setQuery} /> */}


            <View style={styles.search}>
                <View style={styles.searchInputFull}>
                    <Icon name="search" size={24} color="#666" />
                    <TextInput
                        style={styles.searchInputText}
                        value={text}
                        autoCapitalize="none"
                        onChangeText={(query) => { handleTextChange(query) }}
                        autoCompleteType='off'
                        placeholder={placeholder}
                        onBlur={() => { clearPartialSearchResults(); }}
                        blurOnSubmit={true}
                        placeholderTextColor="#707070"
                        autoFocus={true}
                        ref={inputBox}
                    />
                    <TouchableWithoutFeedback
                        onPress={() => { clearPartialSearchResults(); }}
                    >
                        {
                            inputBox.current?.isFocused()
                                ?
                                <Icon name="close" size={24} color="#666" />
                                :
                                <View style={{ width: 24 }}></View>
                        }
                    </TouchableWithoutFeedback>
                </View>

                {/* DROPDOWN FOR SUGGESTIONS */}
                <ScrollView
                    style={{ ...styles.suggestionDropdown, ...getDropDownStyles() }}>
                    {stores.map(result => {
                        if (result.name)
                            return <TouchableOpacity
                                key={result._id}
                                onPress={() => {
                                    props.navigation.navigate("Store", { store: result._id })
                                }}>
                                <Text
                                    style={styles.suggestionText}
                                >
                                    {result.business.display_name} {result.name}
                                </Text>
                            </TouchableOpacity>
                    })}
                    {brands.map(result => {
                        if (result.name)
                            return <TouchableOpacity onPress={() => {
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
                            </TouchableOpacity>
                    })}
                    {categories.map(result => {
                        if (result.name)
                            return <TouchableOpacity onPress={() => {
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
                            </TouchableOpacity>
                    })}
                    {tags.map(result => {
                        if (result.name)
                            return <TouchableOpacity onPress={() => {
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
                            </TouchableOpacity>
                    })}
                </ScrollView>
            </View>

            <ScrollView
                style={styles.container}
            >
                {
                    loading ? <View
                        style={{
                            justifyContent: "center",
                            alignItems: "center",
                            height: DEVICE_HEIGHT - 80,
                            width: "100%"
                        }}>
                        <ActivityIndicator size="large" color="#0062FF" />
                    </View>
                        :
                        <>
                            <View style={styles.searchHeader}>
                                {
                                    query
                                        ? <Text style={styles.searchHeaderText}>Search results for
                                         <Text style={{ color: "#0062FF" }}> '{query}'</Text>
                                        </Text>
                                        :
                                        <Text style={styles.searchHeaderText}>
                                            Your recent searches
                                        </Text>
                                }
                            </View>

                            <View style={styles.searchResult}>
                                {
                                    results.length > 0 ?
                                        results.map((item, index) => {
                                            return <StoreCard
                                                key={index}
                                                store={item}
                                                navigation={props.navigation}
                                                searched={true}
                                            />
                                        })
                                        :
                                        <View style={{
                                            width: Dimensions.get('window').width,
                                            height: Dimensions.get('window').height - 480,
                                            justifyContent: "center",
                                            flex: 1,
                                            marginTop: 120,
                                        }}>
                                            <Image
                                                source={require('../../components/UXComponents/svg/EmptyPage.png')}
                                                style={{
                                                    width: undefined,
                                                    height: undefined,
                                                    flex: 1,
                                                    resizeMode: "contain"
                                                }}
                                            />
                                            <Text style={{
                                                color: "#666",
                                                alignSelf: "center",
                                                textAlign: "center",
                                                marginTop: 20,
                                                paddingHorizontal: 40,
                                                fontSize: 16
                                            }}
                                            >
                                                Nothing here!
                                            </Text>
                                        </View>
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
        justifyContent: "space-around",
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
        paddingHorizontal: 20,
        zIndex: 4,
        fontSize: 18,
    },
    suggestionDropdown: {
        position: "absolute",
        width: "100%",
        maxHeight: 0.6 * DEVICE_HEIGHT,

        top: 74,
        left: 20,

        paddingHorizontal: 20,

        backgroundColor: "#fff",
        borderTopWidth: 0,
        borderColor: "#707070",
        borderBottomLeftRadius: 4,
        borderBottomRightRadius: 4,

        zIndex: 2,
    },
    suggestionText: {
        marginVertical: 15,
        color: "#666",
        fontSize: 14,
    },
    searchHeaderText: {
        marginTop: 15,
        color: "#000"
    },
    searchResult: {
        paddingHorizontal: 20,
        marginTop: 20,
        marginBottom: 50,
        alignItems: "center"
    }
})

export default SearchFull