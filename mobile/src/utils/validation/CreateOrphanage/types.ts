import { Position } from '../../../types';

export type FieldToValidate =
  'name'
  | 'about'
  | 'whatsapp'
  | 'instructions'
  | 'openingHours'
  | 'position'
  | 'images';

export type FieldValue = string | string[] | Position;
