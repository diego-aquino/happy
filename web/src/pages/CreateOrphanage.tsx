/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable arrow-parens */
import React, { ChangeEvent, FormEvent, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Map, Marker, TileLayer } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';
import { FiPlus, FiInfo } from 'react-icons/fi';

import api from '../services/api';

import { validateCreateOrphanage as validate } from '../utils/validation';
import {
  FieldToValidate,
  FieldValue,
} from '../utils/validation/CreateOrphanage/types';
import { ValidationStatus } from '../utils/validation/types';
import { Position } from '../types';

import Sidebar from '../components/Sidebar';
import mapMarker from '../resources/mapMarker';
import '../styles/pages/CreateOrphanage.css';
import TextButton from '../components/TextButton';

type GroupedFields = Array<{
  field: FieldToValidate;
  fieldValue: FieldValue;
}>

type Validation = {
  [key in FieldToValidate]: ValidationStatus;
};

function CreateOrphanage() {
  const history = useHistory();

  const [position, setPosition] = useState<Position>({
    latitude: 0,
    longitude: 0,
  });

  const [name, setName] = useState('');
  const [about, setAbout] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [instructions, setInstructions] = useState('');
  const [openingHours, setOpeningHours] = useState('');
  const [openOnWeekends, setOpenOnWeekends] = useState(true);
  const [images, setImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

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

  const handleMapClick = async (event: LeafletMouseEvent) => {
    const { lat, lng } = event.latlng;

    const newPosition: Position = {
      latitude: lat,
      longitude: lng,
    };

    setPosition(newPosition);

    const validationStatus = await validate('position', newPosition);

    if (!validSubmit && validationStatus.valid) {
      setValidSubmit(true);
    }

    setValidationStatus('position', validationStatus);
  };

  const handleSelectedImages = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    const selectedImages = Array.from(event.target.files);

    setImages(previousImages => {
      const updatedImages = [...previousImages, ...selectedImages];

      return updatedImages;
    });

    const selectedPreviewImages = selectedImages
      .map(image => URL.createObjectURL(image));

    setPreviewImages(previousPreviewImages => {
      const updatedPreviewImages = [
        ...previousPreviewImages,
        ...selectedPreviewImages,
      ];

      return updatedPreviewImages;
    });

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

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

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

    images.forEach(image => {
      data.append('images', image);
    });

    await api.post('orphanages', data);

    history.push('/orphanages/create/success', { orphanageCreated: true });
  };

  return (
    <div className="pageCreateOrphanage">
      <Sidebar />

      <main>
        <form onSubmit={handleSubmit} className="pageCreateOrphanage__form">
          <fieldset>
            <legend>Dados</legend>

            {!validation.position.valid && (
              <span className="validationError validationError--map">
                <FiInfo className="infoIcon" />
                {validation.position.errorMessage}
              </span>
            )}
            <Map
              center={[-7.2199515, -35.9261013]}
              zoom={15}
              style={{ width: '100%', height: 280 }}
              className="pageCreateOrphanage__map"
              onClick={handleMapClick}
            >
              <TileLayer
                url={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
              />

              {position.latitude !== 0 && position.longitude !== 0 && (
                <Marker
                  icon={mapMarker}
                  position={[position.latitude, position.longitude]}
                  interactive={false}
                />
              )}
            </Map>

            <div className="pageCreateOrphanage__inputBlock">
              <label htmlFor="name">
                Nome

                {!validation.name.valid && (
                  <span className="validationError">
                    <FiInfo className="infoIcon" />
                    {validation.name.errorMessage}
                  </span>
                )}
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={e => {
                  setName(e.target.value);
                  handleFieldChange('name');
                }}
                onBlur={() => { handleBlur('name', name); }}
              />
            </div>

            <div className="pageCreateOrphanage__inputBlock">
              <label htmlFor="about">
                <div className="labelBlock">
                  Sobre
                  <span>Máximo de 300 caracteres</span>
                </div>

                {!validation.about.valid && (
                  <span className="validationError">
                    <FiInfo className="infoIcon" />
                    {validation.about.errorMessage}
                  </span>
                )}
              </label>
              <textarea
                name="about"
                id="about"
                maxLength={300}
                value={about}
                onChange={e => {
                  setAbout(e.target.value);
                  handleFieldChange('about');
                }}
                onBlur={() => { handleBlur('about', about); }}
              />
            </div>

            <div className="pageCreateOrphanage__inputBlock">
              <label htmlFor="name">
                Número de Whatsapp

                {!validation.whatsapp.valid && (
                  <span className="validationError">
                    <FiInfo className="infoIcon" />
                    {validation.whatsapp.errorMessage}
                  </span>
                )}
              </label>
              <input
                type="text"
                id="whatsapp"
                value={whatsapp}
                onChange={e => {
                  setWhatsapp(e.target.value);
                  handleFieldChange('whatsapp');
                }}
                onBlur={() => { handleBlur('whatsapp', whatsapp); }}
              />
            </div>

            <div className="pageCreateOrphanage__inputBlock">
              <label htmlFor="images">
                Fotos

                {!validation.images.valid && (
                  <span className="validationError">
                    <FiInfo className="infoIcon" />
                    {validation.images.errorMessage}
                  </span>
                )}
              </label>

              <div className="pageCreateOrphanage__imagesWrapper">
                {previewImages.map(imagePreview => (
                  <img
                    key={imagePreview}
                    src={imagePreview}
                    alt={name}
                    className="pageCreateOrphanage__previewImage"
                  />
                ))}

                <label
                  htmlFor="images[]"
                  className="pageCreateOrphanage__addNewImage"
                >
                  <FiPlus className="plusIcon" />
                </label>
              </div>

              <input
                type="file"
                multiple
                id="images[]"
                onChange={(e) => {
                  handleSelectedImages(e);
                  handleFieldChange('images');
                }}
              />
            </div>
          </fieldset>

          <fieldset>
            <legend>Visitação</legend>

            <div className="pageCreateOrphanage__inputBlock">
              <label htmlFor="instructions">
                Intruções de Visita

                {!validation.instructions.valid && (
                  <span className="validationError">
                    <FiInfo className="infoIcon" />
                    {validation.instructions.errorMessage}
                  </span>
                )}
              </label>
              <textarea
                name="instructions"
                id="instructions"
                value={instructions}
                onChange={e => {
                  setInstructions(e.target.value);
                  handleFieldChange('instructions');
                }}
                onBlur={() => { handleBlur('instructions', instructions); }}
              />
            </div>

            <div className="pageCreateOrphanage__inputBlock">
              <label htmlFor="openingHours">
                Horário de Funcionamento

                {!validation.openingHours.valid && (
                  <span className="validationError">
                    <FiInfo className="infoIcon" />
                    {validation.openingHours.errorMessage}
                  </span>
                )}
              </label>
              <input
                name="opening_hours"
                id="openingHours"
                value={openingHours}
                onChange={e => {
                  setOpeningHours(e.target.value);
                  handleFieldChange('openingHours');
                }}
                onBlur={() => { handleBlur('openingHours', openingHours); }}
              />
            </div>

            <div className="pageCreateOrphanage__inputBlock">
              <label htmlFor="openOnWeekends">Atende em fins de semana</label>
              <div className="buttonSelectWrapper">
                <button
                  type="button"
                  className={openOnWeekends ? 'active' : ''}
                  onClick={() => { setOpenOnWeekends(true); }}
                >
                  Sim
                </button>
                <button
                  type="button"
                  className={!openOnWeekends ? 'active' : ''}
                  onClick={() => { setOpenOnWeekends(false); }}
                >
                  Não
                </button>
              </div>
            </div>
          </fieldset>

          {!validSubmit && (
            <span className="validationError validationError--form">
              <FiInfo className="infoIcon" />
              Oops! Verifique os dados preenchidos e tente novamente
            </span>
          )}

          <TextButton
            color="green"
            type="submit"
            className="pageCreateOrphanage__submit"
          >
            Confirmar
          </TextButton>
        </form>
      </main>
    </div>
  );
}

export default CreateOrphanage;

/*
TODO:
- [] Button to remove selected images
- [] Make openOnWeekends a toggle component
*/
