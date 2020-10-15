import Leaflet from 'leaflet';

import happyIcon from '../images/map-marker.svg';

const mapMarker = Leaflet.icon({
  iconUrl: happyIcon,
  iconSize: [42, 47],
  iconAnchor: [21, 47],
  popupAnchor: [164, 7]
});

export default mapMarker;
