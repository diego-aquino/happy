/* eslint-disable arrow-parens */
import * as yup from 'yup';

export type ValidationField =
  'name'
  | 'about'
  | 'whatsapp'
  | 'instructions'
  | 'openingHours'
  | 'images';

const messages = {
  required: 'Este é um campo obrigatório',
  whatsapp: {
    invalidFormat: 'Forneça um número válido',
    noSpecialCharacters: 'Use apenas apenas números (sem espaços)',
  },
};

const performValidation = {
  name: async (nameValue: string) => {
    const nameSchema = yup.string().required(messages.required);
    await nameSchema.validate(nameValue);
  },

  about: async (aboutValue: string) => {
    const aboutSchema = yup.string().required(messages.required).max(300);
    await aboutSchema.validate(aboutValue);
  },

  whatsapp: async (whatsappValue: string) => {
    const nameSchema = yup.string()
      .required(messages.required)
      .trim()
      .min(9, messages.whatsapp.invalidFormat)
      .matches(/^[0-9 -.]+$/, messages.whatsapp.invalidFormat)
      .matches(/^[^ -.]+$/, messages.whatsapp.noSpecialCharacters);
    await nameSchema.validate(whatsappValue);
  },

  instructions: async (instructionsValue: string) => {
    const nameSchema = yup.string().required(messages.required);
    await nameSchema.validate(instructionsValue);
  },

  openingHours: async (openingHoursValue: string) => {
    const nameSchema = yup.string().required(messages.required);
    await nameSchema.validate(openingHoursValue);
  },

  position: async () => {},

  images: async () => {},
};

export const validate = async (
  field: ValidationField,
  fieldValue: string,
) => {
  try {
    await performValidation[field](fieldValue);

    return { valid: true, errorMessage: '' };
  } catch (validationError) {
    const { errors } = validationError as yup.ValidationError;
    const [errorMessage] = errors;

    return { valid: false, errorMessage };
  }
};
