/* eslint-disable arrow-parens */
import React, { useEffect, useState } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, View, Text, Linking } from 'react-native';
import { useRoute } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import { RectButton, TouchableOpacity } from 'react-native-gesture-handler';
import { Feather, FontAwesome } from '@expo/vector-icons';

import api from '../services/api';
import mapMarker from '../images/map-marker.png';
import { OrphanageDetailsStyles as styles } from '../styles';

interface OrphanageDetailsRouteParams {
  id: number;
}

interface Orphanage {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  about: string;
  instructions: string;
  openingHours: string;
  openOnWeekends: boolean;
  images: Array<{
    id: number;
    url: string;
  }>,
}

function OrphanageDetails() {
  const route = useRoute();
  const { id } = route.params as OrphanageDetailsRouteParams;

  const [orphanage, setOrphanage] = useState<Orphanage>();

  useEffect(() => {
    api.get(`/orphanages/${id}`).then(response => {
      const {
        name,
        latitude,
        longitude,
        about,
        instructions,
        opening_hours: openingHours,
        open_on_weekends: openOnWeekends,
        images,
      } = response.data;

      setOrphanage({
        id,
        name,
        latitude,
        longitude,
        about,
        instructions,
        openingHours,
        openOnWeekends,
        images,
      });
    });
  }, [id]);

  const handleOpenRouteOnGoogleMaps = () => {
    Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${orphanage?.latitude},${orphanage?.longitude}`);
  };

  if (!orphanage) {
    return (
      <View
        style={[
          styles.container,
          {
            alignItems: 'center',
            justifyContent: 'center',
          },
        ]}
      >
        <Text style={styles.description}>Carregando dados...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imagesContainer}>
        <ScrollView horizontal pagingEnabled>
          {orphanage.images.map(image => (
            <Image
              key={image.id}
              style={styles.image}
              source={{
                uri: image.url,
              }}
            />
          ))}
        </ScrollView>
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{orphanage.name}</Text>
        <Text style={styles.description}>
          {orphanage.about}
        </Text>

        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: orphanage.latitude,
              longitude: orphanage.longitude,
              latitudeDelta: 0.008,
              longitudeDelta: 0.008,
            }}
            zoomEnabled={false}
            pitchEnabled={false}
            scrollEnabled={false}
            rotateEnabled={false}
          >
            <Marker
              icon={mapMarker}
              coordinate={{
                latitude: orphanage.latitude,
                longitude: orphanage.longitude,
              }}
            />
          </MapView>

          <TouchableOpacity
            style={styles.routesContainer}
            onPress={handleOpenRouteOnGoogleMaps}
          >
            <Text style={styles.routesText}>Ver rotas no Google Maps</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.separator} />

        <Text style={styles.title}>Instruções para visita</Text>
        <Text style={styles.description}>
          {orphanage.instructions}
        </Text>

        <View style={styles.scheduleContainer}>
          <View style={[styles.scheduleItem, styles.scheduleItemBlue]}>
            <Feather name="clock" size={40} color="#2ab5d1" />
            <Text style={[styles.scheduleText, styles.scheduleTextBlue]}>
              Segunda à Sexta {orphanage.openingHours}
            </Text>
          </View>

          {orphanage.openOnWeekends ? (
            <View style={[styles.scheduleItem, styles.scheduleItemGreen]}>
              <Feather name="info" size={40} color="#39cc83" />
              <Text style={[styles.scheduleText, styles.scheduleTextGreen]}>
                Atendemos em fins de semana
              </Text>
            </View>
          ) : (
            <View style={[styles.scheduleItem, styles.scheduleItemRed]}>
              <Feather name="info" size={40} color="#ff669d" />
              <Text style={[styles.scheduleText, styles.scheduleTextRed]}>
                Não atendemos em fins de semana
              </Text>
            </View>
          )}
        </View>

        {/* <RectButton style={styles.contactButton} onPress={() => {}}>
          <FontAwesome name="whatsapp" size={24} color="#ffffff" />
          <Text style={styles.contactButtonText}>Entrar em contato</Text>
        </RectButton> */}
      </View>
    </ScrollView>
  );
}

export default OrphanageDetails;
