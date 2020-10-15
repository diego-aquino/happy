/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable arrow-parens */
import React, { ChangeEvent, FormEvent, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Map, Marker, TileLayer } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';
import { FiPlus } from 'react-icons/fi';

import api from '../services/api';
import Sidebar from '../components/Sidebar';
import mapMarker from '../resources/mapMarker';
import '../styles/pages/CreateOrphanage.css';

/*
TODO:
- [] Button to remove selected images
- [] Store WhatsApp number
- [] Make openOnWeekends a toggle component
*/

function CreateOrphanage() {
  const history = useHistory();

  const [position, setPosition] = useState({ latitude: 0, longitude: 0 });

  const [name, setName] = useState('');
  const [about, setAbout] = useState('');
  const [instructions, setInstructions] = useState('');
  const [openingHours, setOpeningHours] = useState('');
  const [openOnWeekends, setOpenOnWeekends] = useState(true);
  const [images, setImages] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const handleMapClick = (event: LeafletMouseEvent) => {
    const { lat, lng } = event.latlng;
    setPosition({ latitude: lat, longitude: lng });
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const { latitude, longitude } = position;

    const data = new FormData();
    data.append('name', name);
    data.append('about', about);
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
  };

  return (
    <div className="pageCreateOrphanage">
      <Sidebar />

      <main>
        <form onSubmit={handleSubmit} className="pageCreateOrphanage__form">
          <fieldset>
            <legend>Dados</legend>

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
              <label htmlFor="name">Nome</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={e => { setName(e.target.value); }}
              />
            </div>

            <div className="pageCreateOrphanage__inputBlock">
              <label htmlFor="about">
                Sobre
                {' '}
                <span>Máximo de 300 caracteres</span>
              </label>
              <textarea
                name="about"
                id="about"
                maxLength={300}
                value={about}
                onChange={e => { setAbout(e.target.value); }}
              />
            </div>

            <div className="pageCreateOrphanage__inputBlock">
              <label htmlFor="images">Fotos</label>

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
              <label htmlFor="instructions">Intruções de Visita</label>
              <textarea
                name="instructions"
                id="instructions"
                value={instructions}
                onChange={e => { setInstructions(e.target.value); }}
              />
            </div>

            <div className="pageCreateOrphanage__inputBlock">
              <label htmlFor="openingHours">Horário de Funcionamento</label>
              <input
                name="opening_hours"
                id="openingHours"
                value={openingHours}
                onChange={e => { setOpeningHours(e.target.value); }}
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
