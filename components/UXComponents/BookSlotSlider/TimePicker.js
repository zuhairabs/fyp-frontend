import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native'
import { ScrollView, TouchableWithoutFeedback } from 'react-native-gesture-handler';

Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}
export const MINUTE = 60 * 1000

const parseTimeTo12Hour = (time) => {
    let [hours, minutes] = time.split(":"), half = " AM"
    if (Number(hours) > 12) {
        hours = (Number(hours) - 12).toString();
        half = " PM"
    }
    if (Number(hours) == 12) half = " PM"
    return hours + ":" + minutes + half
}

export const stringToTime = (s) => {
    // to create UTC time objects from string
    let newDate = new Date();
    let [hours, minutes] = s.split(":")
    newDate.setHours(hours)
    newDate.setMinutes(minutes)
    return newDate.getTime()
}

export const timeToString = (time) => {
    // to create string objects like "10:30" from UTC time
    return new Date(time).toTimeString().slice(0, 5)
}


const Dropdown = ({ list, onSelect, visible = false, selected }) => {
    const getDropdownHeight = () => {
        if (visible) return { height: 180 };
        else return { height: 0 }
    }

    return <View style={{ ...styles.dropdown, ...getDropdownHeight() }}>
        <ScrollView>
            {
                list.map((item, _) => {
                    return <TouchableOpacity onPress={() => { onSelect(item); }}
                        style={styles.dropDownItem}>
                        <Text style={{
                            color: selected === item ? "#0062FF" : "#000",
                            fontWeight: selected === item ? "bold" : "regular"
                        }}>
                            {parseTimeTo12Hour(item)}
                        </Text>
                    </TouchableOpacity>
                })
            }
        </ScrollView>
    </View >
}

const TimeSelector = ({ text = "Choose a time", selected, onChange, list }) => {
    const [expanded, expand] = useState(false);

    const onSelect = (val) => {
        expand(false);
        onChange(val)
    }

    return (
        <>
            <View style={styles.timeSelector}>
                <Text style={styles.timeText}>
                    {text}
                </Text>
                <View style={styles.timeBox}>
                    <TouchableOpacity onPress={() => { expand(!expanded) }}>
                        <Text style={styles.time}>
                            {parseTimeTo12Hour(selected)}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
            {expanded &&
                <Dropdown
                    onSelect={onSelect}
                    list={list}
                    visible={expanded}
                    selected={selected}
                />
            }
        </>
    )
}

export default function TimePicker({ start, end, setStart, setEnd, storeEnd, serviceTime = 30 }) {
    /*
        Dropdown time picker for start and end time
        User can select a time range between start and end with an interval of serviceTime minutes
        Returns strings in 24 hour format like "10:00" or "18:30" etc
        All calculations are done for 'today'
    */
    const [startTimeList, setStartList] = useState([]);
    const [endTimeList, setEndList] = useState([]);

    const createTimeList = (startTime, endTime) => {
        // create time list from start to end
        let res = []
        let min = new Date(startTime).getTime(), max = new Date(endTime).getTime()
        for (let i = min; i < max - serviceTime * MINUTE; i += serviceTime * MINUTE)
            res.push(timeToString(i))
        return res;
    }

    useEffect(() => {
        // setting initial parameters for both selectors
        let open = stringToTime(start), close = stringToTime(storeEnd)

        let minStartList = new Date(open)
        let maxStartList = new Date(close - MINUTE * serviceTime)
        setStartList(createTimeList(minStartList, maxStartList))
        let minEndList = new Date(open + MINUTE * serviceTime)
        let maxEndList = new Date(close)
        setEndList(createTimeList(minEndList, maxEndList))
    }, [])

    const onChangeStart = (val) => {
        setStart(val)
        setEnd(timeToString(stringToTime(val) + serviceTime * MINUTE))
    }
    const onChangeEnd = (val) => {
        setEnd(val)
        if (stringToTime(start) >= stringToTime(val)) {
            let adjustedStartTime = timeToString(stringToTime(val) - serviceTime * MINUTE)
            setStart(adjustedStartTime)
        }
    }

    return (
        <View style={styles.timeContainer}>
            <Text style={styles.timeHeading}>
                Please choose a slot
            </Text>
            <TimeSelector text={"Check In"}
                onChange={onChangeStart}
                selected={start}
                list={startTimeList}
            />
            <TimeSelector text={"Check Out"}
                onChange={onChangeEnd}
                selected={end || storeEnd}
                list={endTimeList}
            />
        </View>
    )
}

const styles = StyleSheet.create({
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
        width: 120,
        backgroundColor: "#fff",
        padding: 10,
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center"
    },
    time: {
        color: "#0062FF",
        fontSize: 18,
    },

    dropdown: {
        paddingVertical: 10,
        position: "absolute",
        width: 120,
        right: 20,

        zIndex: 1,
        elevation: 3,

        borderRadius: 8,
        borderColor: "#E5E5E5",
        backgroundColor: "#FFF",
    },
    dropDownItem: {
        paddingVertical: 16,
        alignItems: "center",
        zIndex: 5,
    },
    dropdownUnderlay: {
        height: Dimensions.get("window").height,
        width: Dimensions.get('window').width,
    }
});