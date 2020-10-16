/* eslint-disable arrow-parens */
import React, { useState } from 'react';
import { View, Text } from 'react-native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

import api from '../services/api';
import mapMarker from '../images/map-marker.png';
import { OrphanagesMapStyles as styles } from '../styles';

interface Orphanage {
  id: number
  name: string,
  latitude: number,
  longitude: number,
}

function OrphanagesMap() {
  const navigation = useNavigation();
  const [orphanages, setOrphanages] = useState<Orphanage[]>([]);

  useFocusEffect(() => {
    api.get('/orphanages').then(response => {
      setOrphanages(response.data);
    });
  });

  const handleNavigateToOrphanageDetails = (id: number) => {
    navigation.navigate('OrphanageDetails', { id });
  };

  const handleNavigateToCreateOrphanage = () => {
    navigation.navigate('SelectMapPosition');
  };

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: -7.2199515,
          longitude: -35.9261013,
          latitudeDelta: 0.009,
          longitudeDelta: 0.009,
        }}
      >
        {orphanages.map(orphanage => (
          <Marker
            key={orphanage.id}
            icon={mapMarker}
            calloutAnchor={{ x: 2.8, y: 0.85 }}
            coordinate={{
              latitude: orphanage.latitude,
              longitude: orphanage.longitude,
            }}
          >
            <Callout
              tooltip
              onPress={() => {
                handleNavigateToOrphanageDetails(orphanage.id);
              }}>
              <View style={styles.calloutContainer}>
                <Text style={styles.calloutText}>{orphanage.name}</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>{orphanages.length} orfanatos encontrados</Text>

        <RectButton
          style={styles.createOrphanageButton}
          onPress={handleNavigateToCreateOrphanage}
        >
          <Feather name="plus" size={20} color='#ffffff' />
        </RectButton>
      </View>
    </View>
  );
}

export default OrphanagesMap;
