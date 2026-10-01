import { statusLabel } from '../../utils/pedidos.js';

const StatusBadge = ({ pedido }) => (
  <span className={`status-badge status-${pedido.estado.toLowerCase()} ${pedido.turno_inicio ? 'has-slot' : ''}`}>
    <span />{statusLabel(pedido)}
  </span>
);

export default StatusBadge;
