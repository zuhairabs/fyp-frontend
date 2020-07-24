import React, { useEffect, useState, useContext } from 'react'
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    Platform,
    StatusBar,
    Dimensions,
    ActivityIndicator,
    Alert,
    Image,
} from 'react-native'
import Icon from 'react-native-vector-icons/dist/MaterialIcons'
import { TouchableOpacity } from 'react-native-gesture-handler'

import { GlobalContext } from '../../providers/GlobalContext'

import StatusBarWhite from '../../components/StatusBar'
import StoreCard from '../../components/Cards/StoreCard/StoreCard'

const DEVICE_HEIGHT = Dimensions.get('screen').height;
const WINDOW_HEIGHT = Dimensions.get('window').height;

const Favourites = (props) => {
    const { state } = useContext(GlobalContext)

    const [all, setAll] = useState([])
    const [results, setResults] = useState([])
    const [loading, setLoading] = useState(true)
    const [dropdown, setDropdown] = useState(false)
    const [categories, setCategories] = useState([])
    const [current, setCurrent] = useState("all")

    useEffect(() => {
        fetch("https://shopout.herokuapp.com/user/allfavourites", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                authorization: "Bearer " + state.token,
            },
            body: JSON.stringify({
                cred: {
                    phone: state.user.phone,
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
    }, [])

    const switchCategory = (cat) => {
        if (cat === "all") setResults(all)
        else {
            let favs = all;
            let temp = []
            favs.forEach(fav => { if (fav.business.category === cat) temp.push(fav) })
            setResults(temp)
        }
    }

    const removeFavourite = (id) => {
        setResults(prev => {
            return prev.filter(item => item._id != id)
        })
    }

    return (
        <View style={styles.screenContainer}>
            <StatusBarWhite />

            {
                loading ?
                    <View
                        style={{
                            justifyContent: "center",
                            alignItems: "center",
                            height: WINDOW_HEIGHT - 100,
                            width: "100%"
                        }}
                    >
                        <ActivityIndicator size="large" color="#0062FF" />
                    </View>
                    :
                    <ScrollView
                        style={styles.container}
                    >

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

                        <View style={{
                            paddingHorizontal: 20,
                            marginBottom: 150,
                            justifyContent: "center",
                            alignItems: "center"
                        }}>
                            {
                                results && results.length > 0 ?
                                    results.map((item, index) => {
                                        return <StoreCard
                                            key={index}
                                            store={item}
                                            navigation={props.navigation}
                                            favourite={true}
                                            removeFavourite={removeFavourite}
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



                    </ScrollView>
            }
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
        height: DEVICE_HEIGHT,
    },
    dropdown: {
        position: "absolute",
        zIndex: 5,
        elevation: 3,
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
        marginHorizontal: 20,
        zIndex: 2,
    },
    dropdownTextBox: {
        paddingHorizontal: 20,
        paddingVertical: 15
    },
    dropdownText: {
        textTransform: "capitalize",
        color: "#666",
        fontSize: 15,
    },
})

export default Favourites