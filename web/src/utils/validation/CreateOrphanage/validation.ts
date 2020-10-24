/* eslint-disable arrow-parens */
import * as yup from 'yup';

import { Position } from '../../../types';
import { FieldToValidate, FieldValue } from './types';

const errorMessages = {
  required: 'Este é um campo obrigatório',
  maxLength: 'Este campo aceita no máximo 300 caracteres',
  whatsapp: {
    invalidFormat: 'Forneça um número válido',
    noSpecialCharacters: 'Use apenas apenas números (sem espaços)',
  },
  invalidPosition: 'Selecione a localização do orfanato no mapa',
  noImages: 'Envie pelo menos uma imagem para facilitar a identificação',
};

const performValidation = {
  name: async (nameValue: string) => {
    const nameSchema = yup.string()
      .required(errorMessages.required);

    await nameSchema.validate(nameValue);
  },

  about: async (aboutValue: string) => {
    const aboutSchema = yup.string()
      .required(errorMessages.required)
      .max(300, errorMessages.maxLength);

    await aboutSchema.validate(aboutValue);
  },

  whatsapp: async (whatsappValue: string) => {
    const nameSchema = yup.string()
      .required(errorMessages.required)
      .trim()
      .min(9, errorMessages.whatsapp.invalidFormat)
      .matches(/^[0-9 -.]+$/, errorMessages.whatsapp.invalidFormat)
      .matches(/^[^ -.]+$/, errorMessages.whatsapp.noSpecialCharacters);

    await nameSchema.validate(whatsappValue);
  },

  instructions: async (instructionsValue: string) => {
    const nameSchema = yup.string()
      .required(errorMessages.required);

    await nameSchema.validate(instructionsValue);
  },

  openingHours: async (openingHoursValue: string) => {
    const nameSchema = yup.string()
      .required(errorMessages.required);

    await nameSchema.validate(openingHoursValue);
  },

  position: async (positionValue: Position) => {
    const positionSchema = yup.object().shape({
      latitude: yup.number().notOneOf([0], errorMessages.invalidPosition),
      longitude: yup.number().notOneOf([0], errorMessages.invalidPosition),
    });

    await positionSchema.validate(positionValue);
  },

  images: async (imagesValue: File[]) => {
    const imagesSchema = yup.array().min(1, errorMessages.noImages);

    await imagesSchema.validate(imagesValue);
  },
};

async function validate(field: FieldToValidate, fieldValue: FieldValue) {
  try {
    if (field === 'position') {
      await performValidation[field](fieldValue as Position);
    } else if (field === 'images') {
      await performValidation[field](fieldValue as File[]);
    } else {
      await performValidation[field](fieldValue as string);
    }

    return { valid: true };
  } catch (validationError) {
    const { errors } = validationError as yup.ValidationError;
    const [errorMessage] = errors;

    return { valid: false, errorMessage };
  }
}

export default validate;
