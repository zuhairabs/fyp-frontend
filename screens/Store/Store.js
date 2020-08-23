import React, {useState, useEffect, useContext} from 'react';
import {View, Text, ActivityIndicator} from 'react-native';
import {
  ScrollView,
  TouchableNativeFeedback,
  TouchableWithoutFeedback,
  FlatList,
} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/dist/MaterialIcons';

import {GlobalContext} from '../../providers/GlobalContext';

import NavbarBackButton from '../../components/Header/NavbarBackButton';
import StatusBarWhite from '../../components/StatusBar';
import MainBackground from '../../components/Backgrounds/MainBackground';
import BookSlotSlider from '../../components/BookSlotSlider/BookSlot';
import RatingBadge from '../../components/RatingBadge/RatingBadge';
import ImageHeader from './Elements/ImageHeader';
import SafetyElement from './Elements/SafetyElement';

import {styles, headerHeight} from './Styles';
import {textStyles} from '../../styles/styles';
import {Post} from '../../api/http';

import {
  saveStoreHistory,
  constructActiveHoursText,
} from './Actions/StoreActions';
import {addFav, removeFav} from './Actions/UserActions';

const Store = (props) => {
  const {store, searched, data, editSlot, previousBooking} = props.route.params;
  const {state, userActions} = useContext(GlobalContext);
  const [storeData, setStoreData] = useState({});
  const [bookSlot, setBookSlot] = useState(
    props.route.params.bookSlot || false,
  );
  const [favourite, setFavourite] = useState(false);

  useEffect(() => {
    if (state.favourites && state.favourites.indexOf(store) > -1)
      setFavourite(true);
    if (searched) saveStoreHistory(store, state.user.phone);
    getStoreData();
  }, []);

  const getStoreData = () => {
    setStoreData(data);
    fetchMissingData();
  };

  const fetchMissingData = () => {
    const body = JSON.stringify({storeData: {_id: store}});
    Post('store/fetch/details', body).then((missingData) => {
      setStoreData((prev) => ({...prev, ...missingData.store}));
    });
  };

  const getWorkingDaysText = () => {
    const working_days = storeData.working_days;
    const active_hours = storeData.active_hours;
    return constructActiveHoursText(working_days, active_hours);
  };

  const toggleFavourite = () => {
    if (!favourite)
      addFav(userActions, state, store).then(() => setFavourite(true));
    else removeFav(userActions, state, store).then(() => setFavourite(false));
  };

  return (
    <View style={styles.screenContainer}>
      <MainBackground />
      <StatusBarWhite />
      <NavbarBackButton navigation={props.navigation} />

      <ScrollView style={styles.container}>
        <View
          style={styles.contentContainer}
          contentContainerStyle={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View style={styles.ratingBadge}>
            <RatingBadge color="orange" value={storeData.avg_rating || false} />
          </View>

          {storeData.business && (
            <ImageHeader
              height={headerHeight}
              title_image={storeData.business.title_image || null}
              store={store}
            />
          )}

          <ScrollView
            style={styles.storeDetails}
            contentContainerStyle={{
              justifyContent: 'center',
              alignItems: 'flex-start',
            }}>
            <View style={styles.heading}>
              <View style={styles.headingText}>
                {storeData.business && (
                  <Text style={textStyles.serifHeader}>
                    {storeData.business.display_name}
                  </Text>
                )}
                {storeData.name === storeData.location_desc ? (
                  <Text style={styles.location}>{storeData.name}</Text>
                ) : (
                  <Text style={styles.location}>
                    {storeData.name}, {storeData.location_desc}
                  </Text>
                )}
                {storeData.displacement && (
                  <Text style={styles.location}>
                    {Math.round(storeData.displacement * 10) / 10} km
                  </Text>
                )}
              </View>
              <View style={styles.headingRight}>
                <TouchableWithoutFeedback
                  onPress={() => {
                    toggleFavourite();
                  }}
                  style={styles.favouriteIcon}>
                  {favourite ? (
                    <Icon name="favorite" size={16} color="#F30302" />
                  ) : (
                    <Icon name="favorite-border" size={16} color="#F30302" />
                  )}
                </TouchableWithoutFeedback>
                <Text style={styles.reviewCountHeading}>45 Reviews</Text>
              </View>
            </View>

            <Text style={styles.subheading}>Safety First</Text>
            <View style={styles.safetyContainer}>
              {storeData.parameters ? (
                <FlatList
                  data={storeData.parameters}
                  renderItem={({item}) => <SafetyElement item={item} />}
                  numColumns={2}
                />
              ) : (
                <ActivityIndicator />
              )}
            </View>

            <Text style={styles.subheading}>Store Time</Text>
            <View style={styles.safetyContainer}>
              {storeData.active_hours ? (
                <View style={styles.safetyElement}>
                  <Icon name="access-time" size={12} color="#0062FF" />
                  <Text style={styles.safetyElementText}>
                    {getWorkingDaysText()}
                  </Text>
                </View>
              ) : (
                <ActivityIndicator />
              )}
            </View>

            <View style={styles.detailsContainer}>
              <Text style={styles.details}>
                {storeData.description
                  ? storeData.description
                  : 'No description available'}
              </Text>
            </View>
          </ScrollView>
        </View>
      </ScrollView>
      {bookSlot && storeData.active_hours ? (
        <BookSlotSlider
          setBookSlot={setBookSlot}
          storeData={storeData}
          navigation={props.navigation}
          previousBooking={previousBooking}
          editSlot={editSlot}
        />
      ) : (
        <TouchableNativeFeedback
          onPress={() => {
            setBookSlot(true);
          }}
          style={styles.button}>
          <Text style={styles.buttonText}>BOOK SLOT</Text>
        </TouchableNativeFeedback>
      )}
    </View>
  );
};

export default Store;
