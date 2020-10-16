import React, { useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MapView, { MapEvent, Marker } from 'react-native-maps';

import { RectButton } from 'react-native-gesture-handler';
import mapMarker from '../../images/map-marker.png';
import { SelectMapPositionStyles as styles } from '../../styles';

function SelectMapPosition() {
  const navigation = useNavigation();
  const [position, setPosition] = useState({ latitude: 0, longitude: 0 });

  const handleSelectMapPosition = (event: MapEvent) => {
    setPosition(event.nativeEvent.coordinate);
  };

  const handleNextStep = () => {
    navigation.navigate('OrphanageData', { position });
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: -7.2199515,
          longitude: -35.9261013,
          latitudeDelta: 0.008,
          longitudeDelta: 0.008,
        }}
        onPress={handleSelectMapPosition}
      >
        {position.latitude !== 0 && position.longitude !== 0 && (
          <Marker
            icon={mapMarker}
            coordinate={{
              latitude: position.latitude,
              longitude: position.longitude,
            }}
          />
        )}
      </MapView>

      {position.latitude !== 0 && position.longitude !== 0 && (
        <RectButton style={styles.nextButton} onPress={handleNextStep}>
          <Text style={styles.nextButtonText}>Próximo</Text>
        </RectButton>
      )}
    </View>
  );
}

export default SelectMapPosition;
