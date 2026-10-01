import { formatDateTime, formatSlot } from '../../utils/dateTime.js';
import Icon from '../common/Icon.jsx';
import MapLink from '../common/MapLink.jsx';
import StatusBadge from './StatusBadge.jsx';

const PedidoCard = ({ pedido, onOpen }) => (
  <article className="pedido-card card h-100">
    <div className="card-body">
      <div className="card-top">
        <span className="account">CUENTA <strong>{pedido.numero_cuenta}</strong></span>
        <StatusBadge pedido={pedido} />
      </div>
      <h3>{pedido.titular}</h3>
      <div className="address">
        <Icon name="pin" size={17} />
        <span>{pedido.direccion} <MapLink address={pedido.direccion} compact /></span>
      </div>
      <p className="reason">{pedido.motivo}</p>
      <div className={`slot-preview ${pedido.turno_inicio ? 'scheduled' : ''}`}>
        <Icon name="calendar" size={18} />
        <span>{formatSlot(pedido)}</span>
      </div>
      <div className="card-meta">
        <Icon name="user" size={14} />
        <span>{pedido.operador}</span>
        <span className="created">{formatDateTime(pedido.created_at)}</span>
      </div>
    </div>
    <div className="card-footer">
      <button className="open-detail" onClick={() => onOpen(pedido.id)} aria-label={`Ver pedido de ${pedido.titular}`}>
        Ver pedido <Icon name="arrow" size={17} />
      </button>
    </div>
  </article>
);

export default PedidoCard;
