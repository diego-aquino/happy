/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable arrow-parens */
import React, { ChangeEvent, FormEvent, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Map, Marker, TileLayer } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';
import { FiPlus, FiInfo } from 'react-icons/fi';

import api from '../services/api';
import {
  validate,
  ValidationField
} from '../utils/validation/CreateOrphanageValidation';
import Sidebar from '../components/Sidebar';
import mapMarker from '../resources/mapMarker';
import '../styles/pages/CreateOrphanage.css';

/*
TODO:
- [] Button to remove selected images
- [] Store WhatsApp number
- [] Make openOnWeekends a toggle component
*/

type ValidationStatus = {
  valid: boolean;
  errorMessage?: string;
};

type Validation = {
  [key in ValidationField]: ValidationStatus;
};

function CreateOrphanage() {
  const history = useHistory();

  const [position, setPosition] = useState({ latitude: 0, longitude: 0 });

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
    images: { valid: true }
  });
  const [validSubmit, setValidSubmit] = useState(true);

  const setValidationStatus = (
    field: ValidationField,
    validationStatus: ValidationStatus
  ) => {
    setValidation(previousValidation => {
      const updatedValidation = {
        ...previousValidation,
        [field]: validationStatus
      };

      return updatedValidation;
    });
  };

  const handleMapClick = (event: LeafletMouseEvent) => {
    const { lat, lng } = event.latlng;

    setPosition({ latitude: lat, longitude: lng });
    setValidationStatus('position', { valid: true });
  };

  const handleBlur = async (field: ValidationField, fieldValue: string) => {
    const validationStatus = await validate(field, fieldValue);

    setValidationStatus(field, validationStatus);

    if (!validSubmit) {
      setValidSubmit(true);
    }
  };

  const everyFieldIsValid = () => Boolean(
    name && validation.name.valid
      && about && validation.about.valid
      && whatsapp && validation.whatsapp.valid
      && instructions && validation.instructions.valid
      && openingHours && validation.openingHours.valid
      && images.length > 0 && validation.images.valid
  );

  const assessFieldsValidity = () => {
    if (!everyFieldIsValid()) {
      setValidSubmit(false);

      if (!name) {
        setValidationStatus('name', {
          valid: false,
          errorMessage: 'Este é um campo obrigatório'
        });
      }

      if (!about) {
        setValidationStatus('about', {
          valid: false,
          errorMessage: 'Este é um campo obrigatório'
        });
      }

      if (!whatsapp) {
        setValidationStatus('whatsapp', {
          valid: false,
          errorMessage: 'Este é um campo obrigatório'
        });
      }

      if (!instructions) {
        setValidationStatus('instructions', {
          valid: false,
          errorMessage: 'Este é um campo obrigatório'
        });
      }

      if (!openingHours) {
        setValidationStatus('openingHours', {
          valid: false,
          errorMessage: 'Este é um campo obrigatório'
        });
      }

      if (position.latitude === 0 && position.longitude === 0) {
        setValidationStatus('position', {
          valid: false,
          errorMessage: 'Selecione a localização do orfanato no mapa'
        });
      }

      if (images.length === 0) {
        setValidationStatus('images', {
          valid: false,
          errorMessage: 'Envie pelo menos uma imagem para facilitar a identificação'
        });
      }

      return false;
    }

    return true;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

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

    images.forEach(image => {
      data.append('images', image);
    });

    await api.post('orphanages', data);

    alert('Cadastro realizado com sucesso!');

    history.push('/app');
  };

  const handleSelectedImages = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) {
      return;
    }

    const selectedImages = Array.from(event.target.files);
    setImages(selectedImages);

    const selectedPreviewImages = selectedImages.map(image => URL.createObjectURL(image));
    setPreviewImages(selectedPreviewImages);

    setValidationStatus('images', { valid: true });
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
                onChange={e => { setName(e.target.value); }}
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
                onChange={e => { setAbout(e.target.value); }}
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
                onChange={e => { setWhatsapp(e.target.value); }}
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
                onChange={handleSelectedImages}
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
                onChange={e => { setInstructions(e.target.value); }}
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
                onChange={e => { setOpeningHours(e.target.value); }}
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

          <button
            type="submit"
            className="pageCreateOrphanage__submit"
          >
            Confirmar
          </button>
        </form>
      </main>
    </div>
  );
}

export default CreateOrphanage;
