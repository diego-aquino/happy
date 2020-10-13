import React from 'react';
import { Link } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';
import { Map, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import mapMarkerImg from '../images/map-marker.svg';
import '../styles/pages/orphanages-map.css';

function OrphanagesMap() {
  return (
    <div className="pageOrphanagesMap">
      <aside>
        <header>
          <img
            src={mapMarkerImg}
            alt="Happy"
            className="pageOrphanagesMap__mapMarker"
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
      </Map>

      <Link to="/create" className="pageOrphanagesMap__createOrphanage">
        <FiPlus className="plusIcon" />
      </Link>
    </div>
  );
}

export default OrphanagesMap;
