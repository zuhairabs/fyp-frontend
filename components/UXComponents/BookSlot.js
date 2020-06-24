import React, { useState, useEffect } from 'react'
import { Dimensions, View, StyleSheet, Text, Alert, TimePickerAndroid } from 'react-native'
import { TouchableWithoutFeedback, TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/dist/MaterialIcons'

import { Calendar, LocaleConfig } from 'react-native-calendars'

LocaleConfig.locales['en'] = {
  monthNames: ['JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE','JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER'],
  monthNamesShort: ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEPT','OCT','NOV','DEC'],
  dayNames: ['SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY'],
  dayNamesShort: ['S','M','T','W','T','F','S'],
  today: 'Today'
};
LocaleConfig.defaultLocale = 'en';

const DEVICE_HEIGHT = Dimensions.get('window').height;
const DEVICE_WIDTH = Dimensions.get('window').width;

const BookSlot = (props) => {
    Date.prototype.addDays = function (days) {
        var date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
    }

    const date = new Date();
    const [maxDate, _setMaxDate] = useState(date.addDays(30));
    const [minDate, _setMinDate] = useState(date.addDays(1));
    const [current, setCurrent] = useState(date.addDays(1));
    const [markedDate, setMarkedDate] = useState({});
    const [selectedDate, setSelectedDate] = useState();

    const [start, setStart] = useState("")
    const [end, setEnd] = useState("")
    const [visitors, setVisitors] = useState(1)

    const [screen, setScreen] = useState(0);

    useEffect(() => {
        // console.log(new Date(minDate.setHours(Number(props.storeData.active_hours[0].start.split(":")[0]))).toString())
        const s = props.storeData.active_hours[0].start.split(":");
        const e = props.storeData.active_hours[0].end.split(":");
        const startHours = s[0], startMin = s[1];
        const endHours = e[0], endMin = e[1];
        const startDate = new Date();
        const endDate = new Date();
        startDate.setHours(startHours)
        startDate.setMinutes(startMin)
        setStart(startDate)
        endDate.setHours(endHours)
        endDate.setMinutes(endMin)
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
    }

    const submitDate = () => {
        if (selectedDate)
            setScreen(1)
        else
            Alert.alert("Please select a date")
    }

    return (
        <View style={styles.container}>
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
                                    markedDates={markedDate}
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
                                    <Text style={styles.linkTop}>{selectedDate.toLocaleString()}</Text>
                                </View>
                                <View style={styles.timeContainer}>
                                    <Text style={styles.timeHeading}>
                                        Please choose a slot
                                    </Text>
                                    <View style={styles.timeSelector}>
                                        <Text style={styles.timeText}>Check In</Text>
                                        <View style={styles.timeBox}>
                                            <Text style={styles.time}>{start.getHours()}:{start.getMinutes() < 10 ? 0 : null}{start.getMinutes()}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.timeSelector}>
                                        <Text style={styles.timeText}>Check Out</Text>
                                        <View style={styles.timeBox}>
                                            <Text style={styles.time}>{end.getHours()}:{end.getMinutes() < 10 ? 0 : null}{end.getMinutes()}</Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={styles.iconContainer}>
                                    <View style={styles.iconItem}>
                                        <Text style={styles.timeText}>Number of People</Text>
                                        <View style={styles.iconBox}>
                                            <TouchableOpacity onPress={() => setVisitors(visitors - 1 > 0 ? visitors - 1 : visitors)}>
                                                <Text style={styles.icon}>-</Text>
                                            </TouchableOpacity>
                                            <View style={styles.visitorsContainer}>
                                                <Text style={styles.visitorsText}>{visitors}</Text>
                                            </View>
                                            <TouchableOpacity onPress={() => setVisitors(visitors + 1 < 5 ? visitors + 1 : visitors)}>
                                                <Text style={styles.icon}>+</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <View style={styles.iconItem}>
                                        <Text style={styles.timeText}>Need Assistance?</Text>
                                        <View style={styles.iconBox}>
                                            <TouchableOpacity onPress={() => { }}>
                                                <Text style={styles.checkbox}>

                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                                <View style={styles.linkContainer}>
                                    <TouchableWithoutFeedback onPress={()=>setScreen(0)}>
                                        <Text style={styles.link}>
                                            Choose another day
                                    </Text>
                                    </TouchableWithoutFeedback>
                                </View>
                                <View style={styles.buttonArea}>
                                    <TouchableOpacity style={styles.defaultButton} onPress={() => { approveBooking() }}>
                                        <Text style={styles.defaultButtonText}>confirm</Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        )
                }
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: Math.floor(DEVICE_HEIGHT / 1.08),
        backgroundColor: "#FFF",
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
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
        width: DEVICE_WIDTH - 40,
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
        color: "#fff",
        padding: 3,
        paddingHorizontal: 12,
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

export default BookSlot;