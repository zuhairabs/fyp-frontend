import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';

import StarBorder from '../../svg/star-border';
import StarFilled from '../../svg/star-filled';
import {textStyles} from '../../../../styles/styles';

export default ({name, index, changeRating}) => {
  const [rating, setRating] = useState(0);

  const Star = ({i}) => (
    <TouchableWithoutFeedback
      onPress={() => {
        setRating(i);
        changeRating(index, i);
      }}
      style={{paddingHorizontal: 1}}>
      {rating >= i ? <StarFilled /> : <StarBorder />}
    </TouchableWithoutFeedback>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{name}</Text>
      <View style={styles.stars}>
        {Array.from({length: 5}, (_, k) => {
          return <Star i={k + 1} />;
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 20,
  },
  title: {
    flex: 2,
    ...textStyles.paragraphMedium,
  },
  stars: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});
