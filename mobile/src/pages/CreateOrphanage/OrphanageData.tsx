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

import { validateCreateOrphanage as validate } from '../../utils/validation';
import {
  FieldToValidate,
  FieldValue,
} from '../../utils/validation/CreateOrphanage/types';
import { ValidationStatus } from '../../utils/validation/types';

import { OrphanageDataStyles as styles } from '../../styles';

interface OrphanageDataRouteParams {
  position: {
    latitude: number,
    longitude: number,
  };
}

type GroupedFields = Array<{
  field: FieldToValidate;
  fieldValue: FieldValue;
}>

type Validation = {
  [key in FieldToValidate]: ValidationStatus;
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
    position: { valid: true },
    images: { valid: true },
  });
  const [validSubmit, setValidSubmit] = useState(true);

  const setValidationStatus = (
    field: FieldToValidate,
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

    setImages(previousImages => [...previousImages, image]);

    setValidationStatus('images', { valid: true });
  };

  const assessFieldValidity = async (
    field: FieldToValidate,
    fieldValue: FieldValue,
    options?: { preparingToSubmit: boolean },
  ) => {
    const validationStatus = await validate(field, fieldValue);

    setValidationStatus(field, validationStatus);

    if (options?.preparingToSubmit && !validationStatus.valid) {
      setValidSubmit(false);
    }

    return { validField: validationStatus.valid };
  };

  const handleFieldChange = (field: FieldToValidate) => {
    setValidationStatus(field, { valid: true });

    if (!validSubmit) {
      setValidSubmit(true);
    }
  };

  const handleBlur = (field: FieldToValidate, fieldValue: FieldValue) => {
    assessFieldValidity(field, fieldValue);
  };

  const assessValidityOfAllFields = async () => {
    const fields: GroupedFields = [
      {
        field: 'name',
        fieldValue: name,
      },
      {
        field: 'about',
        fieldValue: about,
      },
      {
        field: 'whatsapp',
        fieldValue: whatsapp,
      },
      {
        field: 'instructions',
        fieldValue: instructions,
      },
      {
        field: 'openingHours',
        fieldValue: openingHours,
      },
      {
        field: 'position',
        fieldValue: position,
      },
      {
        field: 'images',
        fieldValue: images,
      },
    ];

    const validityChecksPromises = fields.map(({ field, fieldValue }) => (
      assessFieldValidity(field, fieldValue, { preparingToSubmit: true })
    ));

    const validityChecks = await Promise.all(validityChecksPromises);

    const allValidFields = validityChecks
      .every(validity => validity.validField);

    return allValidFields;
  };

  const handleCreateOrphanage = async () => {
    const readyToSubmit = await assessValidityOfAllFields();
    if (!readyToSubmit) return;

    const { latitude, longitude } = position;

    const data = new FormData();
    data.append('name', name.trim());
    data.append('about', about.trim());
    data.append('whatsapp', whatsapp.trim());
    data.append('latitude', String(latitude));
    data.append('longitude', String(longitude));
    data.append('instructions', instructions.trim());
    data.append('opening_hours', openingHours.trim());
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
        onChangeText={text => {
          setName(text);
          handleFieldChange('name');
        }}
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
        onChangeText={text => {
          setAbout(text);
          handleFieldChange('about');
        }}
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
        onChangeText={text => {
          setWhatsapp(text);
          handleFieldChange('whatsapp');
        }}
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
        onChangeText={text => {
          setInstructions(text);
          handleFieldChange('instructions');
        }}
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
        onChangeText={text => {
          setOpeningHours(text);
          handleFieldChange('openingHours');
        }}
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
