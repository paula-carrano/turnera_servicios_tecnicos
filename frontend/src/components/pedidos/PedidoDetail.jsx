import usePedidoDetail from '../../hooks/usePedidoDetail.js';
import { formatDateTime } from '../../utils/dateTime.js';
import ErrorMessage from '../common/ErrorMessage.jsx';
import Loading from '../common/Loading.jsx';
import Modal from '../common/Modal.jsx';
import SuccessMessage from '../common/SuccessMessage.jsx';
import PedidoComments from './PedidoComments.jsx';
import PedidoFields from './PedidoFields.jsx';
import PedidoSchedule from './PedidoSchedule.jsx';
import StatusBadge from './StatusBadge.jsx';

const PedidoDetail = ({ id, onClose, onSaved }) => {
  const {
    pedido, values, slot, estado, comments, comment,
    loading, loadError, error, commentError, notice, busy,
    changeField, changeSlot, clearSlot, changeComment, changeEstado,
    retry, save, addComment,
  } = usePedidoDetail(id, onSaved);

  const handleSubmit = (event) => {
    event.preventDefault();
    save();
  };

  const subtitle = pedido
    ? `Cuenta ${pedido.numero_cuenta} · Creado el ${formatDateTime(pedido.created_at)}`
    : 'Datos, turno e historial del servicio.';

  return (
    <Modal title="Detalle del pedido" subtitle={subtitle} onClose={onClose} busy={Boolean(busy)}>
      {loading ? (
        <Loading label="Cargando detalle…" />
      ) : loadError ? (
        <div className="dialog-body">
          <ErrorMessage message={loadError} />
          <button className="btn btn-outline-secondary" onClick={retry}>Reintentar</button>
        </div>
      ) : (
        <>
          <form onSubmit={handleSubmit}>
            <div className="dialog-body">
              <SuccessMessage message={notice} />
              <ErrorMessage message={error} />
              <fieldset disabled={Boolean(busy)}>
                <div className="section-title">
                  <h3>Datos del servicio</h3>
                  <StatusBadge pedido={pedido} />
                </div>
                <PedidoFields prefix="edit" values={values} onChange={changeField} />
                <PedidoSchedule
                  slot={slot}
                  estado={estado}
                  busy={Boolean(busy)}
                  onChangeSlot={changeSlot}
                  onChangeEstado={changeEstado}
                  onClear={clearSlot}
                />
              </fieldset>
              <div className="save-row">
                <button className="btn btn-primary" disabled={Boolean(busy)}>
                  {busy === 'save' ? 'Guardando…' : 'Guardar cambios'}
                </button>
              </div>
            </div>
          </form>
          <PedidoComments
            comments={comments}
            comment={comment}
            busy={busy}
            error={commentError}
            onChange={changeComment}
            onSubmit={addComment}
          />
          <footer className="dialog-footer">
            <button type="button" className="btn btn-light" disabled={Boolean(busy)} onClick={onClose}>
              Cerrar detalle
            </button>
          </footer>
        </>
      )}
    </Modal>
  );
};

export default PedidoDetail;
