import React, {useContext} from 'react';
import {Text, View, StyleSheet, Image} from 'react-native';
import {
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/dist/MaterialIcons';
import {GlobalContext} from '../../../providers/GlobalContext';

import RatingBadge from '../../RatingBadge/RatingBadge';
import BookButton from '../../Buttons/BookButton';
import {removeFav} from '../../../screens/Store/Actions/UserActions';
import {COLORS, textStyles} from '../../../styles/styles';

const StoreCard = (props) => {
  const {state, userActions} = useContext(GlobalContext);
  const removeFavourite = () =>
    removeFav(userActions, state, props.store._id).then(() =>
      props.removeFavourite(props.store._id),
    );

  return (
    <View style={styles.container}>
      <View style={styles.details}>
        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate('Store', {
              store: props.store._id,
              data: props.store,
              searched: props.searched ? true : false,
            });
          }}
          style={styles.imageContainer}>
          <Image
            source={{
              uri: `data:image/gif;base64,${
                props.store.business.title_image || props.store.business.logo
              }`,
            }}
            style={styles.image}
          />
          <View style={styles.imageFiller}></View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cardContent}
          onPress={() => {
            props.navigation.navigate('Store', {
              store: props.store._id,
              data: props.store,
              searched: props.searched ? true : false,
            });
          }}>
          <View>
            <Text style={styles.heading} numberOfLines={1}>
              {props.store.business.display_name} {props.store.name}
            </Text>
            <View style={styles.subheading}>
              <Text style={styles.subheadingText}>
                {props.store.business.category}
              </Text>
              <Text style={styles.subheadingText}>
                {props.store.name}, {props.store.location_desc}
              </Text>
            </View>
          </View>
          {props.noBookButton ? null : (
            <TouchableOpacity
              onPress={() => {
                props.navigation.navigate('Store', {
                  store: props.store._id,
                  data: props.store,
                  bookSlot: true,
                });
              }}>
              <BookButton />
            </TouchableOpacity>
          )}
        </TouchableOpacity>
      </View>
      <View style={styles.rating}>
        {props.favourite ? (
          <TouchableWithoutFeedback
            onPress={() => {
              removeFavourite();
            }}
            style={styles.favouriteIcon}>
            <Icon name="favorite" size={16} color={COLORS.RED} />
          </TouchableWithoutFeedback>
        ) : (
          <RatingBadge value={props.store.avg_rating || 4.5} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: COLORS.BORDER_LIGHT,
    paddingVertical: 10,
  },
  rating: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  details: {
    flex: 7,
    flexDirection: 'row',
  },
  imageContainer: {
    flex: 2,
    justifyContent: 'space-around',
    width: 80,
    borderRadius: 6,
  },
  imageFiller: {
    flex: 1,
  },
  image: {
    height: undefined,
    width: undefined,
    flex: 4,
    borderRadius: 6,
    resizeMode: 'contain',
  },
  cardContent: {
    flex: 5,
    paddingHorizontal: 10,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  heading: {
    ...textStyles.paragraphLarge,
    color: COLORS.SECONDARY,
  },
  subheading: {
    paddingVertical: 10,
  },
  subheadingText: {
    ...textStyles.paragraphSmall,
    color: COLORS.SECONDARY,
    textTransform: 'capitalize',
  },
  favouriteIcon: {
    elevation: 5,
    backgroundColor: COLORS.WHITE,
    padding: 10,
    borderRadius: 40 / 2,
    zIndex: 2,
  },
});

export default StoreCard;
