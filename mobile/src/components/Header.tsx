import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BorderlessButton } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingTop: 44,
    borderBottomWidth: 1,
    borderColor: '#dde3f0',

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    backgroundColor: '#f9fafc',
  },

  title: {
    color: '#8fa7b3',
    fontFamily: 'Nunito_600SemiBold',
    fontSize: 16,
  },
});

interface HeaderProps {
  title: string;
  showCancel?: boolean;
}

function Header(props: HeaderProps) {
  const navigation = useNavigation();
  const { title, showCancel = true } = props;

  const handleCancel = () => {
    navigation.navigate('OrphanagesMap');
  };

  return (
    <View style={styles.container}>
      <BorderlessButton onPress={navigation.goBack}>
        <Feather name="arrow-left" size={24} color="#15b6d6" />
      </BorderlessButton>

      <Text style={styles.title}>{title}</Text>

      {showCancel ? (
        <BorderlessButton onPress={handleCancel}>
          <Feather name="x" size={24} color="#ff669d" />
        </BorderlessButton>
      ) : (
        <View />
      )}
    </View>
  );
}

export default Header;
