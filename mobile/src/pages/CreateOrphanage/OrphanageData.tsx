/* eslint-disable arrow-parens */
import React, { useState } from 'react';
import { Image, Text, View } from 'react-native';
import {
  ScrollView,
  Switch,
  TextInput,
  TouchableOpacity,
  RectButton,
} from 'react-native-gesture-handler';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { Feather } from '@expo/vector-icons';

import api from '../../services/api';
import { OrphanageDataStyles as styles } from '../../styles';

interface OrphanageDataRouteParams {
  position: {
    latitude: number,
    longitude: number,
  };
}

function OrphanageData() {
  const navigation = useNavigation();
  const route = useRoute();
  const { position } = route.params as OrphanageDataRouteParams;

  const [name, setName] = useState('');
  const [about, setAbout] = useState('');
  const [instructions, setInstructions] = useState('');
  const [openingHours, setOpeningHours] = useState('');
  const [openOnWeekeds, setOpenOnWeekends] = useState(true);
  const [images, setImages] = useState<string[]>([]);

  const handleSelectImages = async () => {
    const { status } = await ImagePicker.requestCameraRollPermissionsAsync();

    if (status !== 'granted') {
      alert('Oops! Para cadastrar fotos, você precisa permitir o acesso à sua galeria...');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (result.cancelled) {
      return;
    }

    const { uri: image } = result;

    setImages([...images, image]);
  };

  const handleCreateOrphanage = async () => {
    const { latitude, longitude } = position;

    const data = new FormData();

    data.append('name', name);
    data.append('about', about);
    data.append('latitude', String(latitude));
    data.append('longitude', String(longitude));
    data.append('instructions', instructions);
    data.append('opening_hours', openingHours);
    data.append('open_on_weekends', String(openOnWeekeds));

    images.forEach((image, index) => {
      data.append('images', {
        name: `image_${index}.jpg`,
        type: 'image/jpg',
        uri: image,
      } as any);
    });

    await api.post('/orphanages', data);

    alert('Cadastro realizado com sucesso!');
    navigation.navigate('OrphanagesMap');
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding: 24 }}
    >
      <Text style={styles.title}>Dados</Text>

      <Text style={styles.label}>Nome</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={text => setName(text)}
      />

      <Text style={styles.label}>Sobre</Text>
      <TextInput
        style={[styles.input, { height: 110 }]}
        multiline
        value={about}
        onChangeText={text => setAbout(text)}
      />

      {/* <Text style={styles.label}>Whatsapp</Text>
      <TextInput style={styles.input} /> */}

      <Text style={styles.label}>Fotos</Text>
      <View style={styles.uploadedImagesContainer}>
        {images.map(image => (
          <Image
            key={image}
            style={styles.uploadedImage}
            source={{ uri: image }}
          />
        ))}
      </View>
      <TouchableOpacity
        style={styles.imagesInput}
        onPress={handleSelectImages}
      >
        <Feather name="plus" size={24} color="#15b6d6" />
      </TouchableOpacity>

      <Text style={styles.title}>Visitação</Text>

      <Text style={styles.label}>Instruções</Text>
      <TextInput
        style={[styles.input, { height: 110 }]}
        multiline
        value={instructions}
        onChangeText={text => setInstructions(text)}
      />

      <Text style={styles.label}>Horário de visitas</Text>
      <TextInput
        style={styles.input}
        value={openingHours}
        onChangeText={text => setOpeningHours(text)}
      />

      <View style={styles.switchContainer}>
        <Text style={styles.label}>Atende em fins de semana</Text>
        <Switch
          thumbColor="#ffffff"
          trackColor={{ false: '#cccccc', true: '#39cc83' }}
          value={openOnWeekeds}
          onValueChange={value => setOpenOnWeekends(value)}
        />
      </View>

      <RectButton style={styles.submitButton} onPress={handleCreateOrphanage}>
        <Text style={styles.submitButtonText}>Cadastrar</Text>
      </RectButton>
    </ScrollView>
  );
}

export default OrphanageData;
