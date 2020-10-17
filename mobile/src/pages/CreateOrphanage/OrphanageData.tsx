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
import {
  validate,
  ValidationField,
} from '../../utils/validation/OrphanageDataValidation';
import { OrphanageDataStyles as styles } from '../../styles';

interface OrphanageDataRouteParams {
  position: {
    latitude: number,
    longitude: number,
  };
}

type ValidationStatus = {
  valid: boolean;
  errorMessage?: string;
};

type Validation = {
  [key in ValidationField]: ValidationStatus;
};

function OrphanageData() {
  const navigation = useNavigation();
  const route = useRoute();
  const { position } = route.params as OrphanageDataRouteParams;

  const [name, setName] = useState('');
  const [about, setAbout] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [instructions, setInstructions] = useState('');
  const [openingHours, setOpeningHours] = useState('');
  const [openOnWeekends, setOpenOnWeekends] = useState(true);
  const [images, setImages] = useState<string[]>([]);

  const [validation, setValidation] = useState<Validation>({
    name: { valid: true },
    about: { valid: true },
    whatsapp: { valid: true },
    instructions: { valid: true },
    openingHours: { valid: true },
    images: { valid: true },
  });
  const [validSubmit, setValidSubmit] = useState(true);

  const setValidationStatus = (
    field: ValidationField,
    validationStatus: ValidationStatus,
  ) => {
    setValidation(previousValidation => {
      const updatedValidation = {
        ...previousValidation,
        [field]: validationStatus,
      };

      return updatedValidation;
    });
  };

  const handleBlur = async (field: ValidationField, fieldValue: string) => {
    const validationStatus = await validate(field, fieldValue);

    setValidationStatus(field, validationStatus);

    if (!validSubmit) {
      setValidSubmit(true);
    }
  };

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

    setValidationStatus('images', { valid: true });
  };

  const everyFieldIsValid = () => Boolean(
    name && validation.name.valid
      && about && validation.about.valid
      && whatsapp && validation.whatsapp.valid
      && instructions && validation.instructions.valid
      && openingHours && validation.openingHours.valid
      && images.length > 0 && validation.images.valid,
  );

  const assessFieldsValidity = () => {
    if (!everyFieldIsValid()) {
      setValidSubmit(false);

      if (!name) {
        setValidationStatus('name', {
          valid: false,
          errorMessage: 'Este é um campo obrigatório',
        });
      }

      if (!about) {
        setValidationStatus('about', {
          valid: false,
          errorMessage: 'Este é um campo obrigatório',
        });
      }

      if (!whatsapp) {
        setValidationStatus('whatsapp', {
          valid: false,
          errorMessage: 'Este é um campo obrigatório',
        });
      }

      if (!instructions) {
        setValidationStatus('instructions', {
          valid: false,
          errorMessage: 'Este é um campo obrigatório',
        });
      }

      if (!openingHours) {
        setValidationStatus('openingHours', {
          valid: false,
          errorMessage: 'Este é um campo obrigatório',
        });
      }

      if (images.length === 0) {
        setValidationStatus('images', {
          valid: false,
          errorMessage: 'Envie pelo menos uma imagem para facilitar a identificação',
        });
      }

      return false;
    }

    return true;
  };

  const handleCreateOrphanage = async () => {
    setTimeout(async () => {
      const readyToSubmit = assessFieldsValidity();
      if (!readyToSubmit) {
        return;
      }

      const { latitude, longitude } = position;

      const data = new FormData();

      data.append('name', name);
      data.append('about', about);
      data.append('whatsapp', whatsapp);
      data.append('latitude', String(latitude));
      data.append('longitude', String(longitude));
      data.append('instructions', instructions);
      data.append('opening_hours', openingHours);
      data.append('open_on_weekends', String(openOnWeekends));

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
    }, 500);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding: 24 }}
    >
      <Text style={styles.title}>Dados</Text>

      <View style={styles.label}>
        <Text style={styles.labelText}>Nome</Text>

        {!validation.name.valid && (
          <View style={styles.validationError}>
            <Feather
              name="info"
              size={18}
              color="#ff667a"
            />
            <Text style={styles.validationErrorText}>
              {validation.name.errorMessage}
            </Text>
          </View>
        )}
      </View>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={text => setName(text)}
        onBlur={() => handleBlur('name', name)}
      />

      <View style={styles.label}>
        <Text style={styles.labelText}>Sobre</Text>

        {!validation.about.valid && (
          <View style={styles.validationError}>
            <Feather
              name="info"
              size={18}
              color="#ff667a"
            />
            <Text style={styles.validationErrorText}>
              {validation.about.errorMessage}
            </Text>
          </View>
        )}
      </View>
      <TextInput
        style={[styles.input, { height: 110 }]}
        multiline
        value={about}
        onChangeText={text => setAbout(text)}
        onBlur={() => handleBlur('about', about)}
      />

      <View style={styles.label}>
        <Text style={styles.labelText}>Whatsapp</Text>

        {!validation.whatsapp.valid && (
          <View style={styles.validationError}>
            <Feather
              name="info"
              size={18}
              color="#ff667a"
            />
            <Text style={styles.validationErrorText}>
              {validation.whatsapp.errorMessage}
            </Text>
          </View>
        )}
      </View>
      <TextInput
        style={styles.input}
        value={whatsapp}
        onChangeText={text => setWhatsapp(text)}
        onBlur={() => handleBlur('whatsapp', whatsapp)}
      />

      <View style={styles.label}>
        <Text style={styles.labelText}>Fotos</Text>

        {!validation.images.valid && (
          <View style={styles.validationError}>
            <Feather
              name="info"
              size={18}
              color="#ff667a"
            />
            <Text style={styles.validationErrorText}>
              {validation.images.errorMessage}
            </Text>
          </View>
        )}
      </View>
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

      <View style={styles.label}>
        <Text style={styles.labelText}>Instruções</Text>

        {!validation.instructions.valid && (
          <View style={styles.validationError}>
            <Feather
              name="info"
              size={18}
              color="#ff667a"
            />
            <Text style={styles.validationErrorText}>
              {validation.instructions.errorMessage}
            </Text>
          </View>
        )}
      </View>
      <TextInput
        style={[styles.input, { height: 110 }]}
        multiline
        value={instructions}
        onChangeText={text => setInstructions(text)}
        onBlur={() => handleBlur('instructions', instructions)}
      />

      <View style={styles.label}>
        <Text style={styles.labelText}>Horário de Visitação</Text>

        {!validation.openingHours.valid && (
          <View style={styles.validationError}>
            <Feather
              name="info"
              size={18}
              color="#ff667a"
            />
            <Text style={styles.validationErrorText}>
              {validation.openingHours.errorMessage}
            </Text>
          </View>
        )}
      </View>
      <TextInput
        style={styles.input}
        value={openingHours}
        onChangeText={text => setOpeningHours(text)}
        onBlur={() => handleBlur('openingHours', openingHours)}
      />

      <View style={styles.switchContainer}>
        <Text style={styles.labelText}>Atende em fins de semana</Text>
        <Switch
          thumbColor="#ffffff"
          trackColor={{ false: '#cccccc', true: '#39cc83' }}
          value={openOnWeekends}
          onValueChange={value => setOpenOnWeekends(value)}
        />
      </View>

      {!validSubmit && (
        <View style={styles.validationErrorForm}>
          <Feather
            name="info"
            size={19}
            color="#ff667a"
          />
          <Text style={styles.validationErrorFormText}>
            Oops! Verifique os dados preenchidos e tente novamente
          </Text>
        </View>
      )}

      <RectButton style={styles.submitButton} onPress={handleCreateOrphanage}>
        <Text style={styles.submitButtonText}>Cadastrar</Text>
      </RectButton>
    </ScrollView>
  );
}

export default OrphanageData;
