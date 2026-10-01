import { mapsUrl } from '../../utils/maps.js';
import Icon from './Icon.jsx';

const MapLink = ({ address, compact = false }) => (
  <a
    className="map-link"
    href={mapsUrl(address)}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={`Abrir ${address} en Google Maps (nueva pestaña)`}
  >
    {compact ? 'Ver mapa' : 'Google Maps'} <Icon name="external" size={13} />
  </a>
);

export default MapLink;
