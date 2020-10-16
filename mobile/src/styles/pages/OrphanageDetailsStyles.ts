import { Dimensions, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  imagesContainer: {
    height: 240,
  },

  image: {
    width: Dimensions.get('window').width,
    height: 240,
    resizeMode: 'cover',
  },

  detailsContainer: {
    padding: 24,
  },

  title: {
    color: '#4d6f80',
    fontSize: 30,
    fontFamily: 'Nunito_700Bold',
  },

  description: {
    color: '#5c8599',
    fontFamily: 'Nunito_600SemiBold',
    lineHeight: 24,
    marginTop: 16,
  },

  mapContainer: {
    borderRadius: 10,
    borderWidth: 1.2,
    borderColor: '#b3dae2',
    marginTop: 40,

    overflow: 'hidden',

    backgroundColor: '#e6f7fb',
  },

  map: {
    width: '100%',
    height: 150,
  },

  routesContainer: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  routesText: {
    color: '#0089a5',
    fontFamily: 'Nunito_700Bold',
  },

  separator: {
    height: 0.8,
    width: '100%',
    marginVertical: 40,

    backgroundColor: '#d3e2e6',
  },

  scheduleContainer: {
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  scheduleItem: {
    width: '48%',
    padding: 20,
  },

  scheduleItemBlue: {
    borderWidth: 1,
    borderColor: '#b3dae2',
    borderRadius: 10,

    backgroundColor: '#e6f7fb',
  },

  scheduleItemGreen: {
    borderWidth: 1,
    borderColor: '#a1e9c5',
    borderRadius: 10,

    backgroundColor: '#edfff6',
  },

  scheduleItemRed: {
    borderWidth: 1,
    borderColor: '#ffbcd4',
    borderRadius: 10,

    backgroundColor: '#fef6f8',
  },

  scheduleText: {
    marginTop: 20,

    fontFamily: 'Nunito_600SemiBold',
    fontSize: 16,
    lineHeight: 24,
  },

  scheduleTextBlue: {
    color: '#5c8599',
  },

  scheduleTextGreen: {
    color: '#37c77f',
  },

  scheduleTextRed: {
    color: '#ff669d',
  },

  contactButton: {
    height: 56,
    marginTop: 40,
    borderRadius: 10,

    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: '#3cdc8c',
  },

  contactButtonText: {
    marginLeft: 16,

    fontFamily: 'Nunito_800ExtraBold',
    color: '#ffffff',
    fontSize: 16,
  },
});

export default styles;
