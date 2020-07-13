import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Alert, ScrollView, View, FlatList, ActivityIndicator, Dimensions } from 'react-native';

import BigCard from './BigCard'

const CardScroll = (props) => {

    const [stores, setStores] = useState(props.stores)
    const [loading, setLoading] = useState([])

    const scrollRef = useRef();
    const [current, setCurrent] = useState(0)

    useEffect(() => {
        setLoading(false)
        changeCard();
    }, [props.stores])

    const changeCard = () => {
        // const changeCurrent = async () => {
        //     setCurrent(prev => (prev === stores.length - 1 ? 0 : prev + 1));
        // }
        // setInterval(() => {
        //     changeCurrent().then(() => {
        //         scrollRef.current?.scrollTo({
        //             animated: true,
        //             y: 0,
        //             x: Dimensions.get('window').width * current,
        //         })
        //     })
        // }, 3000);
    }

    const setSelected = event => {
        const viewSize = event.nativeEvent.layoutMeasurement.width;
        const contentOffset = event.nativeEvent.contentOffset.x;
        setCurrent(Math.floor(contentOffset / viewSize));
    }

    return (
        <View style={styles.container}>
            {
                !loading &&
                <View style={styles.indicatorContainer}>
                    {
                        stores.map((_store, index) => {
                            return <View
                                key={index + 20}
                                style={current === index ? styles.indicatorSelected : styles.indicator}
                            />
                        })
                    }
                </View>
            }
            <ScrollView
                ref={scrollRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={e => {
                    setSelected(e)
                }}
            >
                {
                    loading ? <View style={{
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                        <ActivityIndicator size="large" color="#0062FF" />
                    </View>
                        : <>
                            {
                                stores.map((store, index) => {
                                    return <BigCard key={index} store={store} navigation={props.navigation} />
                                })
                            }
                        </>
                }
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        maxHeight: 400,
        marginVertical: 5,
    },
    indicatorContainer: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        position: "absolute",
        top: 20,
        left: 45,
        // right: 30,
        zIndex: 2,
    },
    indicatorSelected: {
        paddingVertical: 1,
        paddingHorizontal: 4,
        marginHorizontal: 2,
        borderWidth: 1,
        borderColor: "#0062FF",
        borderRadius: 6,
        opacity: 1,
    },
    indicator: {
        paddingHorizontal: 2,
        marginHorizontal: 2,
        borderWidth: 1,
        borderColor: "#0062FF",
        opacity: 0.5,
        borderRadius: 6,
    }
});

export default CardScroll;