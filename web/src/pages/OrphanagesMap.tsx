/* eslint-disable arrow-parens */
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiArrowRight } from 'react-icons/fi';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';

import api from '../services/api';
import happyIcon from '../images/map-marker.svg';
import mapMarker from '../resources/mapMarker';
import '../styles/pages/OrphanagesMap.css';

interface Orphanage {
  id: number,
  name: number,
  latitude: number,
  longitude: number
}

function OrphanagesMap() {
  const [orphanages, setOrphanages] = useState<Orphanage[]>([]);

  useEffect(() => {
    api.get('/orphanages').then(response => {
      setOrphanages(response.data);
    });
  }, []);

  return (
    <div className="pageOrphanagesMap">
      <aside>
        <header>
          <img
            src={happyIcon}
            alt="Happy"
            className="pageOrphanagesMap__happyIcon"
          />

          <h2 className="pageOrphanagesMap__asideTitle">
            Escolha um orfanato no mapa
          </h2>
          <p className="pageOrphanagesMap__asideDescription">
            Muitas crianças estão esperando a sua visita :)
          </p>
        </header>

        <footer className="pageOrphanagesMap__location">
          <b className="pageOrphanagesMap__city">Campina Grande</b>
          <span className="pageOrphanagesMap__state">Paraíba</span>
        </footer>
      </aside>

      <Map
        center={[-7.2199515, -35.9261013]}
        zoom={15}
        style={{ width: '100%', height: '100%' }}
        className="pageOrphanagesMap__map"
      >
        {/* Using openstreetmap */}
        {/* <TileLayer url="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png" /> */}

        {/* Using mapbox */}
        <TileLayer url={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`} />

        {orphanages.map(orphanage => (
          <Marker
            key={orphanage.id}
            icon={mapMarker}
            position={[orphanage.latitude, orphanage.longitude]}
          >
            <Popup
              closeButton={false}
              minWidth={240}
              maxWidth={240}
              className="pageOrphanagesMap__mapPopup"
            >
              {orphanage.name}

              <Link
                to={`/orphanages/${orphanage.id}`}
                className="pageOrphanagesMap__accessOrphanage"
              >
                <FiArrowRight className="arrowRight" />
              </Link>
            </Popup>
          </Marker>
        ))}
      </Map>

      <Link to="/orphanages/create" className="pageOrphanagesMap__createOrphanage">
        <FiPlus className="plusIcon" />
      </Link>
    </div>
  );
}

export default OrphanagesMap;
