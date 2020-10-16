import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  title: {
    marginBottom: 32,
    paddingBottom: 24,
    borderBottomWidth: 0.8,
    borderBottomColor: '#d3e2e6',

    color: '#5c8599',
    fontSize: 24,
    fontFamily: 'Nunito_700Bold',
  },

  label: {
    marginBottom: 8,

    color: '#8fa7b3',
    fontFamily: 'Nunito_600SemiBold',
  },

  comment: {
    fontSize: 11,
    color: '#8fa7b3',
  },

  input: {
    height: 56,
    borderWidth: 1.4,
    borderColor: '#d3e2e6',
    borderRadius: 10,
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginBottom: 16,
    textAlignVertical: 'top',

    backgroundColor: '#ffffff',
  },

  imagesInput: {
    height: 56,
    borderStyle: 'dashed',
    borderColor: '#96d2f0',
    borderWidth: 1.4,
    borderRadius: 10,
    marginBottom: 32,

    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },

  uploadedImagesContainer: {
    flexDirection: 'row',
  },

  uploadedImage: {
    width: 64,
    height: 64,
    borderRadius: 10,
    marginBottom: 32,
    marginRight: 8,

    resizeMode: 'cover',
  },

  switchContainer: {
    marginTop: 16,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  submitButton: {
    height: 56,
    borderRadius: 10,
    marginTop: 32,

    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: '#15c3d6',
  },

  submitButtonText: {
    color: '#ffffff',
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 16,
  },
});

export default styles;
