import React from 'react'
import { Dimensions, View, StyleSheet, Text, ActivityIndicator, ToastAndroid } from 'react-native'
import { TouchableWithoutFeedback, TouchableOpacity } from 'react-native-gesture-handler';
import { Calendar, LocaleConfig } from 'react-native-calendars'
const WINDOW_HEIGHT = Dimensions.get('window').height;
const WINDOW_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('screen').height;

Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

export const monthNames = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER']
export const monthNamesShort = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEPT', 'OCT', 'NOV', 'DEC']
export const dayNames = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']
export const dayNamesShort = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
LocaleConfig.locales['en'] = {
    monthNames,
    monthNamesShort,
    dayNames,
    dayNamesShort,
    today: 'Today'
};
LocaleConfig.defaultLocale = 'en';

const StoreCalendar = ({ submitDateSelection, setSelectedDate, working_days }) => {
    const today = new Date();
    const [maxDate] = useState(today.addDays(30));
    const [minDate] = useState(today.addDays(1));
    const [current, setCurrent] = useState(today.addDays(1));
    const [markedDate, setMarkedDate] = useState({});

    const getDisabledDays = () => {
        if (working_days && working_days.length > 0) {
            if (working_days.length === 7) return {}
            const today = new Date()
            const maxDate = (new Date()).addDays(31)
            let res = {}
            for (let i = today; i.getTime() <= maxDate.getTime(); i = i.addDays(1))
                if (working_days.indexOf(i.getUTCDay()) === -1)
                    res[i.toISOString().split('T')[0]] = { disabled: true }
            return res;
        }
        else return {}
    }
    const onDaySelect = (day) => {
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
}

const styles = StyleSheet.create({

})

export default StoreCalendar