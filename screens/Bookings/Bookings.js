import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Image,
} from 'react-native';
import {
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';

import {GlobalContext} from '../../providers/GlobalContext';
import StatusBarWhite from '../../components/StatusBar';
import BookingList from './BookingList';
import {COLORS, textStyles} from '../../styles/styles';
import {Post} from '../../api/http';

const Bookings = ({navigation}) => {
  const {state} = useContext(GlobalContext);
  const [tabs] = useState([
    {
      title: 'Upcoming',
      smallCards: false,
      uri: 'user/bookings',
    },
    {
      title: 'Previous',
      smallCards: true,
      uri: 'user/bookings/archived',
    },
  ]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = (uri) => {
    if (uri) {
      const body = JSON.stringify({
        cred: {
          phone: state.user.phone,
        },
      });
      Post(uri, body, state.token).then(
        (data) => {
          setBookings(data.bookings);
          sortBookings().then(() => {
            setLoading(false);
          });
        },
        (e) => console.log(e),
      );
    }
  };

  const sortBookings = async () => {
    setBookings((prev) => {
      return prev.sort((a, b) => {
        return new Date(a.start).getTime() - new Date(b.start).getTime();
      });
    });
  };

  const changeTab = (index) => {
    const bootstrap = async (index) => {
      setSelectedTab(index);
      setLoading(true);
    };
    if (selectedTab !== index) {
      bootstrap(index).then(fetchBookings(tabs[index].uri));
    }
  };

  const removeBooking = (itemToDelete) => {
    setBookings((prev) => {
      return prev.filter((item) => item._id != itemToDelete);
    });
  };

  useEffect(() => {
    fetchBookings(tabs[0].uri);
  }, []);

  return (
    <View style={styles.screenContainer}>
      <StatusBarWhite />

      <ScrollView style={styles.container}>
        <View style={styles.tabNavigation}>
          {tabs.map((tab, index) => {
            return (
              <View key={index} style={styles.tab}>
                <TouchableWithoutFeedback
                  style={
                    index === selectedTab
                      ? styles.tabNavigationObjectSelected
                      : styles.tabNavigationObject
                  }
                  onPress={() => {
                    changeTab(index);
                  }}>
                  <Text
                    style={
                      index === selectedTab
                        ? styles.tabNavigationTextSelected
                        : styles.tabNavigationText
                    }>
                    {tab.title}
                  </Text>
                </TouchableWithoutFeedback>
              </View>
            );
          })}
        </View>
        {loading ? (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              height: Dimensions.get('window').height - 100,
              width: '100%',
            }}>
            <ActivityIndicator size="large" color="#0062FF" />
          </View>
        ) : (
          <>
            {bookings.length === 0 ? (
              <View
                style={{
                  width: Dimensions.get('window').width,
                  height: Dimensions.get('window').height - 480,
                  justifyContent: 'center',
                  flex: 1,
                  marginTop: 120,
                }}>
                <Image
                  source={require('../../components/UXComponents/svg/EmptyPage.png')}
                  style={{
                    width: undefined,
                    height: undefined,
                    flex: 1,
                    resizeMode: 'contain',
                  }}
                />
                <Text
                  style={{
                    color: '#666',
                    alignSelf: 'center',
                    textAlign: 'center',
                    marginTop: 20,
                    paddingHorizontal: 40,
                    fontSize: 16,
                  }}>
                  Nothing here!
                </Text>
              </View>
            ) : (
              <BookingList
                uri={tabs[selectedTab].uri}
                smallCards={tabs[selectedTab].smallCards}
                navigation={navigation}
                bookings={bookings}
                removeBooking={removeBooking}
              />
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    backgroundColor: COLORS.WHITE,
  },
  container: {
    height: Dimensions.get('window').height,
    marginBottom: 50,
  },
  tabNavigation: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  tab: {
    flex: 2,
  },
  tabNavigationObject: {
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.SECONDARY_TRANSPARENT,
  },
  tabNavigationObjectSelected: {
    borderBottomWidth: 3,
    borderColor: COLORS.PRIMARY,
    alignItems: 'center',
  },
  tabNavigationText: {
    ...textStyles.paragraphLarge,
    color: COLORS.SECONDARY_TRANSPARENT,
    borderBottomWidth: 1,
    borderColor: COLORS.TRANSPARENT,
    paddingBottom: 10,
    paddingHorizontal: 15,
  },
  tabNavigationTextSelected: {
    ...textStyles.paragraphLarge,
    color: COLORS.PRIMARY,
    borderBottomWidth: 1,
    borderColor: COLORS.TRANSPARENT,
    paddingBottom: 10,
    paddingHorizontal: 15,
  },
});

export default Bookings;
