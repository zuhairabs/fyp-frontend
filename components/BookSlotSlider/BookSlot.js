import React, { useState, createRef } from 'react'
import { Dimensions, View, StyleSheet, Text, ActivityIndicator, ToastAndroid } from 'react-native'
import { TouchableWithoutFeedback, TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage'
import Icon from 'react-native-vector-icons/dist/MaterialIcons'
import Modal from 'react-native-modalbox';

import Add from '../UXComponents/svg/Add.svg'
import Minus from '../UXComponents/svg/Minus.svg'
import CheckBox from '../UXComponents/svg/CheckBox.svg'
import CheckBoxFilled from '../UXComponents/svg/CheckBoxFilled.svg'

import Calendar, { monthNames } from './Calendar'
import TimePicker, { timeToString, stringToTime, MINUTE } from './TimePicker'

const WINDOW_HEIGHT = Dimensions.get('window').height;
const WINDOW_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('screen').height;


const BookSlotSlider = (props) => {
    Date.prototype.addDays = function (days) {
        var date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
    }

    const [screen, setScreen] = useState(0);
    const [selectedDate, setSelectedDate] = useState();

    // time picker
    const [start, setStart] = useState(props.storeData.active_hours[0].start)
    const [end, setEnd] = useState(timeToString(stringToTime(props.storeData.active_hours[0].start) + 30 * MINUTE))
    const [visitors, setVisitors] = useState(1)
    const [assistance, setAssistance] = useState(false)

    // error modal
    const [modalText, setModalText] = useState("");
    const [errorModal, setErrorModal] = useState(false);
    const loadingModal = createRef();

    const bootstrapper = async () => {
        let user = JSON.parse(await AsyncStorage.getItem("user"))
        let token = await AsyncStorage.getItem("jwt")
        const bookingData = {
            store: props.storeData._id,
            user: user._id,
            start: selectedDate + "T" + start + ":00.00+05:30",
            end: selectedDate + "T" + end + ":00.00+05:30",
            visitors: visitors,
            assistance: assistance,
        }
        return ({ bookingData, token, user })
    }

    const submitDate = () => {
        if (selectedDate) setScreen(1)
        else ToastAndroid.show("Please select a date", ToastAndroid.SHORT)
    }

    const getBookingApproval = () => {
        bootstrapper()
            .then(({ bookingData, token, user }) => {
                fetch('https://shopout.herokuapp.com/user/booking/approval', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "authorization": "Bearer " + token
                    },
                    body: JSON.stringify({
                        bookingData: bookingData,
                        cred: {
                            phone: user.phone
                        }
                    })
                }).then(res => {
                    if (res.status === 200) {
                        res.json().then(data => {
                            let tempApp = true;
                            data.response.forEach((resp) => {
                                if (resp[0] === false) tempApp = false;
                            });
                            if (tempApp === true) {
                                setModalText("Booking your slot")
                                bookSlot();
                            }
                            else {
                                setErrorModal(true)
                                setModalText("Slots not available for selected time and visitors")
                            }
                        })
                    }
                    else if (res.status === 404) {
                        setErrorModal(true)
                        setModalText("Slots not available for selected time and visitors")
                    }
                    else {
                        setErrorModal(true)
                        setModalText("Something went wrong please try again later")
                    }
                })
            })
    }

    const bookSlot = () => {
        bootstrapper().then(({ bookingData, token, user }) => {
            fetch('https://shopout.herokuapp.com/user/book', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": "Bearer " + token
                },
                body: JSON.stringify({
                    bookingData: bookingData,
                    cred: {
                        phone: user.phone
                    }
                })
            })
                .then(res => {
                    if (res.status === 200) {
                        res.json()
                            .then(data => {
                                props.navigation.navigate("Congratulations", {
                                    text: "Your booking has been successfully created",
                                    booking: data.booking
                                })
                            })
                    }
                    else {
                        setErrorModal(true);
                        setModalText("Something went wrong");
                    }
                })
        })
    }

    const submitBooking = () => {
        setModalText("Waiting for approval")
        setErrorModal(false)
        loadingModal.current.open();
        getBookingApproval()
    }

    return (
        <View style={styles.container}>

            <Modal
                ref={loadingModal}
                useNativeDriver={false}
                style={styles.bottomModal}
                position={"bottom"}
                swipeToClose={errorModal}
                backdropPressToClose={errorModal}
            >
                <View style={{ flexDirection: "row", justifyContent: "space-around", alignItems: "center" }}>
                    <Text style={{ fontSize: 20, marginHorizontal: 20 }}>
                        {modalText}
                    </Text>
                    {
                        !errorModal ?
                            <ActivityIndicator size="large" color="#0062FF" />
                            : null
                    }
                </View>
            </Modal>

            <View style={styles.header}>
                <Text style={styles.dummyText}>
                    0
                </Text>
                <Text style={styles.headerText}>
                    BOOK SLOT
                </Text>
                <TouchableWithoutFeedback onPress={() => { props.setBookSlot(false) }}>
                    <Icon name="close" size={24} color="#fff" />
                </TouchableWithoutFeedback>
            </View>
            <View style={styles.body}>

                {
                    screen === 0 ?
                        <>
                            <View style={styles.buttonArea}>
                                <TouchableOpacity style={styles.defaultButton} onPress={() => { submitDate() }}>
                                    <Text style={styles.defaultButtonText}>confirm</Text>
                                </TouchableOpacity>
                            </View>
                            <Calendar working_days={props.storeData.working_days} setSelectedDate={setSelectedDate} />
                        </>
                        :
                        <>
                            <View style={styles.buttonArea}>
                                <TouchableOpacity style={styles.defaultButton} onPress={() => { submitBooking() }}>
                                    <Text style={styles.defaultButtonText}>confirm</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.linkContainer}>
                                <TouchableWithoutFeedback onPress={() => setScreen(0)}>
                                    <Text style={styles.link}>
                                        Choose another day
                                    </Text>
                                </TouchableWithoutFeedback>
                            </View>

                            <View style={styles.iconContainer}>
                                <View style={styles.iconItem}>
                                    <Text style={styles.timeText}>Number of People</Text>
                                    <View style={styles.iconBox}>
                                        <TouchableOpacity onPress={() => setVisitors(visitors - 1 > 0 ? visitors - 1 : visitors)}>
                                            <Minus />
                                        </TouchableOpacity>
                                        <View style={styles.visitorsContainer}>
                                            <Text style={styles.visitorsText}>{visitors}</Text>
                                        </View>
                                        <TouchableOpacity onPress={() => setVisitors(visitors < 4 ? visitors + 1 : visitors)}>
                                            <Add />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={styles.iconItem}>
                                    <Text style={styles.timeText}>Need Assistance?</Text>
                                    <View style={styles.iconBox}>
                                        <TouchableOpacity onPress={() => { setAssistance(!assistance) }}>
                                            {
                                                assistance ? <CheckBoxFilled /> : <CheckBox />
                                            }
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>

                            <TimePicker
                                start={start}
                                end={end}
                                setStart={setStart}
                                setEnd={setEnd}
                                storeEnd={props.storeData.active_hours[0].end}
                            />

                            <View style={styles.linkContainerTop}>
                                <Text style={styles.linkTop}>
                                    {new Date(selectedDate).getUTCDate()} {monthNames[new Date(selectedDate).getUTCMonth()]} {new Date(selectedDate).getUTCFullYear()}
                                </Text>
                            </View>
                        </>
                }
            </View>
        </View >
    )
}

const styles = StyleSheet.create({
    bottomModal: {
        justifyContent: "center",
        alignItems: "center",
        height: 200,
    },
    container: {
        height: Math.floor(WINDOW_HEIGHT / 1.08),
        backgroundColor: "#FFF",
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
        paddingBottom: DEVICE_HEIGHT - WINDOW_HEIGHT
    },
    header: {
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        flex: 1,
        backgroundColor: "#0062FF",
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        paddingHorizontal: 5,
    },
    headerText: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#FFF",
    },
    dummyText: {
        opacity: 0,
    },
    body: {
        flex: 7,
        backgroundColor: "#FFF",
        marginTop: 20,
        flexDirection: "column-reverse",
    },
    buttonArea: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
        width: "100%",
        marginBottom: 20,
    },
    defaultButton: {
        width: WINDOW_WIDTH - 40,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 12,
        backgroundColor: "#0062FF",
        padding: 20,
    },
    defaultButtonText: {
        color: "#FFF",
        fontSize: 20,
        textTransform: "uppercase",
        fontWeight: "bold"
    },
    timeContainer: {
        flex: 2,
        backgroundColor: "#66666617",
        marginHorizontal: 10,
        borderRadius: 15,
        paddingHorizontal: 20,
        paddingTop: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    timeHeading: {
        flex: 1,
        color: "#66666632"
    },
    timeSelector: {
        flex: 3,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
    },
    timeText: {
        flex: 2,
        color: "#0062FF",
        fontSize: 18,
    },
    timeBox: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 10,
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center"
    },
    iconContainer: {
        flex: 2,
        backgroundColor: "#66666617",
        marginHorizontal: 10,
        borderRadius: 15,
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginTop: 20,
        justifyContent: "space-around",
        alignItems: "center",
    },
    iconBox: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "flex-end",
        borderRadius: 8,
    },
    iconItem: {
        flex: 3,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        marginVertical: 10,
    },
    icon: {
        backgroundColor: "#0062FF",
        color: "#fff",
        padding: 2,
        paddingHorizontal: 12,
        fontSize: 20,
        borderRadius: 8,
        fontWeight: "bold",
    },
    checkbox: {
        borderWidth: 2,
        borderColor: "#0062FF",
        backgroundColor: "#0062FF",
        color: "#fff",
        padding: 5,
        paddingHorizontal: 15,
        borderRadius: 8,
        fontWeight: "bold",
    },
    visitorsContainer: {
        flex: 2,
        justifyContent: "center",
        alignItems: "center"
    },
    visitorsText: {
        color: "#0062FF",
        fontSize: 18,
    },
    time: {
        color: "#0062FF",
        fontSize: 18,
    },
    linkContainer: {
        alignItems: "center",
        justifyContent: "center",
        marginTop: 50,
    },
    link: {
        color: "#0062FF",
        textTransform: "uppercase",
        textDecorationLine: "underline",
        fontSize: 18,
    },
    linkContainerTop: {
        alignItems: "center",
        justifyContent: "center",
    },
    linkTop: {
        color: "#0062FF",
        fontSize: 18,
        marginBottom: 10,
    }
})

export default BookSlotSlider;