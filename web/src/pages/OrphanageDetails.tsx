/* eslint-disable eqeqeq */
/* eslint-disable arrow-parens */
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaWhatsapp } from 'react-icons/fa';
import { FiClock, FiInfo } from 'react-icons/fi';
import { Map, Marker, TileLayer } from 'react-leaflet';

import api from '../services/api';
import Sidebar from '../components/Sidebar';
import mapMarker from '../resources/mapMarker';
import '../styles/pages/OrphanageDetails.css';

interface Orphanage {
  name: string;
  about: string;
  whatsapp: string;
  latitude: number;
  longitude: number;
  instructions: string;
  openingHours: string;
  openOnWeekends: string;
  images: Array<{
    id: number;
    url: string;
  }>;
}

interface RouteParams {
  id: string
}

/*
TODO:
- [] Improve form validation
*/

function OrphanageDetails() {
  const params = useParams<RouteParams>();
  const [orphanage, setOrphanage] = useState<Orphanage>();
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    api.get(`/orphanages/${params.id}`).then(response => {
      const {
        name,
        about,
        whatsapp,
        latitude,
        longitude,
        instructions,
        opening_hours: openingHours,
        open_on_weekends: openOnWeekends,
        images
      } = response.data;

      setOrphanage({
        name,
        about,
        whatsapp,
        latitude,
        longitude,
        instructions,
        openingHours,
        openOnWeekends,
        images
      });
    });
  }, [params.id]);

  if (!orphanage) {
    return <h4>Buscando informações do orfanato...</h4>;
  }

  return (
    <div className="pageOrphanageDetails">
      <Sidebar />

      <main>
        <div className="pageOrphanageDetails__orphanageDetails">
          <img
            src={orphanage.images[activeImageIndex].url}
            alt={orphanage.name}
            className="pageOrphanageDetails__orphanageFeaturedImage"
          />

          <div className="pageOrphanageDetails__orphanageImages">
            {orphanage.images.map((image, index) => (
              <button
                key={image.id}
                className={`
                  imageWrapper
                  ${index == activeImageIndex ? 'active' : ''}
                `}
                type="button"
                onClick={() => { setActiveImageIndex(index); }}
              >
                <img src={image.url} alt={orphanage.name} />
              </button>
            ))}
          </div>

          <div className="pageOrphanageDetails__orphanageDetailsContent">
            <h1 className="pageOrphanageDetails__orphanageName">
              {orphanage.name}
            </h1>
            <p className="pageOrphanageDetails__orphanageAbout">
              {orphanage.about}
            </p>

            <div className="pageOrphanageDetails__mapWrapper">
              <Map
                center={[orphanage.latitude, orphanage.longitude]}
                zoom={16}
                style={{ width: '100%', height: 280 }}
                dragging={false}
                touchZoom={false}
                zoomControl={false}
                scrollWheelZoom={false}
                doubleClickZoom={false}
              >
                <TileLayer
                  url={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
                />

                <Marker
                  icon={mapMarker}
                  position={[orphanage.latitude, orphanage.longitude]}
                  interactive={false}
                />
              </Map>

              <footer>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`https://www.google.com/maps/dir/?api=1&destination=${orphanage.latitude},${orphanage.longitude}`}
                  className="accessRoutes"
                >
                  Ver rotas no Google Maps
                </a>
              </footer>
            </div>

            <hr />

            <h2 className="pageOrphanageDetails__orphanageInstructionsHeading">
              Instruções para visita
            </h2>
            <p className="pageOrphanageDetails__orphanageInstructions">
              {orphanage.instructions}
            </p>

            <div className="pageOrphanageDetails__orphanageOpenDetails">
              <div className="pageOrphanageDetails__openingHours">
                <FiClock className="clockIcon" />
                Segunda à Sexta
                <br />
                {orphanage.openingHours}
              </div>

              {orphanage.openOnWeekends ? (
                <div className="pageOrphanageDetails__openOnWeekends open">
                  <FiInfo className="infoIcon" />
                  Atendemos
                  <br />
                  em fins de semana
                </div>
              ) : (
                <div className="pageOrphanageDetails__openOnWeekends closed">
                  <FiInfo className="infoIcon" />
                  Não atendemos
                  <br />
                  em fins de semana
                </div>
              )}
            </div>

            <a
              className="pageOrphanageDetails__contact"
              target="_blank"
              rel="noopener noreferrer"
              href={`https://api.whatsapp.com/send?1=pt_BR&phone=55${orphanage.whatsapp}`}
            >
              <FaWhatsapp className="whatsappIcon" />
              Entrar em contato
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}

export default OrphanageDetails;
