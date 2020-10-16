import { Dimensions, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },

  calloutContainer: {
    width: 160,
    height: 46,
    paddingHorizontal: 16,
    borderRadius: 16,

    justifyContent: 'center',

    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },

  calloutText: {
    color: '#0089a5',
    fontSize: 14,
    fontFamily: 'Nunito_700Bold',
  },

  footer: {
    height: 56,
    borderRadius: 10,
    paddingLeft: 24,
    paddingRight: 5,

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 32,

    backgroundColor: '#ffffff',
    elevation: 3,
  },

  footerText: {
    color: '#8fa7b3',
    fontFamily: 'Nunito_700Bold',
  },

  createOrphanageButton: {
    width: 46,
    height: 46,
    borderRadius: 20,

    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: '#15c3d6',
  },
});

export default styles;
