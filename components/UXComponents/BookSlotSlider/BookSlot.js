import React, { useState, useEffect, createRef } from 'react'
import { Dimensions, View, StyleSheet, Text, ActivityIndicator, ToastAndroid } from 'react-native'
import { TouchableWithoutFeedback, TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage'
import Icon from 'react-native-vector-icons/dist/MaterialIcons'
import DateTimePicker from '@react-native-community/datetimepicker';
import Modal from 'react-native-modalbox';

import { Calendar, LocaleConfig } from 'react-native-calendars'

import Add from '../Add.svg'
import Minus from '../Minus.svg'
import CheckBox from '../CheckBox.svg'
import CheckBoxFilled from '../CheckBoxFilled.svg'

const monthNames = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER']

LocaleConfig.locales['en'] = {
    monthNames: ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'],
    monthNamesShort: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEPT', 'OCT', 'NOV', 'DEC'],
    dayNames: ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'],
    dayNamesShort: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
    today: 'Today'
};
LocaleConfig.defaultLocale = 'en';

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
    // calendar
    const date = new Date();
    const [maxDate, _setMaxDate] = useState(date.addDays(30));
    const [minDate, _setMinDate] = useState(date.addDays(1));
    const [current, setCurrent] = useState(date.addDays(1));
    const [markedDate, setMarkedDate] = useState({});
    const [selectedDate, setSelectedDate] = useState();

    // time picker
    const [start, setStart] = useState("")
    const [end, setEnd] = useState("")
    const [visitors, setVisitors] = useState(1)
    const [assistance, setAssistance] = useState(false)

    const [minTime, setMinTime] = useState();
    const [maxTime, setMaxTime] = useState();
    const [showTimeDialog, setShowTimeDialog] = useState(false);
    const [showTimeDialogEnd, setShowTimeDialogEnd] = useState(false);

    // error modal
    const [modalText, setModalText] = useState("");
    const [errorModal, setErrorModal] = useState(false);
    const loadingModal = createRef();

    const onChange = (event, selectedTime) => {
        setShowTimeDialog(false);
        if (selectedTime
            && selectedTime.getTime() >= minTime.getTime()
            && selectedTime.getTime() < maxTime.getTime()
        ) {
            setStart(selectedTime);
            if (Number(selectedTime.getHours()) >= Number(end.getHours()))
                setEnd(new Date(selectedTime.getTime() + 30 * 60 * 1000))
        }
    }

    const onChangeEnd = (event, selectedTime) => {
        setShowTimeDialogEnd(false);
        if (selectedDate
            && selectedTime.getTime() > start.getTime()
            && selectedTime.getTime() <= maxTime.getTime()
            && selectedTime.getTime() > minTime.getTime()
        )
            setEnd(selectedTime)
    }

    useEffect(() => {
        const s = props.storeData.active_hours[0].start.split(":");
        const e = props.storeData.active_hours[0].end.split(":");
        const startHours = s[0], startMin = s[1];
        const endHours = e[0], endMin = e[1];
        const startDate = new Date();
        const endDate = new Date();
        const maxDate = new Date();
        startDate.setHours(startHours)
        startDate.setMinutes(startMin)
        setStart(startDate)
        setMinTime(startDate)
        maxDate.setHours(endHours);
        maxDate.setMinutes(endMin);
        setMaxTime(maxDate)
        endDate.setHours(Number(startMin) > 0 ? (Number(startHours) + 1).toString() : startHours)
        endDate.setMinutes(Number(startMin) > 0 ? '00' : (Number(startMin) + 30).toString())
        setEnd(endDate)
    }, [])

    const onDayPress = (day) => {
        const selected = day.dateString;
        setCurrent(selected);
        const data = {}
        data[selected] = {
            selected: true,
            marked: true,
            selectedColor: "#0062FF",
            color: "#fff"
        }
        setMarkedDate(data);
        setSelectedDate(selected);
        getDisabledDays();
    }

    const getDisabledDays = () => {
        const working_days = props.storeData.working_days;
        if (working_days && working_days.length > 0) {
            const todayDate = new Date()
            const maxDate = (new Date()).addDays(31)
            let res = {}
            for (let i = todayDate; i.getTime() <= maxDate.getTime(); i = i.addDays(1))
                if (working_days.indexOf(i.getUTCDay()) === -1)
                    res[i.toISOString().slice(0, 10)] = {
                        disabled: true
                    }
            return res;
        }
        else return {}
    }

    const submitDate = () => {
        if (selectedDate)
            setScreen(1)
        else
            ToastAndroid.show("Please select a date", ToastAndroid.SHORT)
    }

    const submitBooking = () => {
        setModalText("Waiting for approval")
        setErrorModal(false)
        loadingModal.current.open();

        const bootstrapper = async () => {
            let user = JSON.parse(await AsyncStorage.getItem("user"))
            let token = await AsyncStorage.getItem("jwt")

            let startString = (Number(start.getHours()) > 9 ? start.getHours() : '0' + start.getHours()) + ':' + (Number(start.getMinutes()) > 9 ? start.getMinutes() : '0' + start.getMinutes())
            let endString = (Number(end.getHours()) > 9 ? end.getHours() : '0' + end.getHours()) + ':' + (Number(end.getMinutes()) > 9 ? end.getMinutes() : '0' + end.getMinutes())

            const bookingData = {
                store: props.storeData._id,
                user: user._id,
                start: selectedDate + "T" + startString + ":00.00+05:30",
                end: selectedDate + "T" + endString + ":00.00+05:30",
                visitors: visitors,
                assistance: assistance,
            }
            return ({ bookingData, token, user })
        }
        bootstrapper().then(({ bookingData, token, user }) => {
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
            })
                .then(res => {
                    if (res.status === 200) {
                        res.json().then(data => {
                            let tempApp = true;
                            data.response.forEach((resp) => {
                                if (resp[0] === false) tempApp = false;
                            });
                            if (tempApp === true) {
                                setModalText("Booking your slot")
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
                        (
                            <>
                                <Calendar style={styles.calendar}
                                    current={current}
                                    minDate={minDate}
                                    maxDate={maxDate}
                                    hideExtraDays={true}
                                    disableAllTouchEventsForDisabledDays={true}
                                    theme={{
                                        backgroundColor: "#FFF",
                                        monthTextColor: "#0062FF",
                                        textMonthFontSize: 18,

                                        indicatorColor: "#0062FF",
                                        arrowColor: "#0062FF",

                                        dayTextColor: "#0062FF",
                                        selectedDotColor: "#0062FF00",
                                        textDayHeaderFontWeight: "bold",
                                    }}
                                    onDayPress={(day) => { onDayPress(day) }}
                                    disabledDaysIndexes={[0, 6]}
                                    markedDates={{ ...markedDate, ...getDisabledDays() }}
                                />
                                <View style={styles.buttonArea}>
                                    <TouchableOpacity style={styles.defaultButton} onPress={() => { submitDate() }}>
                                        <Text style={styles.defaultButtonText}>confirm</Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        )
                        :
                        (
                            <>
                                <View style={styles.linkContainerTop}>
                                    <Text style={styles.linkTop}>
                                        {new Date(selectedDate).getUTCDate()} {monthNames[new Date(selectedDate).getUTCMonth()]} {new Date(selectedDate).getUTCFullYear()}
                                    </Text>
                                </View>
                                <View style={styles.timeContainer}>
                                    <Text style={styles.timeHeading}>
                                        Please choose a slot
                                    </Text>
                                    <View style={styles.timeSelector}>
                                        <Text style={styles.timeText}>Check In</Text>
                                        <View style={styles.timeBox}>
                                            <TouchableWithoutFeedback
                                                onPress={() => {
                                                    setShowTimeDialog(true)
                                                }}
                                            >
                                                <Text style={styles.time}>
                                                    {start.getHours() > 12 ? start.getHours() - 12 : start.getHours()}:
                                                    {start.getMinutes() < 10 ? 0 : null}{start.getMinutes()}
                                                    {start.getHours() >= 12 ?
                                                        <Text> PM</Text> : <Text> AM</Text>
                                                    }
                                                </Text>
                                            </TouchableWithoutFeedback>
                                            {showTimeDialog && (
                                                <DateTimePicker
                                                    testID="dateTimePicker"
                                                    value={start}
                                                    mode='time'
                                                    display="default"
                                                    is24Hour={false}
                                                    onChange={onChange}
                                                    minuteInterval={30}
                                                />
                                            )}
                                        </View>
                                    </View>
                                    <View style={styles.timeSelector}>
                                        <Text style={styles.timeText}>Check Out</Text>
                                        <View style={styles.timeBox}>
                                            <TouchableWithoutFeedback
                                                onPress={() => {
                                                    setShowTimeDialogEnd(true)
                                                }}
                                            >
                                                <Text style={styles.time}>
                                                    {end.getHours() > 12 ? end.getHours() - 12 : end.getHours()}:
                                                    {end.getMinutes() < 10 ? 0 : null}{end.getMinutes()}
                                                    {end.getHours() >= 12 ?
                                                        <Text> PM</Text> : <Text> AM</Text>
                                                    }
                                                </Text>
                                            </TouchableWithoutFeedback>
                                            {showTimeDialogEnd && (
                                                <DateTimePicker
                                                    testID="dateTimePicker"
                                                    value={end}
                                                    mode='time'
                                                    display="default"
                                                    is24Hour={false}
                                                    onChange={onChangeEnd}
                                                    minuteInterval={30}
                                                />
                                            )}
                                        </View>
                                    </View>
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
                                <View style={styles.linkContainer}>
                                    <TouchableWithoutFeedback onPress={() => setScreen(0)}>
                                        <Text style={styles.link}>
                                            Choose another day
                                    </Text>
                                    </TouchableWithoutFeedback>
                                </View>
                                <View style={styles.buttonArea}>
                                    <TouchableOpacity style={styles.defaultButton} onPress={() => { submitBooking() }}>
                                        <Text style={styles.defaultButtonText}>confirm</Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        )
                }
            </View >

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