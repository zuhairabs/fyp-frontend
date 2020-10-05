import React, {useState, useEffect, useContext, createRef} from 'react';
import {View, Text, ActivityIndicator} from 'react-native';
import {
  ScrollView,
  TouchableWithoutFeedback,
  FlatList,
} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/dist/MaterialIcons';
import RBSheet from 'react-native-raw-bottom-sheet';

import {GlobalContext} from '../../providers/GlobalContext';

import NavbarBackButton from '../../components/Header/NavbarBackButton';
import StatusBarWhite from '../../components/StatusBar';
import MainBackground from '../../components/Backgrounds/MainBackground';
import BookSlotSlider from '../../components/BookSlotSlider/BookSlot';
import RatingBadge from '../../components/RatingBadge/RatingBadge';
import ImageHeader from './Elements/ImageHeader';
import VideoMasonry from '../../components/VideoMasonry';
import SafetyElement from './Elements/SafetyElement';

import {styles, headerHeight} from './Styles';
import {textStyles} from '../../styles/styles';

import {
  saveStoreHistory,
  constructActiveHoursText,
  getStoreVideos,
  fetchStoreData,
} from './Actions/StoreActions';
import {addFav, removeFav} from './Actions/UserActions';
import BookSlotButtons from '../../components/BookSlotSlider/Buttons';

const refRBSheet = createRef();

const Store = ({route}) => {
  const {
    store,
    searched,
    data,
    editSlot,
    previousBooking,
    bookSlot,
  } = route.params;
  const {state, userActions} = useContext(GlobalContext);
  const [storeData, setStoreData] = useState(data || {});
  const [storeVideos, setStoreVideos] = useState([]);
  const [favourite, setFavourite] = useState(false);
  const [videoSlot, setVideoSlot] = useState(false);

  useEffect(() => {
    if (state.favourites && state.favourites.indexOf(store) > -1)
      setFavourite(true);
    if (searched) saveStoreHistory(store, state.user.phone);
    fetchMissingData();
  }, []);

  const fetchMissingData = async () => {
    const missingData = await fetchStoreData(store);
    setStoreData((prev) => ({...prev, ...missingData}));
    if (bookSlot) refRBSheet.current?.open();
    const videos = await getStoreVideos(storeData.business._id);
    setStoreVideos(videos);
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

  const closeBottomSheet = () => refRBSheet.current?.close();

  return (
    <View style={styles.screenContainer}>
      <MainBackground />
      <StatusBarWhite />
      <NavbarBackButton />
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
                    {Math.round(storeData.displacement * 10) / 10} km away
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
              <Text style={styles.details}>{storeData.description}</Text>
            </View>

            {storeData.business && (
              <VideoMasonry videos={storeVideos} title="Featured Videos" />
            )}
          </ScrollView>
        </View>
      </ScrollView>
      <RBSheet
        closeOnDragDown={true}
        closeOnPressMask={true}
        closeOnPressBack={true}
        animationType="slide"
        customStyles={{
          container: styles.bottomSheetContainer,
          wrapper: styles.bottomSheetWrapper,
          draggableIcon: styles.bottomSheetDraggableIcon,
        }}
        ref={refRBSheet}>
        <BookSlotSlider
          closeBottomSheet={closeBottomSheet}
          storeData={storeData}
          previousBooking={previousBooking}
          editSlot={editSlot}
          videoSlot={videoSlot}
        />
      </RBSheet>
      {storeData.active_hours && storeData.working_days && (
        <BookSlotButtons
          primaryTitle="Go to store"
          primaryFunction={() => {
            setVideoSlot(false);
            refRBSheet.current?.open();
          }}
          secondaryTitle="Video call"
          secondaryFunction={() => {
            setVideoSlot(true);
            refRBSheet.current?.open();
          }}
        />
      )}
    </View>
  );
};

export default Store;
