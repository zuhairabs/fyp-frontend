import React, {useState, createRef, useContext, useEffect} from 'react';
import {
  Dimensions,
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import {
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/dist/MaterialIcons';
import Modal from 'react-native-modalbox';

import {GlobalContext} from '../../providers/GlobalContext';

import Add from '../UXComponents/svg/Add.svg';
import Minus from '../UXComponents/svg/Minus.svg';
import CheckBox from '../UXComponents/svg/CheckBox.svg';
import CheckBoxFilled from '../UXComponents/svg/CheckBoxFilled.svg';

import Calendar, {monthNames} from './Calendar';
import TimePicker, {timeToString, stringToTime, MINUTE} from './TimePicker';
import {textStyles, COLORS, buttons} from '../../styles/styles';
import {Post} from '../../api/http';

const WINDOW_HEIGHT = Dimensions.get('window').height;
const WINDOW_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('screen').height;

Date.prototype.addDays = function (days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
};

const BookSlotSlider = (props) => {
  const {
    storeData,
    previousBooking,
    editSlot,
    navigation,
    setBookSlot,
    videoSlot,
  } = props;
  const {state} = useContext(GlobalContext);
  const [screen, setScreen] = useState(0);
  const [selectedDate, setSelectedDate] = useState();

  // time picker
  const [start, setStart] = useState(storeData.active_hours[0].start);
  const [end, setEnd] = useState(
    timeToString(stringToTime(storeData.active_hours[0].start) + 30 * MINUTE),
  );
  const [visitors, setVisitors] = useState(
    previousBooking ? previousBooking.visitors : 1,
  );
  const [assistance, setAssistance] = useState(
    previousBooking ? previousBooking.assistance : false,
  );
  const [product, setProduct] = useState('tshirt');

  // error modal
  const [modalText, setModalText] = useState('');
  const [errorModal, setErrorModal] = useState(false);
  const loadingModal = createRef();

  const getBookingData = async () => {
    const bookingData = {
      store: storeData._id,
      user: state.user._id,
      start: selectedDate + 'T' + start + ':00.00+05:30',
      end: selectedDate + 'T' + end + ':00.00+05:30',
      visitors: visitors,
      assistance: assistance,
      type: videoSlot ? 'virtual' : 'walk-in',
      product: product,
    };
    return {bookingData};
  };

  const submitDate = () => {
    if (selectedDate) setScreen(1);
    else ToastAndroid.show('Please select a date', ToastAndroid.SHORT);
  };

  const cancelPreviousBooking = (newBooking) => {
    const body = JSON.stringify({
      bookingData: previousBooking,
      cred: {
        phone: state.user.phone,
      },
    });
    Post('user/booking/edit', body, state.token)
      .then(() => {
        navigation.reset({
          index: 1,
          routes: [
            {name: 'Home'},
            {
              name: 'Congratulations',
              params: {
                text: 'Your booking has been successfully edited!',
                booking: newBooking,
              },
              screenOptions: {
                headerShown: false,
              },
            },
          ],
        });
        setModalText('Booking created');
        setErrorModal(true);
      })
      .catch((e) => {
        setModalText(e);
        setErrorModal(true);
      });
  };

  const editBooking = () => {
    getBookingData().then(({bookingData}) => {
      const body = JSON.stringify({
        bookingData: bookingData,
        cred: {
          phone: state.user.phone,
        },
      });
      Post('user/book', body, state.token)
        .then((data) => {
          setModalText('Booking created');
          cancelPreviousBooking(data.booking);
        })
        .catch((e) => {
          setModalText(e);
          setErrorModal(true);
        });
    });
  };

  const getBookingApproval = () => {
    getBookingData().then(({bookingData}) => {
      const body = JSON.stringify({
        bookingData: bookingData,
        cred: {
          phone: state.user.phone,
        },
      });
      Post('user/booking/approval/v2', body, state.token)
        .then(() => {
          setModalText('Booking your slot');
          if (editSlot) editBooking();
          else bookSlot();
        })
        .catch(() => {
          setErrorModal(true);
          setModalText('Slots not available for selected time and visitors');
        });
    });
  };

  const bookSlot = () => {
    getBookingData().then(({bookingData}) => {
      const body = JSON.stringify({
        bookingData: bookingData,
        cred: {
          phone: state.user.phone,
        },
      });
      Post('user/book', body, state.token)
        .then((data) => {
          navigation.reset({
            index: 1,
            routes: [
              {
                name: 'Home',
              },
              {
                name: 'Congratulations',
                params: {
                  text: 'Your booking has been successfully created!',
                  booking: data.booking,
                },
                screenOptions: {
                  headerShown: false,
                },
              },
            ],
          });
          setModalText('Booking created');
          setErrorModal(true);
        })
        .catch((e) => {
          setModalText(e);
          setErrorModal(true);
        });
    });
  };

  const submitBooking = () => {
    setModalText('Waiting for approval');
    setErrorModal(false);
    loadingModal.current.open();
    getBookingApproval();
  };

  useEffect(() => {
    const cleanUp = () => {
      loadingModal.current?.close();
      setErrorModal(false);
    };
    return cleanUp();
  }, []);

  return (
    <View style={styles.container}>
      <Modal
        ref={loadingModal}
        useNativeDriver={false}
        style={styles.bottomModal}
        position={'bottom'}
        swipeToClose={errorModal}
        backdropPressToClose={errorModal}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
          }}>
          <Text
            style={{
              marginHorizontal: 20,
              ...textStyles.paragraphLarge,
              color: COLORS.BLACK,
            }}>
            {modalText}
          </Text>
          {!errorModal ? (
            <ActivityIndicator size="large" color={COLORS.PRIMARY} />
          ) : null}
        </View>
      </Modal>

      <View style={styles.header}>
        <Text style={styles.dummyText}>0</Text>
        <Text style={styles.headerText}>
          {videoSlot ? 'BOOK VIDEO SLOT' : 'BOOK SLOT'}
        </Text>
        <TouchableWithoutFeedback
          onPress={() => {
            setBookSlot(false);
          }}>
          <Icon name="close" size={24} color={COLORS.WHITE} />
        </TouchableWithoutFeedback>
      </View>
      <View style={styles.body}>
        {screen === 0 ? (
          <>
            <View style={styles.buttonArea}>
              <TouchableOpacity
                style={{...buttons.primaryButton}}
                onPress={() => {
                  submitDate();
                }}>
                <Text style={{...textStyles.primaryButtonText}}>confirm</Text>
              </TouchableOpacity>
            </View>
            <Calendar
              working_days={storeData.working_days}
              setSelectedDate={setSelectedDate}
              previousBooking={previousBooking}
            />
          </>
        ) : (
          <>
            <View style={styles.buttonArea}>
              <TouchableOpacity
                style={{...buttons.primaryButton}}
                onPress={() => {
                  submitBooking();
                }}>
                <Text style={{...textStyles.primaryButtonText}}>confirm</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.linkContainer}>
              <TouchableWithoutFeedback onPress={() => setScreen(0)}>
                <Text style={styles.link}>Choose another day</Text>
              </TouchableWithoutFeedback>
            </View>

            <View style={styles.iconContainer}>
              <View style={styles.iconItem}>
                <Text style={styles.timeText}>Number of People</Text>
                <View style={styles.iconBox}>
                  <TouchableOpacity
                    onPress={() =>
                      setVisitors(visitors - 1 > 0 ? visitors - 1 : visitors)
                    }>
                    <Minus />
                  </TouchableOpacity>
                  <View style={styles.visitorsContainer}>
                    <Text style={styles.visitorsText}>{visitors}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() =>
                      setVisitors(visitors < 4 ? visitors + 1 : visitors)
                    }>
                    <Add />
                  </TouchableOpacity>
                </View>
              </View>
              {!videoSlot && (
                <View style={styles.iconItem}>
                  <Text style={styles.timeText}>Need Assistance?</Text>
                  <View style={styles.iconBox}>
                    <TouchableOpacity
                      onPress={() => {
                        setAssistance(!assistance);
                      }}>
                      {assistance ? <CheckBoxFilled /> : <CheckBox />}
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>

            <TimePicker
              start={start}
              end={end}
              setStart={setStart}
              setEnd={setEnd}
              storeEnd={storeData.active_hours[0].end}
            />

            <View style={styles.linkContainerTop}>
              <Text style={styles.linkTop}>
                {new Date(selectedDate).getUTCDate()}{' '}
                {monthNames[new Date(selectedDate).getUTCMonth()]}{' '}
                {new Date(selectedDate).getUTCFullYear()}
              </Text>
            </View>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomModal: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 200,
  },
  container: {
    height: Math.floor(WINDOW_HEIGHT / 1.08),
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    paddingBottom: DEVICE_HEIGHT - WINDOW_HEIGHT,
  },
  header: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    flex: 1,
    backgroundColor: '#0062FF',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  headerText: {
    ...textStyles.primaryButtonText,
  },
  dummyText: {
    opacity: 0,
  },
  body: {
    flex: 7,
    backgroundColor: '#FFF',
    paddingTop: 20,
    flexDirection: 'column-reverse',
  },
  buttonArea: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  defaultButton: {
    width: WINDOW_WIDTH - 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: '#0062FF',
    padding: 20,
  },
  defaultButtonText: {
    color: '#FFF',
    fontSize: 20,
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  timeContainer: {
    flex: 2,
    backgroundColor: '#66666617',
    marginHorizontal: 10,
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeHeading: {
    flex: 1,
    color: '#66666632',
  },
  timeSelector: {
    flex: 3,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  timeText: {
    flex: 2,
    color: '#0062FF',
    fontSize: 18,
  },
  timeBox: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    flex: 2,
    backgroundColor: '#66666617',
    marginHorizontal: 10,
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 20,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  iconBox: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderRadius: 8,
  },
  iconItem: {
    flex: 3,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 10,
  },
  icon: {
    backgroundColor: '#0062FF',
    color: '#fff',
    padding: 2,
    paddingHorizontal: 12,
    fontSize: 20,
    borderRadius: 8,
    fontWeight: 'bold',
  },
  checkbox: {
    borderWidth: 2,
    borderColor: '#0062FF',
    backgroundColor: '#0062FF',
    color: '#fff',
    padding: 5,
    paddingHorizontal: 15,
    borderRadius: 8,
    fontWeight: 'bold',
  },
  visitorsContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  visitorsText: {
    color: '#0062FF',
    fontSize: 18,
  },
  time: {
    color: '#0062FF',
    fontSize: 18,
  },
  linkContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  link: {
    color: '#0062FF',
    textTransform: 'uppercase',
    textDecorationLine: 'underline',
    fontSize: 18,
  },
  linkContainerTop: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkTop: {
    color: '#0062FF',
    fontSize: 18,
    marginBottom: 10,
  },
});

export default BookSlotSlider;
