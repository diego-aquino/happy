import { Dimensions, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },

  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },

  nextButton: {
    height: 56,
    borderRadius: 10,

    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 32,

    elevation: 2,

    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: '#15c3d6',
  },

  nextButtonText: {
    color: '#ffffff',
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 16,
  },
});

export default styles;
